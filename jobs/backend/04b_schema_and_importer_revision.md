This is a revision of the existing Prompt 4 implementation.

Do not restart the project from scratch.

The requirements and database design have changed after review of the first
importer audit. The v1 database no longer uses sentences as searchable chunks.

Paragraphs are now the canonical searchable and reader content unit.

Complete only the work described below.

Do not implement API routes, frontend behavior, eReader behavior, deployment,
or production hardening.

# Prompt 4B — Revise Schema and Importer for Paragraph Chunks

## Objective

Revise the existing schema, importer, parser, tests, and importer documentation
to implement the approved paragraph-based v1 architecture.

The existing sentence-based importer successfully validated chapter detection
and exposed unnecessary sentence-tokenization complexity.

The approved architecture is now:

```text
Book
  └── Chapter
        └── Paragraph
```

A paragraph is:

- the normalized prose unit used by the future eReader;
- the canonical searchable chunk;
- the FTS content row;
- the search-result granularity;
- the stable target used to resolve a result back into the reader.

Sentence boundaries are not part of the v1 relational/search model.

## Read Before Implementing

Read and treat as authoritative:

- `docs/requirements.md`
- `docs/database-design.md`
- `docs/book-format-analysis.md`
- `docs/audit/chapter-headings/chapter-audit-summary.md`
- `docs/project-scaffold.md`
- `docs/importer.md`
- `docs/import-report.md`
- `sql/schema.sql`
- `config/books.js`
- `config/database.js`
- `scripts/init-db.js`
- `scripts/import-books.js`
- `scripts/lib/book-parser.js`
- `scripts/lib/chapter-parser.js`
- `scripts/lib/database-import.js`
- current importer/scaffold tests

Also inspect the six configured canonical `.txt` and metadata JSON files as
needed.

Do not use deferred v2 books.

## Approved Architectural Change

Replace the current sentence-based content model:

```text
books
  └── chapters
        └── paragraphs
              └── sentences
                    └── sentences_fts
```

with:

```text
books
  └── chapters
        └── paragraphs
              └── paragraphs_fts
```

The existing `sentences` and `sentences_fts` database objects are no longer part
of v1.

Do not preserve sentence tables merely for backward compatibility.

There is no deployed API or production database depending on the old schema.

## Schema Revision

Update `sql/schema.sql` to match `docs/database-design.md`.

### `paragraphs`

The `paragraphs` table must now store canonical normalized paragraph text.

At minimum it must retain:

- integer primary key;
- stable paragraph ID;
- parent book ID;
- parent chapter ID;
- one-based ordinal within chapter;
- one-based ordinal within book;
- normalized paragraph text.

Preserve the existing hierarchy and uniqueness protections where they remain
appropriate.

Paragraph text must be non-empty.

### Remove Sentence Schema

Remove:

- `sentences`;
- sentence foreign keys;
- sentence-specific indexes;
- `sentences_fts`;
- sentence FTS triggers;
- any schema constraints that exist only to support sentence rows.

Do not leave unused sentence infrastructure in the schema.

### Paragraph FTS

Create `paragraphs_fts` according to the approved database design.

Use external-content FTS5 tied directly to `paragraphs.id`.

Index only normalized paragraph text.

Retain the approved tokenizer configuration from the design:

```sql
tokenize = 'unicode61 remove_diacritics 0'
```

Add insert, delete, and text-update triggers so normal relational changes keep
`paragraphs_fts` synchronized.

### Metadata Sentence Counts

Do not remove canonical `sentenceCount` metadata merely because sentences are
no longer database entities.

Existing book-level and chapter-level sentence counts may remain stored as
reference/provenance metadata if the approved current schema/design retains
them.

They must not be used as importer publication validation criteria.

Do not tokenize sentences solely to reproduce or validate those counts.

## Importer Revision

Refactor the existing importer rather than replacing it wholesale.

Preserve working code for:

