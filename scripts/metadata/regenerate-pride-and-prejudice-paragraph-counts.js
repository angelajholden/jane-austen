import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { fileURLToPath } from "node:url";

import { projectRoot } from "../../config/database.js";
import { parseParagraphBlocks } from "../lib/book-parser.js";
import { extractBookBody, mapChapterSections } from "../lib/chapter-parser.js";

export const EXPECTED_AUDIT = Object.freeze({
  previousTotal: 2121,
  regeneratedTotal: 2060,
  difference: -61,
  chapterCount: 61,
  changedCount: 39,
  unchangedCount: 22,
});

export const EXPECTED_CHANGED_ORDINALS = Object.freeze([
  1, 2, 3, 6, 7, 8, 10, 14, 16, 18, 20, 22, 23, 25, 26, 27, 28,
  30, 34, 36, 37, 38, 40, 41, 42, 44, 46, 47, 48, 49, 50, 51, 52,
  53, 54, 56, 57, 58, 59,
]);

const slug = "pride-and-prejudice";
const sourcePath = path.join(projectRoot, "metadata", slug, `${slug}.txt`);
const metadataPath = path.join(
  projectRoot,
  "metadata",
  slug,
  `${slug}.metadata.json`,
);
const reportPath = path.join(
  projectRoot,
  "docs",
  "audit",
  "pride-and-prejudice-paragraph-metadata-regeneration.md",
);

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

export function deriveRegeneration(sourceText, metadata, sourceLabel = sourcePath) {
  const extracted = extractBookBody(sourceText, sourceLabel);
  const sections = mapChapterSections(extracted, metadata.chapters, sourceLabel);
  const chapters = sections.map((section) => {
    const regenerated = parseParagraphBlocks(section.contentLines, {
      firstLineNumber: section.lineNumber + 1,
    }).paragraphs.length;
    const previous = section.metadata.paragraphCount;

    return {
      ordinal: section.ordinal,
      id: section.metadata.id,
      number: section.metadata.number,
      title: section.metadata.title,
      previous,
      regenerated,
      difference: regenerated - previous,
    };
  });
  const changedChapters = chapters.filter((chapter) => chapter.difference !== 0);
  const unchangedChapters = chapters.filter((chapter) => chapter.difference === 0);
  const regeneratedTotal = sum(chapters.map((chapter) => chapter.regenerated));

  return {
    previousTotal: metadata.paragraphCount,
    regeneratedTotal,
    difference: regeneratedTotal - metadata.paragraphCount,
    chapterCount: chapters.length,
    changedCount: changedChapters.length,
    unchangedCount: unchangedChapters.length,
    chapters,
    changedChapters,
    unchangedChapters,
  };
}

export function assertExpectedAudit(audit, expected = EXPECTED_AUDIT) {
  const checks = [
    ["previous paragraph total", audit.previousTotal, expected.previousTotal],
    ["regenerated paragraph total", audit.regeneratedTotal, expected.regeneratedTotal],
    ["paragraph total difference", audit.difference, expected.difference],
    ["detected chapter count", audit.chapterCount, expected.chapterCount],
    ["changed chapter count", audit.changedCount, expected.changedCount],
    ["unchanged chapter count", audit.unchangedCount, expected.unchangedCount],
  ];

  for (const [label, actual, required] of checks) {
    if (actual !== required) {
      throw new Error(
        `Safety check failed: ${label} is ${actual}; expected ${required}. No files were written.`,
      );
    }
  }

  const changedOrdinals = audit.changedChapters.map((chapter) => chapter.ordinal);
  if (!isDeepStrictEqual(changedOrdinals, EXPECTED_CHANGED_ORDINALS)) {
    throw new Error(
      `Safety check failed: changed chapter set is ${changedOrdinals.join(", ")}; ` +
        `expected ${EXPECTED_CHANGED_ORDINALS.join(", ")}. No files were written.`,
    );
  }
}

export function buildUpdatedMetadata(metadata, audit) {
  const updated = structuredClone(metadata);
  updated.paragraphCount = audit.regeneratedTotal;

  for (const chapter of audit.changedChapters) {
    updated.chapters[chapter.ordinal - 1].paragraphCount = chapter.regenerated;
  }

  return updated;
}

function withoutParagraphCounts(metadata) {
  const copy = structuredClone(metadata);
  delete copy.paragraphCount;
  for (const chapter of copy.chapters) delete chapter.paragraphCount;
  return copy;
}

export function assertOnlyParagraphCountsChanged(before, after) {
  if (!isDeepStrictEqual(withoutParagraphCounts(before), withoutParagraphCounts(after))) {
    throw new Error("Validation failed: non-paragraph metadata changed.");
  }

  if (after.chapterCount !== after.chapters.length) {
    throw new Error(
      `Validation failed: chapterCount is ${after.chapterCount}, but ${after.chapters.length} chapters exist.`,
    );
  }

  const chapterTotal = sum(after.chapters.map((chapter) => chapter.paragraphCount));
  if (after.paragraphCount !== chapterTotal || chapterTotal !== EXPECTED_AUDIT.regeneratedTotal) {
    throw new Error(
      `Validation failed: top-level paragraphCount is ${after.paragraphCount}; ` +
        `chapter sum is ${chapterTotal}; expected ${EXPECTED_AUDIT.regeneratedTotal}.`,
    );
  }
}

