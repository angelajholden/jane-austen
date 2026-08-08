import fs from "node:fs";
import path from "node:path";

import { mapChapterSections, extractBookBody } from "./chapter-parser.js";

const REQUIRED_METADATA_STRINGS = ["id", "title", "slug", "author", "sourceFile"];
const REQUIRED_METADATA_INTEGERS = [
  "publicationYear",
  "gutenbergId",
  "chapterCount",
  "sentenceCount",
  "paragraphCount",
];

function fail(slug, field, message) {
  throw new Error(`${slug}: ${field}: ${message}`);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireNonEmptyString(value, slug, field) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(slug, field, "must be a non-empty string");
  }
}

function requireNonNegativeInteger(value, slug, field) {
  if (!Number.isInteger(value) || value < 0) {
    fail(slug, field, "must be a non-negative integer");
  }
}

function validateUniqueIds(records, slug, field) {
  const seen = new Set();

  for (const [index, record] of records.entries()) {
    if (!isPlainObject(record)) {
      fail(slug, `${field}[${index}]`, "must be an object");
    }

    requireNonEmptyString(record.id, slug, `${field}[${index}].id`);

    if (seen.has(record.id)) {
      fail(slug, `${field}[${index}].id`, `duplicate ID ${JSON.stringify(record.id)}`);
    }
    seen.add(record.id);
  }
}

function validateAliasArray(aliases, slug, field) {
  if (!Array.isArray(aliases)) {
    fail(slug, field, "must be an array");
  }

  const seen = new Set();

  for (const [index, alias] of aliases.entries()) {
    requireNonEmptyString(alias, slug, `${field}[${index}]`);
    if (seen.has(alias)) {
      fail(slug, `${field}[${index}]`, `duplicate alias ${JSON.stringify(alias)}`);
    }
    seen.add(alias);
  }

  return seen;
}

function validateAmbiguousAliases(record, slug, field, approvedAliases) {
  if (record.ambiguousAliases === undefined) {
    return;
  }

  if (!Array.isArray(record.ambiguousAliases)) {
    fail(slug, `${field}.ambiguousAliases`, "must be an array");
  }

  const seen = new Set(approvedAliases);

  for (const [index, item] of record.ambiguousAliases.entries()) {
    const itemField = `${field}.ambiguousAliases[${index}]`;
    if (!isPlainObject(item)) {
      fail(slug, itemField, "must be an object");
    }
    requireNonEmptyString(item.alias, slug, `${itemField}.alias`);
    if (item.ambiguous !== true) {
      fail(slug, `${itemField}.ambiguous`, "must be true");
    }
    if (item.notes !== undefined && typeof item.notes !== "string") {
      fail(slug, `${itemField}.notes`, "must be a string when present");
    }
    if (seen.has(item.alias)) {
      fail(slug, `${itemField}.alias`, `duplicate alias ${JSON.stringify(item.alias)}`);
    }
    seen.add(item.alias);
  }
}

function validateEntityRecords(records, slug, field, { location = false } = {}) {
  if (!Array.isArray(records)) {
    fail(slug, field, "must be an array");
  }

  validateUniqueIds(records, slug, field);

  for (const [index, record] of records.entries()) {
    const recordField = `${field}[${index}]`;
    requireNonEmptyString(record.name, slug, `${recordField}.name`);
    const aliases = validateAliasArray(record.aliases, slug, `${recordField}.aliases`);
    validateAmbiguousAliases(record, slug, recordField, aliases);

    if (record.notes !== undefined && typeof record.notes !== "string") {
      fail(slug, `${recordField}.notes`, "must be a string when present");
    }

    if (location) {
      requireNonEmptyString(record.type, slug, `${recordField}.type`);
    }
  }
}

