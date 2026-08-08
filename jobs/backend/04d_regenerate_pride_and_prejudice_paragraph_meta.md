# Prompt 4D — Regenerate Pride and Prejudice Paragraph Metadata

## Objective

Regenerate only the Pride and Prejudice paragraph counts from the approved
current paragraph parser.

Prompt 4C established that:

- the current paragraph parser is consistent with the approved paragraph
  contract;
- the existing Pride and Prejudice paragraph metadata is inconsistent with its
  documented exclusion rule;
- the 61-paragraph difference is fully explained by non-prose illustration
  caption/copyright payloads counted by the historical metadata convention;
- the approved parser produces 2,060 prose paragraphs;
- the existing metadata total is 2,121;
- 39 of 61 chapters have paragraph-count differences;
- no parser change is recommended.

This job implements only the approved metadata correction.

## Read Before Implementing

Read and treat as authoritative:

- `docs/requirements.md`
- `docs/database-design.md`
- `docs/importer.md`
- `docs/audit/pride-and-prejudice-paragraph-boundaries.md`
- `metadata/pride-and-prejudice/pride-and-prejudice.txt`
- `metadata/pride-and-prejudice/pride-and-prejudice.metadata.json`
- `metadata/pride-and-prejudice/pride-and-prejudice.metadata-report.md`
- current paragraph parser implementation
- current chapter parser implementation
- `scripts/audit/pride-and-prejudice-paragraph-boundaries.js`

Do not use the historical metadata counts as the source for the replacement
paragraph values.

Derive the new counts from the approved current parser.

## Scope

Modify only Pride and Prejudice metadata artifacts required to correct paragraph
counts.

The canonical JSON file is:

```text
metadata/pride-and-prejudice/pride-and-prejudice.metadata.json
```

Update:

- top-level `paragraphCount`;
- `paragraphCount` for each chapter whose current stored value differs from the
  approved parser result.

Do not modify chapter records whose paragraph counts already match.

## Required New Book Total

The approved parser must produce:

```text
Pride and Prejudice paragraphCount = 2060
```

Verify this programmatically before modifying metadata.

Do not hard-code chapter-level replacement values without deriving them from the
current parser.

## Chapter-Level Regeneration

For all 61 chapters:

1. detect chapters using the current shared chapter parser;
2. parse retained prose paragraphs using the current approved paragraph parser;
3. calculate the parsed paragraph count for each chapter;
4. compare that value to the stored metadata `paragraphCount`;
5. update only mismatched chapter paragraph counts.

The expected audit result from Prompt 4C is:

- 39 chapters require changes;
- 22 chapters already match.

Verify this rather than assuming it.

If the current parser produces a result inconsistent with the Prompt 4C audit,
stop and report the discrepancy instead of modifying metadata.

## Do Not Change Sentence Metadata

Do not modify:

- top-level `sentenceCount`;
- chapter-level `sentenceCount`;
- sentence-related report text unless required solely to clarify that sentence
  counts remain historical/reference metadata.

Do not rerun or reintroduce sentence tokenization.

## Do Not Change Other Metadata

Do not modify:

- `id`;
- `title`;
- `slug`;
- `author`;
- `gutenbergId`;
- `publicationYear`;
- `sourceFile`;
- `chapterCount`;
- characters;
- aliases;
- ambiguous aliases;
- locations;
- notes;
- chapter IDs;
- chapter numbers;
- chapter titles.

This job is paragraph-count correction only.

## Canonical Source

Do not modify:

```text
metadata/pride-and-prejudice/pride-and-prejudice.txt
```

Do not add chapter markers or paragraph markers to the source.

Do not modify illustration text.

## Metadata Report

Update:

```text
metadata/pride-and-prejudice/pride-and-prejudice.metadata-report.md
```

only as needed to make the report accurate after the corrected paragraph counts.

At minimum:

- change the summary paragraph total from 2,121 to 2,060;
- remove or revise any statement implying the old 2,121 count is consistent
  with the documented prose-only paragraph convention;
- preserve the documented rule that illustration/caption/decorative material is
  excluded;
- add a concise note explaining that a later audit found the prior stored
  paragraph totals had counted 60 illustration caption payload blocks and one
  copyright payload block despite the stated exclusion rule;
- state that the paragraph metadata was regenerated from the approved
  bracket-aware prose parser.

Do not rewrite unrelated character, alias, location, sentence, Gutenberg, or
edition-analysis sections.

Keep the report historical and factual.

## Audit Provenance

Preserve:

```text
docs/audit/pride-and-prejudice-paragraph-boundaries.md
```

Do not rewrite or delete it.

That audit is the evidence supporting this metadata correction.

