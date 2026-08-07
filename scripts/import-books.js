import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { bookDirectories } from "../config/books.js";
import {
  databasePath,
  projectRoot,
  schemaPath,
} from "../config/database.js";
import { openDatabase } from "../server/db.js";
import { initializeDatabase } from "./init-db.js";
import { loadCanonicalBook } from "./lib/book-parser.js";
import {
  populateDatabase,
  validatePopulatedDatabase,
} from "./lib/database-import.js";

export const defaultImportReportPath = path.join(
  projectRoot,
  "docs",
  "import-report.md",
);

export class ImportCountMismatchError extends Error {
  constructor(discrepancies) {
    super(
      `Parsed reference counts differ in ${discrepancies.length} chapter(s); database was not published.`,
    );
    this.name = "ImportCountMismatchError";
    this.discrepancies = discrepancies;
  }
}

function markdownEscape(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function bookReportRows(books) {
  return books.map((book) => ({
    slug: book.slug,
    title: book.metadata.title,
    chaptersExpected: book.metadata.chapterCount,
    chaptersParsed: book.parsedChapterCount,
    paragraphsExpected: book.metadata.paragraphCount,
    paragraphsParsed: book.parsedParagraphCount,
    sentencesExpected: book.metadata.sentenceCount,
    sentencesParsed: book.parsedSentenceCount,
    characters: book.metadata.characters.length,
    characterAliases: book.metadata.characters.reduce(
      (total, item) => total + item.aliases.length + (item.ambiguousAliases?.length ?? 0),
      0,
    ),
    locations: book.metadata.locations.length,
    locationAliases: book.metadata.locations.reduce(
      (total, item) => total + item.aliases.length + (item.ambiguousAliases?.length ?? 0),
      0,
    ),
    locationSourceField: book.metadata.locationSourceField,
  }));
}

export function buildImportReport({
  status,
  books,
  discrepancies = [],
  validation = null,
  error = null,
  publishedPath = null,
  warnings = [],
}) {
  const rows = bookReportRows(books);
  const lines = [
    "# Jane Austen Database Import Report",
    "",
    "## Execution status",
    "",
    `- **Status:** ${status}`,
    `- **Generated:** ${new Date().toISOString()}`,
    `- **Configured books:** ${bookDirectories.length}`,
    `- **Books processed:** ${books.length}`,
    `- **Published database:** ${publishedPath ? `\`${publishedPath}\`` : "No"}`,
    "",
  ];

  if (error) {
    lines.push("## Failure", "", "```text", error.message, "```", "");
  }

  lines.push(
    "## Book totals",
    "",
    "| Book | Chapters E/P | Paragraphs E/P | Sentences E/P | Characters | Character aliases | Locations | Location aliases |",
    "|---|---:|---:|---:|---:|---:|---:|---:|",
  );

  for (const row of rows) {
    lines.push(
      `| ${markdownEscape(row.title)} (\`${row.slug}\`) | ${row.chaptersExpected}/${row.chaptersParsed} | ${row.paragraphsExpected}/${row.paragraphsParsed} | ${row.sentencesExpected}/${row.sentencesParsed} | ${row.characters} | ${row.characterAliases} | ${row.locations} | ${row.locationAliases} |`,
    );
  }
  if (rows.length === 0) {
    lines.push("| _No books completed_ | — | — | — | — | — | — | — |");
  }
  lines.push("");

  lines.push("## Chapter-level discrepancies", "");
  if (discrepancies.length === 0) {
    lines.push("No chapter-level count discrepancies were found.", "");
  } else {
    for (const discrepancy of discrepancies) {
      lines.push(
        `### ${discrepancy.bookTitle}: ${discrepancy.chapterTitle}`,
        "",
        `- **Book:** \`${discrepancy.bookId}\``,
        `- **Chapter:** \`${discrepancy.chapterId}\` (ordinal ${discrepancy.chapterOrdinal})`,
        `- **Expected paragraphs:** ${discrepancy.expectedParagraphs}`,
        `- **Parsed paragraphs:** ${discrepancy.parsedParagraphs}`,
        `- **Expected sentences:** ${discrepancy.expectedSentences}`,
        `- **Parsed sentences:** ${discrepancy.parsedSentences}`,
        `- **Result:** ${
          discrepancy.expectedParagraphs !== discrepancy.parsedParagraphs
            ? "PARAGRAPH COUNT MISMATCH"
            : "SENTENCE COUNT MISMATCH"
        }`,
        "",
        "Normalized context containing likely abbreviation, ellipsis, dialogue-attribution, or closing-punctuation boundary cases:",
        "",
      );
      for (const context of discrepancy.context) {
        lines.push("```text", context, "```", "");
      }
    }
  }

  lines.push("## Database and FTS validation", "");
  if (!validation) {
    lines.push("Not run because source parsing or reference-count validation failed.", "");
  } else {
    lines.push(
      `- **SQLite integrity:** ${validation.integrity}`,
      `- **Foreign keys:** ${validation.foreignKeys}`,
      `- **FTS integrity:** ${validation.fts.integrity}`,
      `- **FTS synchronization:** ${validation.fts.synchronization}`,
      `- **FTS row count:** ${validation.fts.rowCount}`,
      `- **Representative FTS matches:** ${validation.fts.representativeMatches}`,
      "",
    );
  }

  const locationWarnings = rows
    .filter((row) => row.locationSourceField === "places")
    .map(
      (row) =>
        `${row.slug}: mapped legacy source field \`places\` into database locations.`,
    );
  const allWarnings = [...warnings, ...locationWarnings];
  lines.push("## Warnings", "");
  if (allWarnings.length === 0) {
    lines.push("None.", "");
  } else {
    for (const warning of allWarnings) {
      lines.push(`- ${warning}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function writeReport(reportPath, report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const temporaryPath = `${reportPath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, report, "utf8");
  fs.renameSync(temporaryPath, reportPath);
}

function removeStageFiles(stagePath) {
  for (const suffix of ["", "-journal", "-shm", "-wal"]) {
    const filename = `${stagePath}${suffix}`;
    if (fs.existsSync(filename)) {
      fs.rmSync(filename);
    }
  }
}

export function runImport({
  slugs = bookDirectories,
  metadataRoot = path.join(projectRoot, "metadata"),
  targetDatabasePath = databasePath,
  reportPath = defaultImportReportPath,
  logger = console,
} = {}) {
  const books = [];
  const discrepancies = [];
  const stagePath = `${targetDatabasePath}.staging-${process.pid}-${Date.now()}`;
  let database;

  try {
    logger.log(`Validating ${slugs.length} configured book(s)...`);
    for (const slug of slugs) {
      logger.log(`Parsing ${slug}...`);
      const book = loadCanonicalBook(metadataRoot, slug);
      books.push(book);
      discrepancies.push(...book.discrepancies);
      logger.log(
        `  chapters ${book.parsedChapterCount}, paragraphs ${book.parsedParagraphCount}, sentences ${book.parsedSentenceCount}`,
      );
    }

    if (discrepancies.length > 0) {
      throw new ImportCountMismatchError(discrepancies);
    }

    logger.log("Creating staged database...");
    initializeDatabase({
      filename: stagePath,
      schemaFilename: schemaPath,
    });
    database = openDatabase(stagePath);

    logger.log("Populating relational data and FTS...");
    populateDatabase(database, books);

    logger.log("Validating staged database...");
    const validation = validatePopulatedDatabase(database, books);
    database.close();
    database = undefined;

    fs.mkdirSync(path.dirname(targetDatabasePath), { recursive: true });
    fs.renameSync(stagePath, targetDatabasePath);

    writeReport(
      reportPath,
      buildImportReport({
        status: "SUCCESS",
        books,
        validation,
        publishedPath: targetDatabasePath,
      }),
    );

    logger.log(`Published database: ${targetDatabasePath}`);
    logger.log(`Import report: ${reportPath}`);
    return { status: "SUCCESS", books, validation, reportPath };
  } catch (error) {
    if (database?.open) {
      database.close();
    }
    removeStageFiles(stagePath);

    writeReport(
      reportPath,
      buildImportReport({
        status:
          error instanceof ImportCountMismatchError
            ? "PARSER AUDIT REQUIRED"
            : "FAILED",
        books,
        discrepancies:
          error instanceof ImportCountMismatchError
            ? error.discrepancies
            : discrepancies,
        error,
      }),
    );

    logger.error(error.message);
    logger.error(`Import report: ${reportPath}`);
    throw error;
  }
}

const isCommandLineEntry =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCommandLineEntry) {
  try {
    runImport();
  } catch {
    process.exitCode = 1;
  }
}