function resolveLocations(metadata, slug) {
  const hasLocations = metadata.locations !== undefined;
  const hasPlaces = metadata.places !== undefined;

  if (hasLocations && hasPlaces) {
    fail(slug, "locations", "metadata may define locations or places, but not both");
  }

  if (!hasLocations && !hasPlaces) {
    fail(slug, "locations", "metadata must define locations or the legacy input field places");
  }

  return {
    field: hasLocations ? "locations" : "places",
    records: hasLocations ? metadata.locations : metadata.places,
  };
}

export function validateMetadata(metadata, slug, derivedSourcePath) {
  if (!isPlainObject(metadata)) {
    fail(slug, "metadata", "top-level JSON value must be an object");
  }

  for (const field of REQUIRED_METADATA_STRINGS) {
    requireNonEmptyString(metadata[field], slug, field);
  }

  for (const field of REQUIRED_METADATA_INTEGERS) {
    requireNonNegativeInteger(metadata[field], slug, field);
  }

  if (metadata.publicationYear < 1000 || metadata.publicationYear > 9999) {
    fail(slug, "publicationYear", "must contain a four-digit year");
  }
  if (metadata.gutenbergId <= 0) {
    fail(slug, "gutenbergId", "must be positive");
  }
  if (metadata.id !== slug) {
    fail(slug, "id", `must equal configured slug ${JSON.stringify(slug)}`);
  }
  if (metadata.slug !== slug) {
    fail(slug, "slug", `must equal configured slug ${JSON.stringify(slug)}`);
  }
  if (metadata.sourceFile !== derivedSourcePath) {
    fail(
      slug,
      "sourceFile",
      `must equal derived canonical path ${JSON.stringify(derivedSourcePath)}`,
    );
  }

  if (!Array.isArray(metadata.chapters)) {
    fail(slug, "chapters", "must be an array");
  }
  validateUniqueIds(metadata.chapters, slug, "chapters");

  let paragraphTotal = 0;
  let sentenceTotal = 0;
  for (const [index, chapter] of metadata.chapters.entries()) {
    const field = `chapters[${index}]`;
    if (chapter.number !== index + 1) {
      fail(slug, `${field}.number`, `must equal sequential ordinal ${index + 1}`);
    }
    requireNonEmptyString(chapter.title, slug, `${field}.title`);
    requireNonNegativeInteger(chapter.paragraphCount, slug, `${field}.paragraphCount`);
    requireNonNegativeInteger(chapter.sentenceCount, slug, `${field}.sentenceCount`);
    paragraphTotal += chapter.paragraphCount;
    sentenceTotal += chapter.sentenceCount;
  }

  if (metadata.chapterCount !== metadata.chapters.length) {
    fail(
      slug,
      "chapterCount",
      `is ${metadata.chapterCount}; chapters contains ${metadata.chapters.length} records`,
    );
  }
  if (metadata.paragraphCount !== paragraphTotal) {
    fail(
      slug,
      "paragraphCount",
      `is ${metadata.paragraphCount}; chapter total is ${paragraphTotal}`,
    );
  }
  if (metadata.sentenceCount !== sentenceTotal) {
    fail(
      slug,
      "sentenceCount",
      `is ${metadata.sentenceCount}; chapter total is ${sentenceTotal}`,
    );
  }

  validateEntityRecords(metadata.characters, slug, "characters");
  const locations = resolveLocations(metadata, slug);
  validateEntityRecords(locations.records, slug, locations.field, { location: true });

  return {
    ...metadata,
    locations: locations.records,
    locationSourceField: locations.field,
  };
}

