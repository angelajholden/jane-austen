# Prompt 4E — Final Import Verification and Publication

This is the final verification step for the paragraph-based importer work.

Do not redesign or extend the importer in this job.

The parser, schema, and Pride and Prejudice paragraph metadata have already been
reviewed and corrected.

The purpose of this task is to rerun the existing importer against the corrected
metadata and verify that the full six-book database now validates and publishes
successfully.

## Objective

Run the existing paragraph-based import pipeline using the current approved
source, metadata, parser, schema, and importer implementation.

Verify that:

- all six v1 books import successfully;
- all expected chapters are detected;
- all paragraph counts match metadata;
- `paragraphs` and `paragraphs_fts` populate correctly;
- foreign-key and SQLite integrity checks pass;
- no sentence tables exist;
- the staging database is atomically published to `data/database.sqlite`;
- the generated import report reflects a successful import.

Do not modify parser behavior unless an actual new regression is discovered.

## Read Before Running

Read and treat as authoritative:

- `docs/requirements.md`
- `docs/database-design.md`
- `docs/importer.md`
- `docs/import-report.md`
- `docs/audit/pride-and-prejudice-paragraph-boundaries.md`
- `docs/audit/pride-and-prejudice-paragraph-metadata-regeneration.md`
- `sql/schema.sql`
- `config/books.js`
- `config/database.js`
- `scripts/import-books.js`
- `scripts/lib/book-parser.js`
- `scripts/lib/chapter-parser.js`
- `scripts/lib/database-import.js`
- current importer and metadata-regeneration tests
- all six configured canonical metadata JSON files
- all six configured canonical `.txt` files

The corrected Pride and Prejudice metadata now uses:

```text
paragraphCount = 2060
```

with 39 corrected chapter paragraph counts.

Do not regenerate metadata again in this job.

## Scope

This job is primarily execution and verification.

Do not:

- redesign the schema;
- change paragraph semantics;
- change illustration handling;
- modify canonical source text;
- modify metadata counts;
- reintroduce sentence tokenization;
- implement API routes;
- implement frontend behavior;
- implement eReader behavior;
- add deployment configuration;
- add production hardening;
- add unrelated features.

If the current importer succeeds as expected, no production code changes should
be necessary except generated report/database artifacts produced by the existing
workflow.

## Pre-Import Verification

Before running the full import, verify:

- `config/books.js` contains exactly the six approved v1 books;
- `sql/schema.sql` contains `paragraphs.text`;
- `sql/schema.sql` contains `paragraphs_fts`;
- `sql/schema.sql` does not define `sentences`;
- `sql/schema.sql` does not define `sentences_fts`;
- Pride and Prejudice top-level `paragraphCount` is 2,060;
- Pride and Prejudice chapter paragraph counts sum to 2,060;
- all six metadata files have internally consistent chapter and paragraph totals.

If any of these checks fail, stop and report the problem instead of running a
potentially invalid import.

## Tests

Run the complete automated test suite first.

Expected result should include all currently implemented importer,
metadata-regeneration, schema, FTS, and atomic-publication tests.

If any test fails:

- do not publish a new database;
- report the failure;
- do not broaden into unrelated fixes without clear cause.

## Chapter Audit

Run the existing chapter-heading audit.

Verify:

- 6/6 books pass;
- 269/269 chapters are detected;
- chapter ordering remains correct.

If chapter detection regresses, stop before publication.

## Full Import

Run:

```text
npm run import
```

Use the existing importer implementation.

Do not bypass any validation gate.

The importer should perform its existing staging/atomic-publication workflow.

## Required Paragraph Totals

Verify the final imported paragraph totals match metadata for all six books.

Expected book-level paragraph totals are:

```text
Emma: 2319
Mansfield Park: 1792
Northanger Abbey: 1021
Persuasion: 1010
Pride and Prejudice: 2060
Sense and Sensibility: 1809
```

Expected total paragraph rows:

```text
10011
```

Verify this from the actual import rather than assuming it.

## Required Chapter Total

Verify:

```text
269 chapters
```

across the six books.

## Database Validation

After import and before considering the job complete, verify:

- exactly six books exist;
- exactly 269 chapters exist;
- exactly 10,011 paragraphs exist;
- every chapter paragraph count matches metadata;
- every book paragraph count matches metadata;
- paragraph ordinals are contiguous and one-based within chapters;
- paragraph ordinals are contiguous and one-based within books;
- stable paragraph IDs are unique;
- no paragraph text is empty;
- no orphan paragraphs exist;
- all book/chapter/paragraph relationships are valid;
- characters imported successfully;
- character aliases imported successfully;
- locations imported successfully;
- location aliases imported successfully;
- foreign-key check passes;
- SQLite integrity check passes;
- `paragraphs_fts` is consistent with `paragraphs`;
- every FTS row maps to a paragraph;
- no orphan FTS rows exist;
- representative paragraph searches return expected rows;
- excluded illustration/copyright/decorative content is not searchable.

## Schema Verification

Inspect the published database schema and explicitly confirm:

- `books` exists;
- `chapters` exists;
- `paragraphs` exists;
- `characters` exists;
- `character_aliases` exists;
- `locations` exists;
- `location_aliases` exists;
- `paragraphs_fts` exists;
- paragraph FTS triggers exist;
- `sentences` does not exist;
- `sentences_fts` does not exist.

## Publication Verification

Verify that the importer successfully atomically replaced:

```text
data/database.sqlite
```

only after all validation passed.

Confirm:

- no staging database files remain;
- the final database can be opened;
- the final database passes integrity checks after publication.

If the import fails:

- verify the previously published database remains untouched;
- verify staging files are cleaned up;
- report the exact validation failure;
- do not modify metadata or parser rules automatically.

## Import Report

Update/regenerate:

```text
docs/import-report.md
```

using the existing importer reporting workflow.

The successful report should include at minimum:

- status: success;
- configured books: 6;
- books processed: 6;
- published database: yes;
- chapter expected/parsed totals;
- paragraph expected/parsed totals;
- character counts;
- character alias counts;
- location counts;
- location alias counts;
- paragraph FTS row count;
- foreign-key result;
- SQLite integrity result;
- warnings, if any;
- publication status.

There should be no paragraph discrepancy section if all metadata now matches.

Historical sentence counts may remain visible only as metadata/reference if the
existing report includes them, but they must not appear as import failures.

## No New Architecture Work

Do not create a new parser or importer architecture.

Do not change:

- paragraph rules;
- chapter rules;
- metadata rules;
- stable ID strategy;
- FTS design;
- schema relationships;
- alias behavior.

If the import succeeds, leave the implementation alone.

## Final Response

Report:

- test results;
- chapter-audit result;
- books imported;
- chapters imported;
- total paragraphs imported;
- paragraph totals by book;
- character count;
- character alias count;
- location count;
- location alias count;
- paragraph FTS row count;
- foreign-key result;
- SQLite integrity result;
- schema verification;
- database publication status;
- staging cleanup status;
- whether any source, metadata, parser, schema, or production importer files
  were modified.

If any warning remains, identify it clearly.

## Done When

This job is complete when:

- all automated tests pass;
- all 269 chapters are detected;
- all six books reproduce their approved paragraph metadata;
- exactly 10,011 paragraph rows are imported;
- `paragraphs_fts` is valid and synchronized;
- foreign-key and SQLite integrity checks pass;
- the final paragraph-based database is atomically published;
- `docs/import-report.md` records a successful import;
- no parser or metadata correction is required.
