import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { projectRoot } from "../config/database.js";
import { initializeDatabase } from "../scripts/init-db.js";
import {
  ImportCountMismatchError,
  runImport,
} from "../scripts/import-books.js";
import {
  extractBookBody,
  mapChapterSections,
  normalizeLineEndings,
} from "../scripts/lib/chapter-parser.js";
import {
  loadCanonicalBook,
  normalizeParagraphLines,
  parseParagraphBlocks,
  parseParagraphs,
  parseValidatedBook,
  resolveCanonicalPaths,
  validateMetadata,
} from "../scripts/lib/book-parser.js";
import { openDatabase } from "../server/db.js";

function temporaryDirectory(context, prefix = "jane-austen-importer-") {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function fixtureMetadata({
  slug = "fixture",
  sourceFile = `metadata/${slug}/${slug}.txt`,
  paragraphCount = 2,
  sentenceCount = 99,
  locationField = "locations",
} = {}) {
  return {
    id: slug,
    title: "Fixture Book",
    slug,
    author: "Jane Austen",
    publicationYear: 1813,
    gutenbergId: 999001,
    sourceFile,
    chapterCount: 1,
    sentenceCount,
    paragraphCount,
    characters: [
      {
        id: "mr-bennet",
        name: "Mr. Bennet",
        aliases: ["Bennet"],
        ambiguousAliases: [
          { alias: "Mr. B.", ambiguous: true, notes: "Fixture ambiguity." },
        ],
      },
    ],
    [locationField]: [
      {
        id: "longbourn",
        name: "Longbourn",
        type: "estate",
        aliases: ["the estate"],
        notes: "Fixture location.",
      },
    ],
    chapters: [
      {
        id: "chapter-1",
        number: 1,
        title: "Chapter I",
        sentenceCount,
        paragraphCount,
      },
    ],
  };
}

function fixtureText(lineEnding = "\n") {
  return [
    "Gutenberg header",
    "[[BOOK_START]]",
    "CHAPTER I",
    "",
    "Mr. Bennet spoke. “Indeed?” she asked.",
    "",
    "[Illustration:",
    "unfindablecaptiontoken",
    "",
    "[Copyright Fixture Press.]]",
    "",
    "A wrapped physical",
    "line ends!",
    "[[BOOK_END]]",
    "Gutenberg footer",
    "",
  ].join(lineEnding);
}

function writeFixture(root, options = {}) {
  const slug = options.slug ?? "fixture";
  const directory = path.join(root, slug);
  fs.mkdirSync(directory, { recursive: true });
  const metadata = fixtureMetadata({ ...options, slug });
  fs.writeFileSync(path.join(directory, `${slug}.txt`), fixtureText(), "utf8");
  fs.writeFileSync(
    path.join(directory, `${slug}.metadata.json`),
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8",
  );
  return { slug, directory, metadata };
}

function prideAndPrejudiceSection(ordinal) {
  const sourcePath = path.join(
    projectRoot,
    "metadata",
    "pride-and-prejudice",
    "pride-and-prejudice.txt",
  );
  const metadataPath = path.join(
    projectRoot,
    "metadata",
    "pride-and-prejudice",
    "pride-and-prejudice.metadata.json",
  );
  const extracted = extractBookBody(fs.readFileSync(sourcePath, "utf8"), sourcePath);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  return {
    metadata: metadata.chapters[ordinal - 1],
    section: mapChapterSections(extracted, metadata.chapters, sourcePath)[ordinal - 1],
  };
}

test("body extraction validates markers and normalizes line endings", () => {
  const crlf = fixtureText("\r\n");
  assert.equal(normalizeLineEndings(crlf).includes("\r"), false);

  const extracted = extractBookBody(crlf, "fixture.txt");
  assert.equal(extracted.bodyLines[0], "CHAPTER I");
  assert.equal(extracted.bodyLines.at(-1), "line ends!");
  assert.throws(
    () => extractBookBody("[[BOOK_START]]\nNo end", "broken.txt"),
    /expected exactly one \[\[BOOK_END\]\]/,
  );
});

test("paragraph parsing uses blank lines and joins hard-wrapped lines", () => {
  assert.equal(
    normalizeParagraphLines(["  A wrapped ", " physical line.  "]),
    "A wrapped physical line.",
  );
  assert.deepEqual(
    parseParagraphs(["First wrapped", "line.", "   ", "Second paragraph."]),
    ["First wrapped line.", "Second paragraph."],
  );
});

test("standalone and multiline illustrations are excluded structural separators", () => {
  const parsed = parseParagraphBlocks([
    "Before prose.",
    "[Illustration:",
    "unfindablecaptiontoken",
    "",
    "[Copyright Fixture Press.]]",
    "After prose.",
    "",
    "[Illustration]",
    "",
    "THE END",
  ]);

  assert.deepEqual(parsed.paragraphs.map(({ text }) => text), [
    "Before prose.",
    "After prose.",
  ]);
  assert.equal(parsed.excludedBlocks.length, 3);
  assert.equal(parsed.excludedBlocks[0].text.includes("unfindablecaptiontoken"), true);
});

test("Pride and Prejudice Chapter XXVIII excludes its illustration without merging prose", () => {
  const { section } = prideAndPrejudiceSection(28);
  const parsed = parseParagraphBlocks(section.contentLines, {
    firstLineNumber: section.lineNumber + 1,
  });
  const texts = parsed.paragraphs.map(({ text }) => text);
  const before = texts.findIndex((text) => text.endsWith("cried out,--"));
  const after = texts.findIndex((text) => text.startsWith("“Oh, my dear Eliza!"));

  assert.ok(before >= 0);
  assert.equal(after, before + 1);
  assert.equal(texts.some((text) => /Illustration|Copyright|In Conversation/.test(text)), false);
});

test("Pride and Prejudice Chapter LXI excludes the terminal THE END illustration", () => {
  const { metadata, section } = prideAndPrejudiceSection(61);
  const parsed = parseParagraphBlocks(section.contentLines, {
    firstLineNumber: section.lineNumber + 1,
  });

  assert.equal(parsed.paragraphs.length, metadata.paragraphCount);
  assert.equal(parsed.paragraphs.some(({ text }) => /THE END|Illustration/.test(text)), false);
});

test("shared chapter detection maps headings sequentially", () => {
  const text = [
    "[[BOOK_START]]",
    "CHAPTER I",
    "",
    "First.",
    "",
    "Chapter 2.",
    "",
    "Second.",
    "[[BOOK_END]]",
  ].join("\n");
  const extracted = extractBookBody(text);
  const sections = mapChapterSections(
    extracted,
    [
      { id: "chapter-1", number: 1 },
      { id: "chapter-2", number: 2 },
    ],
    "fixture",
  );

  assert.deepEqual(
    sections.map((section) => [section.ordinal, section.metadata.id, section.text]),
    [
      [1, "chapter-1", "CHAPTER I"],
      [2, "chapter-2", "Chapter 2."],
    ],
  );
});

test("paragraph ordinals and stable identifiers are deterministic and one-based", () => {
  const metadata = validateMetadata(
    fixtureMetadata(),
    "fixture",
    "metadata/fixture/fixture.txt",
  );
  const book = parseValidatedBook({
    slug: "fixture",
    rawText: fixtureText(),
    metadata,
    relativeTextPath: "metadata/fixture/fixture.txt",
  });

  assert.equal(book.discrepancies.length, 0);
  assert.equal(book.chapters[0].stableId, "fixture:chapter:chapter-1");
  assert.deepEqual(
    book.chapters[0].paragraphs.map((paragraph) => [
      paragraph.stableId,
      paragraph.ordinalInChapter,
      paragraph.ordinalInBook,
    ]),
    [
      ["fixture:paragraph:1", 1, 1],
      ["fixture:paragraph:2", 2, 2],
    ],
  );
  assert.equal("sentences" in book.chapters[0].paragraphs[0], false);
});

test("metadata and canonical source paths are validated", (context) => {
  assert.throws(
    () =>
      validateMetadata(
        fixtureMetadata({ sourceFile: "elsewhere/fixture.txt" }),
        "fixture",
        "metadata/fixture/fixture.txt",
      ),
    /sourceFile.*derived canonical path/,
  );

  const root = temporaryDirectory(context);
  writeFixture(root);
  assert.equal(
    resolveCanonicalPaths(root, "fixture").relativeTextPath,
    "metadata/fixture/fixture.txt",
  );
  assert.throws(() => resolveCanonicalPaths(root, "../escape"), /escapes/);
});

test("source locations and legacy places map to normalized locations", (context) => {
  const root = temporaryDirectory(context);
  writeFixture(root, { slug: "locations-fixture", locationField: "locations" });
  writeFixture(root, { slug: "places-fixture", locationField: "places" });

  assert.equal(loadCanonicalBook(root, "locations-fixture").metadata.locationSourceField, "locations");
  const legacy = loadCanonicalBook(root, "places-fixture");
  assert.equal(legacy.metadata.locationSourceField, "places");
  assert.equal(legacy.metadata.locations[0].name, "Longbourn");
});

test("controlled fixture imports paragraph data, aliases, foreign keys, and FTS", (context) => {
  const root = temporaryDirectory(context);
  writeFixture(root);
  const target = path.join(root, "published.sqlite");
  const report = path.join(root, "import-report.md");
  fs.writeFileSync(target, "previous generated artifact", "utf8");

  const result = runImport({
    slugs: ["fixture"],
    metadataRoot: root,
    targetDatabasePath: target,
    reportPath: report,
    logger: { log() {}, error() {} },
  });

  assert.equal(result.status, "SUCCESS");
  const database = openDatabase(target);
  context.after(() => database.close());
  assert.equal(database.pragma("foreign_keys", { simple: true }), 1);
  assert.deepEqual(database.pragma("foreign_key_check"), []);
  assert.equal(database.prepare("SELECT count(*) AS count FROM paragraphs").get().count, 2);
  assert.equal(
    database.prepare("SELECT text FROM paragraphs ORDER BY ordinal_in_book LIMIT 1").get().text,
    "Mr. Bennet spoke. “Indeed?” she asked.",
  );
  assert.equal(database.prepare("SELECT count(*) AS count FROM character_aliases").get().count, 2);
  assert.equal(database.prepare("SELECT count(*) AS count FROM location_aliases").get().count, 1);
  assert.equal(
    database
      .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'Bennet'")
      .get().count,
    1,
  );
  assert.equal(
    database
      .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'unfindablecaptiontoken'")
      .get().count,
    0,
  );

  database.prepare("UPDATE paragraphs SET text = text || ' testsyncprobe' WHERE id = 1").run();
  assert.equal(
    database
      .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'testsyncprobe'")
      .get().count,
    1,
  );
  database.prepare("DELETE FROM paragraphs WHERE id = 1").run();
  assert.equal(
    database
      .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'testsyncprobe'")
      .get().count,
    0,
  );

  const schemaNames = database
    .prepare("SELECT name FROM sqlite_schema WHERE name IN ('sentences', 'sentences_fts')")
    .all();
  assert.deepEqual(schemaNames, []);
  assert.match(fs.readFileSync(report, "utf8"), /Paragraphs E\/P/);
  assert.doesNotMatch(fs.readFileSync(report, "utf8"), /Sentences E\/P/);
});

test("FTS validation accounts for retained paragraphs that tokenize to zero terms", (context) => {
  const root = temporaryDirectory(context);
  const { directory, slug } = writeFixture(root, { paragraphCount: 3 });
  const sourcePath = path.join(directory, `${slug}.txt`);
  const sourceText = fs
    .readFileSync(sourcePath, "utf8")
    .replace("\n\nA wrapped physical\nline ends!", "\n\n“—”\n\nA wrapped physical\nline ends!");
  fs.writeFileSync(sourcePath, sourceText, "utf8");

  const target = path.join(root, "published.sqlite");
  const report = path.join(root, "import-report.md");
  const result = runImport({
    slugs: [slug],
    metadataRoot: root,
    targetDatabasePath: target,
    reportPath: report,
    logger: { log() {}, error() {} },
  });

  assert.equal(result.validation.fts.rowCount, 3);
  assert.equal(result.validation.fts.indexedDocuments, 2);
  assert.equal(result.validation.fts.zeroTokenDocuments, 1);

  const database = openDatabase(target, { readonly: true });
  context.after(() => database.close());
  assert.equal(database.prepare("SELECT count(*) AS count FROM paragraphs").get().count, 3);
  assert.equal(database.prepare("SELECT count(*) AS count FROM paragraphs_fts").get().count, 3);
  assert.match(fs.readFileSync(report, "utf8"), /Paragraphs with no searchable terms:\*\* 1/);
});

test("paragraph mismatch writes diagnostics and preserves the published database", (context) => {
  const root = temporaryDirectory(context);
  writeFixture(root, { paragraphCount: 3 });
  const target = path.join(root, "published.sqlite");
  const report = path.join(root, "import-report.md");
  initializeDatabase({ filename: target });
  const before = crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex");

  assert.throws(
    () =>
      runImport({
        slugs: ["fixture"],
        metadataRoot: root,
        targetDatabasePath: target,
        reportPath: report,
        logger: { log() {}, error() {} },
      }),
    ImportCountMismatchError,
  );

  const after = crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex");
  assert.equal(after, before);
  const reportText = fs.readFileSync(report, "utf8");
  assert.match(reportText, /PARSER AUDIT REQUIRED/);
  assert.match(reportText, /PARAGRAPH COUNT MISMATCH/);
  assert.match(reportText, /Excluded source blocks/);
  assert.doesNotMatch(reportText, /SENTENCE COUNT MISMATCH/);
  assert.equal(
    fs.readdirSync(root).some((name) => name.includes(".staging-")),
    false,
  );
});
