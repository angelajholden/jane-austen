import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { projectRoot } from "../config/database.js";
import { auditPrideAndPrejudiceParagraphs } from "../scripts/audit/pride-and-prejudice-paragraph-boundaries.js";
import {
  EXPECTED_CHANGED_ORDINALS,
  assertExpectedAudit,
  assertOnlyParagraphCountsChanged,
  buildUpdatedMetadata,
  deriveRegeneration,
  replaceParagraphCountsInRawJson,
} from "../scripts/metadata/regenerate-pride-and-prejudice-paragraph-counts.js";

const slug = "pride-and-prejudice";
const sourcePath = path.join(projectRoot, "metadata", slug, `${slug}.txt`);
const metadataPath = path.join(
  projectRoot,
  "metadata",
  slug,
  `${slug}.metadata.json`,
);
const sourceText = fs.readFileSync(sourcePath, "utf8");
const rawMetadata = fs.readFileSync(metadataPath, "utf8");
const correctedMetadata = JSON.parse(rawMetadata);

function reconstructHistoricalMetadata() {
  const boundaryAudit = auditPrideAndPrejudiceParagraphs();
  assert.deepEqual(boundaryAudit.candidateUnitClasses, {
    captions: 60,
    plainCopyright: 1,
  });

  const historical = structuredClone(correctedMetadata);
  for (const chapter of boundaryAudit.chapters) {
    historical.chapters[chapter.ordinal - 1].paragraphCount +=
      chapter.candidateExcludedUnits.length;
  }
  historical.paragraphCount = historical.chapters.reduce(
    (total, chapter) => total + chapter.paragraphCount,
    0,
  );
  return historical;
}

test("approved production parser derives 2,060 paragraphs across 61 chapters", () => {
  const audit = deriveRegeneration(sourceText, correctedMetadata, sourcePath);

  assert.equal(audit.regeneratedTotal, 2060);
  assert.equal(audit.chapterCount, 61);
  assert.equal(audit.changedCount, 0);
  assert.equal(audit.unchangedCount, 61);
});

test("regeneration reproduces the Prompt 4C chapter diff and changes only paragraph counts", () => {
  const historical = reconstructHistoricalMetadata();
  const audit = deriveRegeneration(sourceText, historical, sourcePath);

  assertExpectedAudit(audit);
  assert.deepEqual(
    audit.changedChapters.map((chapter) => chapter.ordinal),
    EXPECTED_CHANGED_ORDINALS,
  );

  const updated = buildUpdatedMetadata(historical, audit);
  assertOnlyParagraphCountsChanged(historical, updated);
  assert.deepEqual(updated, correctedMetadata);

  const historicalRaw = replaceParagraphCountsInRawJson(rawMetadata, historical);
  const regeneratedRaw = replaceParagraphCountsInRawJson(historicalRaw, updated);
  assert.equal(regeneratedRaw, rawMetadata);
});

test("regeneration safety checks reject an unexpected parser total before writing", () => {
  const historical = reconstructHistoricalMetadata();
  const audit = deriveRegeneration(sourceText, historical, sourcePath);

  assert.throws(
    () => assertExpectedAudit({ ...audit, regeneratedTotal: 2059 }),
    /Safety check failed: regenerated paragraph total is 2059; expected 2060\. No files were written\./,
  );
});