function isPathInside(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

export function resolveCanonicalPaths(metadataRoot, slug) {
  requireNonEmptyString(slug, slug || "configuration", "configured slug");
  const root = fs.realpathSync(metadataRoot);
  const directory = path.resolve(root, slug);

  if (!isPathInside(root, directory)) {
    fail(slug, "directory", "configured path escapes the approved metadata root");
  }
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    fail(slug, "directory", `does not exist: ${directory}`);
  }

  const realDirectory = fs.realpathSync(directory);
  if (!isPathInside(root, realDirectory)) {
    fail(slug, "directory", "resolved directory escapes the approved metadata root");
  }

  const textPath = path.join(realDirectory, `${slug}.txt`);
  const metadataPath = path.join(realDirectory, `${slug}.metadata.json`);

  for (const [field, filename] of [
    ["text file", textPath],
    ["metadata file", metadataPath],
  ]) {
    if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
      fail(slug, field, `does not exist: ${filename}`);
    }
    if (!isPathInside(root, fs.realpathSync(filename))) {
      fail(slug, field, "resolved path escapes the approved metadata root");
    }
  }

  return {
    metadataRoot: root,
    directory: realDirectory,
    textPath,
    metadataPath,
    relativeTextPath: `metadata/${slug}/${slug}.txt`,
  };
}

