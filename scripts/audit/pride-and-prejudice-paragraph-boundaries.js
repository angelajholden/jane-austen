import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { projectRoot } from "../../config/database.js";
import {
  extractBookBody,
  mapChapterSections,
} from "../lib/chapter-parser.js";
import {
  normalizeParagraphLines,
  parseParagraphBlocks,
} from "../lib/book-parser.js";

const slug = "pride-and-prejudice";
const sourcePath = path.join(projectRoot, "metadata", slug, `${slug}.txt`);
const metadataPath = path.join(
  projectRoot,
  "metadata",
  slug,
  `${slug}.metadata.json`,
);

function blankSeparatedBlocks(section) {
  const blocks = [];
  let lines = [];
  let startLine = null;

  const flush = (endLine) => {
    if (lines.length === 0) return;
    blocks.push({
      startLine,
      endLine,
      text: normalizeParagraphLines(lines),
    });
    lines = [];
    startLine = null;
  };

  for (const [index, line] of section.contentLines.entries()) {
    const lineNumber = section.lineNumber + index + 1;
    if (line.trim() === "") {
      flush(lineNumber - 1);
    } else {
      if (startLine === null) startLine = lineNumber;
      lines.push(line);
    }
  }
  flush(section.lineNumber + section.contentLines.length);
  return blocks;
}

function isCandidateMetadataParagraph(block) {
  return (
    !/^\[Illustration\b/i.test(block.text) &&
    !/^\[_Copyright\b/i.test(block.text) &&
    !/^THE END\s*\]?$/i.test(block.text)
  );
}

function candidateUnitsInsideExclusions(blocks, excludedBlocks) {
  return blocks.filter(
    (block) =>
      isCandidateMetadataParagraph(block) &&
      excludedBlocks.some(
        (excluded) =>
          block.startLine >= excluded.startLine &&
          block.endLine <= excluded.endLine,
      ),
  );
}

export function auditPrideAndPrejudiceParagraphs() {
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  const extracted = extractBookBody(fs.readFileSync(sourcePath, "utf8"), sourcePath);
  const sections = mapChapterSections(extracted, metadata.chapters, sourcePath);

  const chapters = sections.map((section) => {
    const blocks = blankSeparatedBlocks(section);
    const current = parseParagraphBlocks(section.contentLines, {
      firstLineNumber: section.lineNumber + 1,
    });
    const candidateMetadataParagraphs = blocks.filter(isCandidateMetadataParagraph);
    const candidateExcludedUnits = candidateUnitsInsideExclusions(
      blocks,
      current.excludedBlocks,
    );

    return {
      ordinal: section.ordinal,
      title: section.metadata.title,
      expected: section.metadata.paragraphCount,
      parsed: current.paragraphs.length,
      difference: section.metadata.paragraphCount - current.paragraphs.length,
      candidateCount: candidateMetadataParagraphs.length,
      candidateDifference:
        section.metadata.paragraphCount - candidateMetadataParagraphs.length,
      retainedParagraphs: current.paragraphs,
      excludedBlocks: current.excludedBlocks,
      candidateExcludedUnits,
    };
  });
  const candidateExcludedUnits = chapters.flatMap(
    (chapter) => chapter.candidateExcludedUnits,
  );

  return {
    sourcePath,
    metadataPath,
    expected: metadata.paragraphCount,
    parsed: chapters.reduce((total, chapter) => total + chapter.parsed, 0),
    candidateCount: chapters.reduce(
      (total, chapter) => total + chapter.candidateCount,
      0,
    ),
    mismatchedChapters: chapters.filter((chapter) => chapter.difference !== 0)
      .length,
    candidateMismatchedChapters: chapters.filter(
      (chapter) => chapter.candidateDifference !== 0,
    ).length,
    candidateUnitClasses: {
      captions: candidateExcludedUnits.filter(
        (block) => !/^\[Copyright\b/i.test(block.text),
      ).length,
      plainCopyright: candidateExcludedUnits.filter((block) =>
        /^\[Copyright\b/i.test(block.text),
      ).length,
    },
    chapters,
  };
}

function printAudit(audit) {
  console.log(`Expected: ${audit.expected}`);
  console.log(`Current parser: ${audit.parsed}`);
  console.log(`Difference: ${audit.expected - audit.parsed}`);
  console.log(`Mismatched chapters: ${audit.mismatchedChapters}`);
  console.log(`Candidate historical count: ${audit.candidateCount}`);
  console.log(
    `Candidate historical mismatched chapters: ${audit.candidateMismatchedChapters}`,
  );
  console.log(`Candidate caption units: ${audit.candidateUnitClasses.captions}`);
  console.log(
    `Candidate plain copyright units: ${audit.candidateUnitClasses.plainCopyright}`,
  );
  console.log("");
  console.log("Chapter | Expected | Parsed | Difference | Candidate interior units");
  for (const chapter of audit.chapters.filter(
    (item) => item.difference !== 0 || [1, 2, 3, 28, 61].includes(item.ordinal),
  )) {
    console.log(
      `${chapter.ordinal} | ${chapter.expected} | ${chapter.parsed} | ${chapter.difference} | ${chapter.candidateExcludedUnits.length}`,
    );
  }

  for (const ordinal of [1, 2, 3, 28, 61]) {
    const chapter = audit.chapters[ordinal - 1];
    console.log("");
    console.log(`Chapter ${ordinal} retained paragraphs`);
    for (const [index, paragraph] of chapter.retainedParagraphs.entries()) {
      console.log(
        `${index + 1}. lines ${paragraph.startLine}-${paragraph.endLine}: ${paragraph.text}`,
      );
    }
    console.log(`Chapter ${ordinal} excluded blocks`);
    for (const block of chapter.excludedBlocks) {
      console.log(
        `- lines ${block.startLine}-${block.endLine}: ${block.text}`,
      );
    }
    console.log(`Chapter ${ordinal} candidate metadata-only units`);
    for (const block of chapter.candidateExcludedUnits) {
      console.log(
        `- lines ${block.startLine}-${block.endLine}: ${block.text}`,
      );
    }
  }
}

const isCommandLineEntry =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCommandLineEntry) {
  printAudit(auditPrideAndPrejudiceParagraphs());
}
