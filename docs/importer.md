# Jane Austen Book Importer

## Architecture

The v1 importer is a deterministic staged rebuild implemented in Node.js:

| Module | Responsibility |
|---|---|
| `config/books.js` | Authoritative ordered list of the six approved v1 directory slugs |
| `scripts/lib/chapter-parser.js` | Line-ending normalization, book-boundary extraction, audited chapter detection, and sequential chapter mapping |
| `scripts/lib/book-parser.js` | Canonical path and metadata validation, paragraph normalization, sentence tokenization, ordinals, stable IDs, and count diagnostics |
| `scripts/lib/database-import.js` | Relational inserts, alias mapping, FTS population through approved triggers, and staged-database validation |
| `scripts/import-books.js` | CLI orchestration, progress output, report generation, cleanup, and atomic publication |
| `scripts/audit-chapter-headings.js` | Chapter audit using the same shared detector as the importer |
| `scripts/audit-chapter-headings.py` | Compatibility wrapper for the pre-existing Python audit command |

The importer does not implement API routes, search endpoints, sentence-level entity tagging, frontend behavior, or eReader behavior.

## Canonical inputs

Only the slugs exported by `config/books.js` are processed. For each configured `<slug>`, the importer derives and reads:

```text
metadata/<slug>/<slug>.txt
metadata/<slug>/<slug>.metadata.json
```

The configured slug and derived filesystem paths are authoritative. Resolved directories and files must remain under the approved `metadata/` root. Metadata `id`, `slug`, and `sourceFile` are validation inputs and cannot redirect file access.

Text is decoded as strict UTF-8. Invalid byte sequences and NUL characters fail validation. Canonical text and metadata files are read-only importer inputs.

## Parsing stages

For every book, parsing occurs in this fixed order:

1. Resolve and validate canonical paths.
2. Decode text and parse JSON metadata.
3. Validate metadata structure, types, IDs, aliases, counts, and internal totals.
4. Normalize CRLF or bare CR line endings to LF in memory.
5. Extract content strictly between the unique `[[BOOK_START]]` and `[[BOOK_END]]` lines.
6. Detect and sequentially map audited chapter headings.
7. Convert retained physical-line blocks into normalized logical paragraphs.
8. Tokenize every paragraph independently into sentence chunks.
9. Assign one-based ordinals and deterministic stable IDs.
10. Compare every parsed chapter and book total with metadata reference counts.

No database staging begins when source validation or parsed reference counts fail.

## Body-boundary rules

After line-ending normalization, a marker is recognized only when the trimmed physical line exactly equals `[[BOOK_START]]` or `[[BOOK_END]]`.

- Exactly one marker of each kind is required.
- The start marker must precede the end marker.
- Marker lines are excluded.
- Text outside the markers is never parsed into chapters, paragraphs, or sentences.
- No Unicode normalization, ASCII folding, case conversion, or spelling correction is performed.

The raw canonical file text is retained unchanged in `books.source_text`; normalized body text supplies reader/search rows.

## Chapter detection

The shared detector recognizes a physical line matching this case-insensitive structure:

```text
optional whitespace + CHAPTER + whitespace + Roman or Arabic numeral + optional period/whitespace
```

Equivalent regular expression:

```regex
^\s*CHAPTER\s+(?:[IVXLCDM]+|\d+)[.\s]*$
```

Only matches inside the approved body markers are considered. Detected headings are mapped in source order to metadata `chapters` records. Counts must agree exactly. Heading lines are structural metadata and are excluded from paragraph and sentence content. Metadata titles remain the display titles.

The existing chapter audit and importer both call `scripts/lib/chapter-parser.js`, preventing detector drift. The former Python command delegates to the shared Node audit entry point.

## Paragraph normalization

Within a detected chapter:

1. One or more empty or whitespace-only physical lines end a logical block.
2. Leading and trailing whitespace is removed from every retained physical line.
3. Wrapped physical lines in one block are joined with one ASCII space.
4. Repeated layout whitespace is collapsed to one ASCII space.
5. Project Gutenberg production wrappers `/*`, optional `NIND`/`RIGHT`, and terminal `*/` are removed while retaining their enclosed textual content.
6. Empty normalized blocks are discarded.
7. Structural blocks beginning with `[Illustration` or `[_Copyright`/`[Copyright`, plus standalone `FINIS`, `FINIS.`, or `THE END`, are excluded as non-reader matter.

These structural exclusions reproduce the approved paragraph totals for all six current v1 sources. Meaningful punctuation, quotation marks, apostrophes, dashes, capitalization, spelling, italic underscores, and other textual characters are otherwise preserved.

## Sentence tokenizer, version 1

The tokenizer scans one normalized paragraph from left to right. It never carries state across paragraph boundaries.

### Candidate terminal punctuation