- canonical input validation;
- configured six-book scope;
- body boundary extraction;
- shared chapter detection;
- metadata validation;
- character import;
- character alias import;
- location import;
- location alias import;
- staging database creation;
- atomic publication;
- foreign-key checks;
- SQLite integrity checks;
- reporting infrastructure.

Remove sentence-specific parsing and import behavior.

## Paragraph Parsing Contract

Paragraph parsing is structural, not linguistic.

For each detected chapter:

- chapter-heading lines are structural and are not paragraph text;
- one or more blank or whitespace-only lines separate logical blocks;
- hard-wrapped physical source lines belonging to one prose paragraph are
  joined;
- joining physical lines must use appropriate spacing without altering
  meaningful punctuation or text;
- preserve original Unicode punctuation;
- preserve capitalization;
- preserve spelling;
- preserve meaningful apostrophes, dashes, quotation marks, italics markers,
  and other canonical textual characters unless an already-approved
  normalization rule says otherwise;
- do not split content based on sentence punctuation.

Each retained logical prose paragraph becomes exactly one `paragraphs` row.

Assign deterministic one-based:

- `ordinal_in_chapter`;
- `ordinal_in_book`.

Construct stable paragraph IDs using the approved design.

## Illustration and Decorative Block Handling

Correct illustration/decorative handling is required for this revision.

Illustration and decorative blocks:

- are not prose paragraphs;
- do not create `paragraphs` rows;
- do not enter `paragraphs.text`;
- do not enter `paragraphs_fts`;
- do not appear in search results;
- remain structural separators.

Removing an excluded block must never cause prose before and after that block to
be merged into one paragraph.

Support the source forms actually present in the approved corpus, including
standalone forms such as:

```text
[Illustration]
```

multiline blocks such as:

```text
[Illustration:

caption text

[Copyright ...]]
```

and terminal decorative blocks such as:

```text
[Illustration:

THE
END
]
```

Do not solve this by modifying the canonical `.txt` files.

### Required Pride and Prejudice Regression Cases

Add explicit parser fixtures/tests for the two known paragraph discrepancies
identified by the first importer audit.

#### Chapter XXVIII

The source contains an illustration block between prose paragraphs.

The previous parser produced one fewer paragraph than metadata.

The revised parser must:

- exclude the illustration block;
- preserve a paragraph boundary across it;
- not merge the prose before and after the illustration.

Expected result: chapter paragraph count matches metadata.

#### Chapter LXI

The source contains a final illustration block containing `THE END`.

The previous parser treated excluded terminal material as an additional
paragraph.

The revised parser must:

- exclude the terminal illustration;
- not create a paragraph row for it.

Expected result: chapter paragraph count matches metadata.

## Sentence Tokenizer Removal

Remove sentence tokenization from the v1 import pipeline.

This includes:

- sentence splitting;
- protected abbreviation rules;
- sentence ordinal generation;
- sentence stable IDs;
- sentence-count comparison as an import gate;
- sentence-specific discrepancy diagnostics;
- sentence inserts;
- sentence FTS population.

If sentence-tokenizer helper code is now unused, remove it rather than leaving
dead code.

Do not retain sentence parsing "just in case."

## Chapter Detection

Preserve the working shared chapter detector.

The first Prompt 4 run successfully detected all 269 chapters.

Do not redesign chapter detection unless this revision reveals an actual
regression.

The chapter audit command and importer must continue to share the same chapter
detection implementation.

Run the existing chapter audit after refactoring and verify that all six books
still pass.

## Paragraph Count Validation

Paragraph counts remain authoritative structural validation targets.

After parsing each chapter, compare parsed retained paragraph count to the
metadata chapter `paragraphCount`.

After parsing each book, compare parsed retained paragraph count to metadata
book `paragraphCount`.

A paragraph mismatch must:

- identify the book;
- identify the chapter;
- report expected and parsed counts;
- prevent database publication;
- appear in the Markdown import report.

