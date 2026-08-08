# Jane Austen Book Importer

## Architecture

The v1 importer is a deterministic, paragraph-based staged rebuild implemented in Node.js.

```text
Book
  └── Chapter
        └── Paragraph
              └── paragraphs_fts
```

A retained logical prose paragraph is the canonical reader unit, relational content row, searchable chunk, FTS document, and future search-result target. Sentence boundaries are not parsed or stored in the v1 content model. Canonical book and chapter `sentenceCount` values remain stored only as source metadata for provenance; they are not import gates.

| Module | Responsibility |
|---|---|
| `config/books.js` | Authoritative ordered list of the six approved v1 directory slugs |
| `scripts/lib/chapter-parser.js` | Line-ending normalization, body-boundary extraction, audited chapter detection, and sequential chapter mapping |
| `scripts/lib/book-parser.js` | Canonical path and metadata validation, structural paragraph parsing, illustration exclusion, ordinals, stable IDs, and paragraph-count diagnostics |
| `scripts/lib/database-import.js` | Paragraph and metadata inserts, alias mapping, paragraph FTS validation, and staged-database validation |
| `scripts/import-books.js` | CLI orchestration, progress output, report generation, cleanup, and atomic publication |
| `scripts/audit-chapter-headings.js` | Chapter audit using the same detector as the importer |

The importer does not implement API routes, search endpoints, entity tagging, frontend behavior, or eReader behavior.

## Canonical inputs

Only slugs exported by `config/books.js` are processed. For each configured `<slug>`, the importer derives and reads:

```text
metadata/<slug>/<slug>.txt
metadata/<slug>/<slug>.metadata.json
```

Configured slugs and derived paths are authoritative. Resolved directories and files must remain under the approved `metadata/` root. Metadata `id`, `slug`, and `sourceFile` values are validated but cannot redirect filesystem access.

Text is decoded as strict UTF-8. Invalid byte sequences and NUL characters fail validation. Canonical text and metadata files are read-only inputs.

## Parsing pipeline

For every book, parsing occurs in this order:

1. Resolve and validate canonical paths.
2. Decode text and parse JSON metadata.
3. Validate metadata structure, types, IDs, aliases, counts, and internal metadata totals.
4. Normalize CRLF and bare CR line endings to LF in memory.
5. Extract content strictly between the unique `[[BOOK_START]]` and `[[BOOK_END]]` marker lines.
6. Detect and sequentially map audited chapter headings.
7. Convert retained physical source lines into logical prose paragraphs.
8. Assign one-based paragraph ordinals and deterministic stable IDs.
9. Compare every chapter and book paragraph total with metadata.

Database staging begins only after every source validates and all parsed paragraph counts agree.

## Body boundaries and chapter headings

A body marker is recognized only when its trimmed physical line exactly equals `[[BOOK_START]]` or `[[BOOK_END]]`. Exactly one marker of each kind is required, the start must precede the end, and marker lines and all outside text are excluded from content parsing.

The shared chapter detector recognizes a line matching this case-insensitive shape:

```regex
^\s*CHAPTER\s+(?:[IVXLCDM]+|\d+)[.\s]*$
```

Detected headings are mapped in physical source order to metadata chapter records. Counts must agree exactly. Heading lines remain structural metadata and do not create paragraph rows. The chapter audit and importer both use `scripts/lib/chapter-parser.js` so their behavior cannot drift.

## Paragraph normalization

Paragraph parsing is structural, not linguistic:

- one or more blank or whitespace-only lines separate logical blocks;
- leading and trailing whitespace is removed from each retained physical line;
- hard-wrapped physical lines in one prose block are joined with one ASCII space;
- repeated layout whitespace is collapsed to one ASCII space;
- Project Gutenberg production wrappers `/*`, optional `NIND` or `RIGHT`, and terminal `*/` are removed while retaining their enclosed prose;
- original Unicode punctuation, capitalization, spelling, apostrophes, dashes, quotation marks, and italics markers are otherwise preserved;
- punctuation never splits a paragraph.