A run containing `.`, `?`, or `!` is a boundary candidate. Adjacent terminal characters are consumed as one run. Immediately following closing characters are included in the candidate sentence:

```text
"  '  ”  ’  )  ]  }
```

A candidate can close a sentence only when it reaches the paragraph end or is followed by whitespace. Punctuation followed immediately by an em dash, comma, colon, or other non-closing/non-whitespace character is not a boundary at that position.

### Protected periods

A period is not a boundary when it is:

- between two digits, as in a decimal;
- after a single uppercase initial;
- the final period of `e.g.`, `i.e.`, `a.m.`, or `p.m.`;
- after one of these case-insensitive protected abbreviations:

```text
capt. chap. chaps. col. dr. esq. etc. gen. hon. jr. lt. maj.
messrs. mlle. mme. mmes. mr. mrs. ms. mt. no. nos. p. pp.
prof. rev. sgt. sr. st. viz. vol. vols. vs.
```

### Dialogue and lowercase continuation

After consuming closing punctuation and whitespace, a candidate is not a boundary when the next content character is lowercase ASCII. This keeps lowercase dialogue attribution or continuation with its quoted speech, for example:

```text
“Are you well?” she asked.
```

Uppercase text, an opening quotation mark, an italic marker, a digit, or paragraph end may begin the next sentence.

### Ellipses

A run of two or more periods is treated as a non-terminal ellipsis when more paragraph text follows. An ellipsis at paragraph end remains part of the paragraph's final sentence.

### Output preservation

When a boundary is accepted, text from the current sentence start through the terminal run and its closing characters is trimmed only at its outer edges and emitted unchanged. At paragraph end, any non-empty remainder is emitted as the final sentence. A non-empty paragraph therefore always produces at least one sentence.

The tokenizer does not lowercase, stem, ASCII-fold, Unicode-normalize, or rewrite punctuation. The exact implementation and protected list are exported from `scripts/lib/book-parser.js` and covered by controlled tests.

## Stable identifiers and ordinals

All content ordinals are one-based:

- chapters: within book;
- paragraphs: within chapter and book;
- sentences: within paragraph, chapter, and book.

Stable IDs follow the approved design:

```text
chapter:   <book-id>:chapter:<metadata-chapter-id>
paragraph: <book-id>:paragraph:<ordinal-in-book>
sentence:  <book-id>:sentence:<ordinal-in-book>
```

Internal SQLite integer primary keys are never used as public stable identifiers or reading order.

## Metadata mapping

Factual book metadata comes directly from validated JSON, including publication year and Gutenberg ID. Book and chapter reference counts are stored only after parsed counts agree.

Characters, approved aliases, optional notes, and explicit `ambiguousAliases` are imported without inference or merging. Ambiguous aliases use `is_ambiguous = 1`.

Application and database terminology is `locations`. Canonical metadata may supply `locations` or the legacy input field `places`, but not both. Either supported input is normalized in memory and inserted into `locations` and `location_aliases`. Source JSON is not rewritten.

No sentence-character or sentence-location links are created.

## Database and FTS population

After every source and reference count passes, the importer initializes a separate staging database from `sql/schema.sql` and inserts all six books in configured order inside a transaction. Approved `sentences` triggers populate the external-content `sentences_fts` index.

Before publication, validation checks:

- configured book IDs and all expected table totals;
- one-based contiguous ordinals at every stored scope;
- paragraph and sentence hierarchy;
- empty sentences and orphan rows;
- SQLite foreign-key integrity;
- SQLite `integrity_check`;
- FTS5 `integrity-check`;
- representative FTS lookup;
- update-trigger synchronization inside a rolled-back savepoint;
- FTS and canonical sentence row totals.

Canonical sentence text remains in `sentences`; FTS is only its search index.

## Atomic rebuild behavior

The published database is never opened for writes during parsing or staging. The importer:

1. parses and validates all configured books;
2. creates a uniquely named staging database beside the target;
3. applies the approved schema;
4. populates and validates the complete stage;
5. closes the stage;
6. atomically renames it over the generated target database.

On any error, the staging database and SQLite sidecar files are removed. The previously published database remains untouched. The generated Markdown report is still updated with the failure and diagnostics.

## CLI usage

Run the complete rebuild with:

```sh
npm run import
```

The command owns staging initialization; `npm run db:init` is not required first. It exits zero only after successful validation and publication. Validation failures and parser count discrepancies exit non-zero.

## Failure and reporting behavior

Every run writes `docs/import-report.md`. The report contains execution status, processed books, expected/parsed totals, metadata entity counts, chapter-level discrepancies, representative normalized context, FTS results, integrity results, and warnings.

If source validation fails, the report identifies the book, file, or field. If reference counts disagree, status is `PARSER AUDIT REQUIRED`, every mismatched chapter is listed, no database is published, and no tokenizer or metadata exception is introduced automatically.
