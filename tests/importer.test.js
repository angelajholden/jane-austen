import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

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
  parseParagraphs,
  parseValidatedBook,
  resolveCanonicalPaths,
  tokenizeParagraph,
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
  sentenceCount = 3,
  locationField = "places",
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

test("paragraph parsing joins wrapped lines and removes structural blocks", () => {
  assert.equal(
    normalizeParagraphLines(["  A wrapped ", " physical line.  "]),
    "A wrapped physical line.",
  );

  assert.deepEqual(
    parseParagraphs([
      "First wrapped",
      "line.",
      "   ",
      "[Illustration: a caption]",
      "",
      "Second paragraph.",
      "",
      "FINIS",
    ]),
    ["First wrapped line.", "Second paragraph."],
  );
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

test("sentence tokenization protects abbreviations and dialogue attribution", () => {
  assert.deepEqual(
    tokenizeParagraph("Dr. J. Smith arrived. He left."),
    ["Dr. J. Smith arrived.", "He left."],
  );
  assert.deepEqual(
    tokenizeParagraph("Mr. Bennet paused. “Are you well?” she asked. He nodded."),
    ["Mr. Bennet paused.", "“Are you well?” she asked.", "He nodded."],
  );
  assert.deepEqual(tokenizeParagraph("He waited... Then left."), [
    "He waited... Then left.",
  ]);
  assert.deepEqual(tokenizeParagraph("It ended (truly!). Then silence."), [
    "It ended (truly!).",
    "Then silence.",
  ]);
});

test("parsed ordinals and stable identifiers are one-based", () => {
  const metadata = validateMetadata(
    fixtureMetadata({ locationField: "locations" }),
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
  assert.equal(book.chapters[0].paragraphs[0].stableId, "fixture:paragraph:1");
  assert.equal(
    book.chapters[0].paragraphs[0].sentences[0].stableId,
    "fixture:sentence:1",
  );
  assert.deepEqual(
    book.chapters[0].paragraphs[0].sentences.map((sentence) => [
      sentence.ordinalInParagraph,
      sentence.ordinalInChapter,
      sentence.ordinalInBook,
    ]),
    [
      [1, 1, 1],
      [2, 2, 2],
    ],
  );
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

test("legacy places input maps to normalized database locations", (context) => {
  const root = temporaryDirectory(context);
  writeFixture(root, { locationField: "places" });
  const book = loadCanonicalBook(root, "fixture");

  assert.equal(book.metadata.locationSourceField, "places");
  assert.equal(book.metadata.locations[0].name, "Longbourn");
});

test("controlled fixture imports relational data, foreign keys, and FTS", (context) => {
  const root = temporaryDirectory(context);
  writeFixture(root);
  const target = path.join(root, "published.sqlite");
  const report = path.join(root, "import-report.md");

  const result = runImport({
    slugs: ["fixture"],
    metadataRoot: root,
    targetDatabasePath: target,
    reportPath: report,
    logger: { log() {}, error() {} },
  });

  assert.equal(result.status, "SUCCESS");
  const database = openDatabase(target, { readonly: true });
  context.after(() => database.close());
  assert.equal(database.pragma("foreign_keys", { simple: true }), 1);
  assert.deepEqual(database.pragma("foreign_key_check"), []);
  assert.equal(database.prepare("SELECT count(*) AS count FROM books").get().count, 1);
  assert.equal(database.prepare("SELECT count(*) AS count FROM sentences").get().count, 3);
  assert.equal(database.prepare("SELECT count(*) AS count FROM locations").get().count, 1);
  assert.equal(
    database
      .prepare("SELECT count(*) AS count FROM sentences_fts WHERE sentences_fts MATCH 'Bennet'")
      .get().count,
    1,
  );
});

test("count failure writes an audit report and preserves the published database", (context) => {
  const root = temporaryDirectory(context);
  writeFixture(root, { sentenceCount: 4 });
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
  assert.match(fs.readFileSync(report, "utf8"), /PARSER AUDIT REQUIRED/);
  assert.match(fs.readFileSync(report, "utf8"), /SENTENCE COUNT MISMATCH/);
  assert.equal(
    fs.readdirSync(root).some((name) => name.includes(".staging-")),
    false,
  );
});