Do not automatically modify metadata counts.

Do not modify source text to force agreement.

The goal of this revision is to determine whether the approved structural rules,
including correct illustration handling, reproduce all approved paragraph
counts.

## Database Population

Populate:

- `books`;
- `chapters`;
- `paragraphs`;
- `characters`;
- `character_aliases`;
- `locations`;
- `location_aliases`;
- `paragraphs_fts`.

Do not populate sentence rows because no sentence table should exist.

Each paragraph row must preserve enough hierarchy to identify:

- book;
- chapter;
- paragraph position within chapter;
- paragraph position within book.

This must support future:

1. ordered eReader rendering;
2. paragraph-level search results;
3. linking a search result back to its paragraph in the eReader.

Do not implement those frontend/API behaviors in this job.

## FTS Validation

Validate `paragraphs_fts` after import.

At minimum verify:

- every retained paragraph has the expected FTS representation;
- no orphan FTS rows exist;
- every FTS rowid resolves to one canonical paragraph;
- excluded illustration/decorative text is not indexed;
- representative paragraph text can be found through FTS5;
- insert/delete/update synchronization behavior works as designed.

The relational `paragraphs.text` field remains authoritative.

FTS is an index, not a second canonical text source.

## Atomic Rebuild

Preserve the existing staging/atomic publication model.

The workflow must remain conceptually:

1. validate source inputs;
2. create a staging database;
3. apply the revised `sql/schema.sql`;
4. import all six books;
5. populate relational metadata and paragraph content;
6. populate/verify paragraph FTS;
7. validate paragraph counts;
8. run database integrity checks;
9. close the staging database;
10. atomically replace `data/database.sqlite` only after all validation succeeds.

A failed import must leave the previously published database untouched.

Clean up staging files on failure.

Do not partially mutate the live database.

## Database Validation

Before publication, verify at minimum:

- exactly six configured books imported;
- all 269 expected chapters imported;
- chapter counts match metadata;
- paragraph counts match metadata by chapter and book;
- paragraph ordinals within every chapter are contiguous and one-based;
- paragraph ordinals within every book are contiguous and one-based;
- stable paragraph IDs are unique;
- no paragraph has empty text;
- no paragraph is orphaned;
- all paragraph/book/chapter relationships are valid;
- characters and aliases imported;
- locations and aliases imported;
- foreign-key check passes;
- SQLite integrity check passes;
- FTS consistency passes;
- no sentence table or sentence FTS table exists in the resulting schema.

Historical sentence counts do not determine success.

## Tests

Revise the existing importer tests to reflect the paragraph architecture.

Remove or replace tests that exist only for sentence tokenization.

At minimum test:

- book body boundary extraction;
- line-ending normalization;
- chapter detection/mapping;
- blank-line paragraph detection;
- hard-wrapped line joining;
- stable paragraph ID generation;
- one-based paragraph ordinals;
- metadata validation;
- source-path validation;
- illustration exclusion;
- multiline illustration exclusion;
- illustration as structural separator;
- Pride and Prejudice Chapter XXVIII regression;
- Pride and Prejudice Chapter LXI regression;
- source `locations` mapping;
- character/location alias import;
- successful controlled-fixture relational population;
- foreign-key integrity;
- paragraph FTS synchronization;
- excluded illustration text not being searchable;
- atomic publication behavior;
- failed-import preservation of the previous database.

Update scaffold/schema tests that currently expect sentence tables or
`sentences_fts`.

Tests should assert the revised expected schema.

Do not retain obsolete assertions for removed sentence objects.

## Import Report

Revise `docs/import-report.md` generation for paragraph-based importing.

The report should include:

- execution status;
- books processed;
- chapter expected/parsed totals;
- paragraph expected/parsed totals;
- character counts;
- character alias counts;
- location counts;
- location alias counts;
- paragraph FTS row count;
- foreign-key validation;
- SQLite integrity result;
- warnings;
- chapter-level paragraph discrepancies, if any;
- database publication status.