The corrected metadata report may reference that audit by repository-relative
path.

## Diff Report

Create:

```text
docs/audit/pride-and-prejudice-paragraph-metadata-regeneration.md
```

The report must include:

### Summary

- previous book paragraph total: 2,121;
- regenerated book paragraph total: 2,060;
- difference: -61;
- total chapters: 61;
- changed chapters;
- unchanged chapters;
- parser used as authority.

### Chapter changes

Include a table containing every changed chapter:

```text
Chapter | Previous paragraphCount | Regenerated paragraphCount | Difference
```

Do not omit changed chapters.

### Unchanged chapters

List or summarize the chapters whose counts did not change.

### Validation

Report:

- sum of regenerated chapter counts;
- top-level regenerated paragraph count;
- whether those values agree;
- whether all 61 chapters were detected;
- whether the Prompt 4C expected 39/22 changed/unchanged split was reproduced;
- whether any non-paragraph metadata fields changed.

### File modifications

List the files modified by this job.

## Implementation Method

Prefer a small deterministic script rather than manually editing 39 chapter
counts.

If creating a reusable script, place it under an appropriate path such as:

```text
scripts/metadata/regenerate-pride-and-prejudice-paragraph-counts.js
```

The script should:

1. read the canonical Pride and Prejudice text;
2. read the current metadata JSON;
3. use the current production chapter/paragraph parser;
4. calculate all 61 chapter paragraph counts;
5. calculate the book total;
6. verify the Prompt 4C audit expectations;
7. update only paragraph-count fields;
8. preserve JSON structure and unrelated values;
9. write the updated metadata JSON;
10. produce or support the regeneration audit report.

Do not duplicate paragraph parsing logic in the script.

Import and call the current parser implementation.

## Safety Checks Before Writing

Before modifying metadata, verify:

- exactly 61 chapters are detected;
- regenerated total is exactly 2,060;
- exactly 39 chapter counts differ from stored metadata;
- exactly 22 chapter counts already match;
- the total difference from stored metadata is exactly -61.

If any of these checks fail:

- do not write the metadata JSON;
- do not partially update the metadata report;
- report the discrepancy and stop for review.

## Post-Write Validation

After updating the metadata JSON:

- parse it again;
- verify it is valid JSON;
- verify `chapterCount === chapters.length`;
- verify top-level `paragraphCount === sum(chapters[].paragraphCount)`;
- verify top-level paragraph total is 2,060;
- verify all chapter IDs/numbers/titles are unchanged;
- verify all sentence counts are unchanged;
- verify all character/location metadata is unchanged.

Use before/after comparison to confirm that only intended paragraph-count fields
changed.

## Tests

Add or update tests only where useful to protect the metadata-regeneration
workflow.

At minimum, verify that the regeneration logic:

- derives counts from the current parser;
- reproduces 2,060;
- detects all 61 chapters;
- identifies exactly the expected set/count of changed chapters;
- does not change sentence counts or unrelated metadata;
- fails safely if parser totals differ from the Prompt 4C audit expectations.

Do not alter production parser behavior.

## Do Not Run Full Import Yet

Do not use this job to modify importer production logic.

Do not combine metadata correction and importer publication into one change.

After the metadata update is complete and reviewed, the next step will be to run
the existing Prompt 4B importer against the corrected metadata.

You may run parser/audit/test commands required to validate this job, but do not
broaden the task into further importer implementation.

If `npm run import` would publish a new database, do not run it as part of this
job.

## Constraints

Do not:

- change parser logic;
- change chapter detection;
- change `sql/schema.sql`;
- modify the canonical Pride and Prejudice text;
- modify other books' metadata;
- modify sentence counts;
- add sentence tokenization;
- change character/location metadata;
- implement API routes;
- implement frontend behavior;
- publish a new database;
- alter the paragraph contract to preserve historical counts.

## Final Response

Report:

- old paragraph total;
- new paragraph total;
- number of changed chapters;
- number of unchanged chapters;
- whether the expected -61 difference was reproduced;
- tests run and results;
- files modified;
- confirmation that sentence counts and unrelated metadata were unchanged;
- confirmation that no database was published.

## Done When

This job is complete when:

- Pride and Prejudice paragraph metadata is regenerated from the approved
  current parser;
- top-level `paragraphCount` is 2,060;
- all 61 chapter paragraph counts reflect current parser output;
- exactly the parser-derived mismatched chapters are updated;
- sentence and unrelated metadata remain unchanged;
- the metadata report accurately reflects the corrected counting convention;
- the regeneration audit report documents the before/after diff;
- validation passes;
- no parser/schema/source/database changes have been made.