export function replaceParagraphCountsInRawJson(rawJson, updatedMetadata) {
  const values = [
    updatedMetadata.paragraphCount,
    ...updatedMetadata.chapters.map((chapter) => chapter.paragraphCount),
  ];
  let index = 0;
  const updatedRaw = rawJson.replace(
    /^([ \t]*"paragraphCount"[ \t]*:[ \t]*)(\d+)([ \t]*,?[ \t]*)$/gm,
    (line, prefix, _oldValue, suffix) => {
      if (index >= values.length) {
        throw new Error("Metadata contains more paragraphCount fields than expected.");
      }
      const replacement = `${prefix}${values[index]}${suffix}`;
      index += 1;
      return replacement;
    },
  );

  if (index !== values.length) {
    throw new Error(
      `Metadata contains ${index} paragraphCount fields; expected ${values.length}.`,
    );
  }

  const reparsed = JSON.parse(updatedRaw);
  if (!isDeepStrictEqual(reparsed, updatedMetadata)) {
    throw new Error("Text-preserving JSON update does not match the validated metadata result.");
  }
  return updatedRaw;
}

export function buildAuditReport(audit) {
  const rows = audit.changedChapters
    .map(
      (chapter) =>
        `| ${chapter.ordinal} | ${chapter.previous} | ${chapter.regenerated} | ${signed(chapter.difference)} |`,
    )
    .join("\n");
  const unchanged = audit.unchangedChapters.map((chapter) => chapter.ordinal).join(", ");

  return `# Pride and Prejudice Paragraph Metadata Regeneration

## Summary

- Previous book paragraph total: **${audit.previousTotal.toLocaleString("en-US")}**
- Regenerated book paragraph total: **${audit.regeneratedTotal.toLocaleString("en-US")}**
- Difference: **${signed(audit.difference)}**
- Total chapters: **${audit.chapterCount}**
- Changed chapters: **${audit.changedCount}**
- Unchanged chapters: **${audit.unchangedCount}**
- Parser authority: the production chapter mapper in \`scripts/lib/chapter-parser.js\` and the approved bracket-aware paragraph parser in \`scripts/lib/book-parser.js\`.

Replacement values were derived from the canonical source with the current production parsers. Historical metadata counts were used only for the before/after comparison.

## Chapter changes

| Chapter | Previous paragraphCount | Regenerated paragraphCount | Difference |
| ---: | ---: | ---: | ---: |
${rows}

## Unchanged chapters

The following 22 chapters already matched the approved parser and were not changed: ${unchanged}.

## Validation

- Sum of regenerated chapter counts: **${audit.regeneratedTotal.toLocaleString("en-US")}**
- Top-level regenerated \`paragraphCount\`: **${audit.regeneratedTotal.toLocaleString("en-US")}**
- Chapter sum and top-level total agree: **yes**
- All 61 chapters detected: **yes**
- Prompt 4C 39 changed / 22 unchanged split reproduced: **yes**
- Changed chapter set reproduced: **yes**
- Non-paragraph metadata fields changed: **no**
- Chapter IDs, numbers, and titles changed: **no**
- Sentence counts changed: **no**
- Character or location metadata changed: **no**

## File modifications

- \`metadata/pride-and-prejudice/pride-and-prejudice.metadata.json\`
- \`metadata/pride-and-prejudice/pride-and-prejudice.metadata-report.md\`
- \`docs/audit/pride-and-prejudice-paragraph-metadata-regeneration.md\`
- \`scripts/metadata/regenerate-pride-and-prejudice-paragraph-counts.js\`
- \`tests/metadata-regeneration.test.js\`

The canonical text, production parsers, Prompt 4C audit report, schema, other books' metadata, and database were not modified.
`;
}

export function prepareRegeneration(rawSource, rawMetadata) {
  const metadata = JSON.parse(rawMetadata);
  const audit = deriveRegeneration(rawSource, metadata);
  assertExpectedAudit(audit);
  const updatedMetadata = buildUpdatedMetadata(metadata, audit);
  assertOnlyParagraphCountsChanged(metadata, updatedMetadata);
  const updatedRawMetadata = replaceParagraphCountsInRawJson(
    rawMetadata,
    updatedMetadata,
  );
  const report = buildAuditReport(audit);

  return { metadata, audit, updatedMetadata, updatedRawMetadata, report };
}

function run({ write }) {
  const rawSource = fs.readFileSync(sourcePath, "utf8");
  const rawMetadata = fs.readFileSync(metadataPath, "utf8");
  const prepared = prepareRegeneration(rawSource, rawMetadata);

  if (!write) {
    console.log(
      JSON.stringify(
        {
          ...EXPECTED_AUDIT,
          changedOrdinals: prepared.audit.changedChapters.map(
            (chapter) => chapter.ordinal,
          ),
          filesWritten: false,
        },
        null,
        2,
      ),
    );
    return;
  }

  fs.writeFileSync(metadataPath, prepared.updatedRawMetadata, "utf8");
  fs.writeFileSync(reportPath, prepared.report, "utf8");

  const writtenMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  assertOnlyParagraphCountsChanged(prepared.metadata, writtenMetadata);
  console.log(
    `Regenerated ${prepared.audit.changedCount} chapter counts and wrote ${prepared.audit.regeneratedTotal} total paragraphs.`,
  );
  console.log(`Unchanged chapters: ${prepared.audit.unchangedCount}`);
  console.log(`Difference: ${signed(prepared.audit.difference)}`);
  console.log(`Audit report: ${path.relative(projectRoot, reportPath)}`);
}

const isCommandLineEntry =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCommandLineEntry) {
  const args = process.argv.slice(2);
  const allowed = new Set(["--check", "--write"]);
  const unknown = args.filter((argument) => !allowed.has(argument));
  if (unknown.length > 0 || (args.includes("--check") && args.includes("--write"))) {
    throw new Error("Usage: node regenerate-pride-and-prejudice-paragraph-counts.js [--check|--write]");
  }
  run({ write: args.includes("--write") });
}