Every retained non-empty logical prose block becomes exactly one `paragraphs` row with canonical normalized `text`.

## Illustration and decorative exclusion

Standalone and multiline bracketed illustration blocks are structural separators. The parser starts an exclusion at `[Illustration` and tracks nested square brackets across physical lines and blank lines until the matching close. This handles caption and copyright material contained in forms such as:

```text
[Illustration:

caption text

[Copyright ...]]
```

Standalone copyright blocks and terminal `FINIS`, `FINIS.`, or `THE END` blocks are also excluded. Excluded blocks:

- do not create paragraph rows;
- do not enter `paragraphs.text`;
- do not enter `paragraphs_fts`;
- force a structural boundary, including when no blank line surrounds them.

The parser records the exact source-line range and normalized text of excluded blocks for mismatch diagnostics. The Pride and Prejudice Chapter XXVIII regression verifies that prose on either side of an illustration remains two distinct paragraphs. Chapter LXI verifies that its final illustrated `THE END` block creates no paragraph.

## Stable identifiers and reading order

All ordinals are one-based:

- chapters within a book;
- paragraphs within a chapter;
- paragraphs within a book.

Stable identifiers follow the approved design:

```text
chapter:   <book-id>:chapter:<metadata-chapter-id>
paragraph: <book-id>:paragraph:<ordinal-in-book>
```

Internal SQLite integer keys are not reading-order or public identifiers.

## Metadata and aliases

Factual book metadata comes from validated JSON, including publication year, Gutenberg ID, and canonical reference counts. Book and chapter sentence counts are stored as reference metadata only; the importer performs no sentence segmentation or sentence-count comparison.

Characters, aliases, optional notes, and explicit `ambiguousAliases` are imported without inference or merging. Explicitly ambiguous aliases use `is_ambiguous = 1`.

Application and database terminology is `locations`. Canonical metadata may supply `locations` or the legacy field `places`, but not both. Either supported input maps to `locations` and `location_aliases` without rewriting source JSON.

## Database and paragraph FTS

After parsing succeeds, the importer initializes a separate staging database from `sql/schema.sql` and inserts all six books inside a transaction. `paragraphs.text` is authoritative. The external-content `paragraphs_fts` table indexes that column with:

```sql
tokenize = 'unicode61 remove_diacritics 0'
```

Insert, delete, and text-update triggers synchronize FTS for ordinary relational changes.

Before publication, validation checks:

- configured book IDs and all expected relational totals;
- stored and actual chapter/book paragraph counts;
- contiguous one-based chapter and paragraph ordinals;
- unique stable paragraph IDs;
- non-empty paragraph text and valid book/chapter hierarchy;
- character, location, and alias population;
- absence of excluded illustration/decorative markers from paragraph rows;
- absence of `sentences` and `sentences_fts` schema objects;
- SQLite foreign keys and `integrity_check`;
- FTS5 integrity and one indexed document per paragraph;
- no orphan FTS document IDs;
- representative FTS lookup;
- insert, delete, and update trigger synchronization.

## Atomic rebuild behavior

The published database is not opened for writes while parsing or staging. The importer:

1. parses and validates all configured books;
2. creates a uniquely named staging database beside the target;
3. applies the approved schema;
4. populates and validates the complete stage;
5. closes the stage;
6. atomically renames it over the generated target only after every check passes.

On error, the staging database and SQLite sidecars are removed. The previously published database remains untouched. The Markdown report is still replaced with failure details.

## CLI and report

Run the full rebuild with:

```sh
npm run import
```

The command exits zero only after successful validation and publication. Source, parser, database, or publication failures exit non-zero.

Every run replaces `docs/import-report.md`. It records execution and publication status, per-book chapter and paragraph expected/parsed totals, entity and alias counts, paragraph FTS validation when staging runs, warnings, and chapter-level paragraph discrepancies. Mismatch entries include sampled retained source blocks and every excluded block in the affected chapter with exact source line ranges.

If paragraph counts disagree, status is `PARSER AUDIT REQUIRED`, staging is not published, and neither metadata nor canonical source files are changed automatically.