export function normalizeParagraphLines(lines) {
  let paragraph = lines
    .map((line) => line.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  paragraph = paragraph
    .replace(/^\/\*\s*(?:(?:NIND|RIGHT)\s*)?/i, "")
    .replace(/\s*\*\/$/, "")
    .trim();

  return paragraph;
}

function bracketDelta(line) {
  return [...line].reduce((total, character) => {
    if (character === "[") return total + 1;
    if (character === "]") return total - 1;
    return total;
  }, 0);
}

function isIllustrationStart(line) {
  return /^\s*\[Illustration\b/i.test(line);
}

function isCopyrightStart(line) {
  return /^\s*\[\s*_?Copyright\b/i.test(line);
}

function isTerminalDecoration(text) {
  return /^(?:FINIS\.?|THE END)$/i.test(text);
}

export function parseParagraphBlocks(lines, { firstLineNumber = 1 } = {}) {
  const paragraphs = [];
  const excludedBlocks = [];
  let paragraphLines = [];
  let paragraphStartLine = null;
  let exclusion = null;

  const lineNumberFor = (index) => firstLineNumber + index;

  const finishExclusion = (endLine) => {
    excludedBlocks.push({
      type: exclusion.type,
      startLine: exclusion.startLine,
      endLine,
      text: normalizeParagraphLines(exclusion.lines),
    });
    exclusion = null;
  };

  const flushParagraph = (endLine) => {
    if (paragraphLines.length === 0) return;

    const text = normalizeParagraphLines(paragraphLines);
    const startLine = paragraphStartLine;
    paragraphLines = [];
    paragraphStartLine = null;

    if (!text) return;
    if (isTerminalDecoration(text)) {
      excludedBlocks.push({
        type: "terminal-decoration",
        startLine,
        endLine,
        text,
      });
      return;
    }

    paragraphs.push({ text, startLine, endLine });
  };

  for (const [index, line] of lines.entries()) {
    const lineNumber = lineNumberFor(index);

    if (exclusion) {
      exclusion.lines.push(line);
      exclusion.bracketDepth += bracketDelta(line);
      if (exclusion.bracketDepth <= 0) finishExclusion(lineNumber);
      continue;
    }

    if (isIllustrationStart(line) || isCopyrightStart(line)) {
      flushParagraph(lineNumber - 1);
      exclusion = {
        type: isIllustrationStart(line) ? "illustration" : "copyright",
        startLine: lineNumber,
        lines: [line],
        bracketDepth: bracketDelta(line),
      };
      if (exclusion.bracketDepth <= 0) finishExclusion(lineNumber);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph(lineNumber - 1);
      continue;
    }

    if (paragraphLines.length === 0) paragraphStartLine = lineNumber;
    paragraphLines.push(line);
  }

  const finalLineNumber = lineNumberFor(Math.max(lines.length - 1, 0));
  if (exclusion) finishExclusion(finalLineNumber);
  flushParagraph(finalLineNumber);

  return { paragraphs, excludedBlocks };
}

export function parseParagraphs(lines) {
  return parseParagraphBlocks(lines).paragraphs.map(({ text }) => text);
}

function diagnosticRetainedContext(paragraphs) {
  const indexes = [0, Math.floor(paragraphs.length / 2), paragraphs.length - 1];
  return [...new Set(indexes)]
    .map((index) => paragraphs[index])
    .filter(Boolean)
    .map(({ text, startLine, endLine }) => ({ text, startLine, endLine }));
}

export function parseValidatedBook({ slug, rawText, metadata, relativeTextPath }) {
  const extractedBody = extractBookBody(rawText, relativeTextPath);
  const chapterSections = mapChapterSections(
    extractedBody,
    metadata.chapters,
    relativeTextPath,
  );

  let paragraphOrdinalInBook = 0;
  const chapters = [];
  const discrepancies = [];
  const excludedBlocks = [];

  for (const section of chapterSections) {
    const parsedBlocks = parseParagraphBlocks(section.contentLines, {
      firstLineNumber: section.lineNumber + 1,
    });
    excludedBlocks.push(...parsedBlocks.excludedBlocks);

    const paragraphs = parsedBlocks.paragraphs.map((paragraph, paragraphIndex) => {
      paragraphOrdinalInBook += 1;

      return {
        stableId: `${slug}:paragraph:${paragraphOrdinalInBook}`,
        ordinalInChapter: paragraphIndex + 1,
        ordinalInBook: paragraphOrdinalInBook,
        text: paragraph.text,
        sourceStartLine: paragraph.startLine,
        sourceEndLine: paragraph.endLine,
      };
    });

    const expectedParagraphs = section.metadata.paragraphCount;
    const parsedParagraphs = paragraphs.length;

    if (expectedParagraphs !== parsedParagraphs) {
      discrepancies.push({
        bookId: slug,
        bookTitle: metadata.title,
        chapterId: section.metadata.id,
        chapterOrdinal: section.ordinal,
        chapterTitle: section.metadata.title,
        expectedParagraphs,
        parsedParagraphs,
        retainedContext: diagnosticRetainedContext(parsedBlocks.paragraphs),
        excludedBlocks: parsedBlocks.excludedBlocks,
      });
    }

    chapters.push({
      sourceId: section.metadata.id,
      stableId: `${slug}:chapter:${section.metadata.id}`,
      ordinal: section.ordinal,
      title: section.metadata.title,
      sourceHeading: section.text,
      expectedParagraphCount: expectedParagraphs,
      expectedSentenceCount: section.metadata.sentenceCount,
      paragraphs,
      excludedBlocks: parsedBlocks.excludedBlocks,
    });
  }

  return {
    slug,
    metadata,
    rawText,
    normalizedBodyText: extractedBody.bodyLines.join("\n"),
    relativeTextPath,
    chapters,
    parsedChapterCount: chapters.length,
    parsedParagraphCount: paragraphOrdinalInBook,
    excludedBlocks,
    discrepancies,
  };
}

export function loadCanonicalBook(metadataRoot, slug) {
  const paths = resolveCanonicalPaths(metadataRoot, slug);
  let metadata;

  try {
    metadata = JSON.parse(fs.readFileSync(paths.metadataPath, "utf8"));
  } catch (error) {
    fail(slug, "metadata file", `invalid JSON in ${paths.metadataPath}: ${error.message}`);
  }

  const bytes = fs.readFileSync(paths.textPath);
  let rawText;
  try {
    rawText = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (error) {
    fail(slug, "text file", `is not valid UTF-8: ${paths.textPath}`);
  }

  if (rawText.includes("\u0000")) {
    fail(slug, "text file", "contains a NUL character");
  }

  const validatedMetadata = validateMetadata(
    metadata,
    slug,
    paths.relativeTextPath,
  );

  return parseValidatedBook({
    slug,
    rawText,
    metadata: validatedMetadata,
    relativeTextPath: paths.relativeTextPath,
  });
}