Do not include sentence mismatch sections as current importer failures.

If historical sentence counts are mentioned, clearly label them as source
metadata/reference only.

## Importer Documentation

Update `docs/importer.md` to describe the implemented paragraph architecture.

Remove obsolete documentation describing:

- canonical sentence rows;
- sentence tokenizer rules;
- sentence stable IDs;
- sentence ordinals;
- sentence FTS;
- sentence-count validation gates.

Document instead:

- paragraph chunk semantics;
- hard-wrapped line joining;
- blank-line boundaries;
- illustration/decorative exclusion;
- preservation of boundaries across excluded blocks;
- stable paragraph IDs;
- paragraph ordinals;
- paragraph FTS;
- atomic rebuild behavior;
- validation rules.

The documentation must agree with:

- `docs/requirements.md`;
- `docs/database-design.md`;
- actual implementation.

## Existing Audit Artifacts

Do not delete the previous `docs/import-report.md` information merely because it
came from the sentence-based audit unless the current report generator
intentionally replaces that generated report.

The earlier Prompt 4 result is useful historical evidence that led to this
architecture change.

If overwriting `docs/import-report.md` is the existing intended behavior, that
is acceptable, but do not rewrite unrelated historical audit documents.

Do not modify the chapter-heading audit except as required to preserve shared
parser compatibility.

## CLI

Preserve:

```text
npm run import
```

as the full rebuild command.

Preserve the schema-only initialization command already used by the scaffold.

The importer should exit:

- `0` only after complete successful validation and publication;
- non-zero on parser, validation, database, or publication failure.

## Constraints

Do not:

- modify canonical `.txt` files;
- modify canonical metadata JSON;
- delete sentence-count metadata solely because sentences are no longer chunks;
- implement sentence tokenization;
- retain unused sentence tables;
- import deferred v2 books;
- implement API routes;
- implement search endpoints;
- implement frontend behavior;
- implement the eReader;
- add frontend frameworks;
- add deployment configuration;
- add CORS;
- add rate limiting;
- add production security middleware;
- add embeddings, vectors, semantic search, or AI parsing.

Do not broaden this job beyond revising the schema and importer to the approved
paragraph-based architecture.

## Final Verification

Run:

- the complete automated test suite;
- the chapter-heading audit;
- `npm run import`;
- SQLite foreign-key validation;
- SQLite integrity validation;
- paragraph FTS consistency validation.

Inspect the resulting schema and explicitly confirm:

- `paragraphs` exists and contains normalized text;
- `paragraphs_fts` exists;
- `sentences` does not exist;
- `sentences_fts` does not exist.

If the real six-book import succeeds, report:

- books imported;
- chapters imported;
- paragraphs imported;
- character count;
- character alias count;
- location count;
- location alias count;
- paragraph FTS row count;
- test results;
- chapter-audit result;
- foreign-key result;
- SQLite integrity result;
- publication status.

If paragraph counts still disagree with metadata:

1. do not publish the staged database;
2. leave the previous database untouched;
3. produce chapter-level paragraph discrepancy diagnostics;
4. identify the exact retained/excluded source blocks around the discrepancy;
5. do not change metadata or canonical source automatically;
6. stop for review.

## Done When

This revision is complete when either:

### Successful paragraph import

All six approved books:

- detect all expected chapters;
- reproduce all approved paragraph counts;
- populate the revised paragraph-based schema;
- populate and validate `paragraphs_fts`;
- pass foreign-key and SQLite integrity checks;
- pass all automated tests;
- publish atomically.

OR:

### Paragraph audit still required

The revised schema/importer/tests are complete, but one or more real-book
paragraph counts still disagree with approved metadata.

In that case:

- publication must fail safely;
- the existing database must remain untouched;
- a useful paragraph-level discrepancy report must be generated;
- no sentence-tokenizer work should be reintroduced.
