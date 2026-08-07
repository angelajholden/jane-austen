This is a multi-step project. Complete only the job described below.

Do not anticipate later jobs or begin implementing API routes, search endpoints,
frontend behavior, eReader behavior, deployment, or production hardening.

Do not modify canonical source text or metadata in order to make the importer
succeed.

When parsing or validation produces a discrepancy, report it rather than
silently changing source data, metadata, or parsing rules.

# Prompt 4 — Build the Book Importer

## Objective

Build the deterministic importer that creates and populates the Jane Austen
Database SQLite database from the six approved v1 canonical book text files and
their metadata JSON files.

The importer must:

1. validate the configured source files and metadata;
2. extract the canonical book body;
3. detect and map chapters;
4. normalize paragraphs;
5. tokenize paragraphs into sentence chunks;
6. compare parsed counts against the existing metadata reference counts;
7. populate the approved relational schema;
8. populate and validate the FTS5 sentence index;
9. validate the complete staged database; and
10. publish the database atomically only after the entire import succeeds.

The importer must be deterministic: the same canonical inputs and importer
version must produce the same database content and stable identifiers.

## Read Before Implementing

Read and follow:

- `requirements.md`
- `docs/database-design.md`
- `docs/book-format-analysis.md`
- `docs/audit/chapter-headings/chapter-audit-summary.md`
- `docs/project-scaffold.md`
- `sql/schema.sql`
- `config/books.js`
- `config/database.js`
- `scripts/init-db.js`
- `server/db.js`

Also inspect the canonical `.txt` and `.metadata.json` files for the six
configured v1 books.

The current approved schema is authoritative for this job.

Do not redesign the database unless implementation reveals that the approved
schema cannot represent the required imported data. If that occurs, stop and
document the issue rather than silently changing the schema.

## Approved v1 Books

Import only the books explicitly configured in `config/books.js`.

The current approved set is:

- `emma`
- `mansfield-park`
- `northanger-abbey`
- `persuasion`
- `pride-and-prejudice`
- `sense-and-sensibility`

Do not discover additional book directories automatically.

Do not import or inspect deferred v2 works as importer inputs.

## Canonical Sources

For each configured book slug `<slug>`, the importer must use:

- `metadata/<slug>/<slug>.txt`
- `metadata/<slug>/<slug>.metadata.json`

The configured directory slug is authoritative.

Derive the canonical text path from the configured slug.

If `sourceFile` remains present in metadata, validate that it agrees with the
derived path. Do not use unchecked metadata paths as filesystem authority.

Do not modify either canonical source file.

## Source Validation

Before importing a book, validate at minimum:

- configured directory exists;
- expected canonical `.txt` file exists;
- expected `.metadata.json` file exists;
- canonical paths remain inside the approved metadata root;
- text is valid readable UTF-8;
- metadata is valid JSON;
- metadata has the required approved fields and types;
- metadata `id` and `slug` agree with the configured slug;
- `sourceFile`, if required by the current contract, agrees with the derived
  canonical path;
- chapter IDs are unique within the book;
- character IDs are unique within the book;
- location IDs are unique within the book;
- chapter numbers are sequential positive integers;
- metadata chapter count agrees with `chapters.length`;
- metadata book paragraph count equals the sum of chapter paragraph counts;
- metadata book sentence count equals the sum of chapter sentence counts;
- aliases have valid supported shapes;
- required strings are non-empty;
- required numeric counts are valid non-negative integers.

Validation failures must identify the book and field/file involved.

## Book Body Boundaries

Only canonical book content between the approved:

`[[BOOK_START]]`

and:

`[[BOOK_END]]`

markers may be parsed into chapters, paragraphs, and sentences.

Requirements:

- exactly one valid start marker must exist;
- exactly one valid end marker must exist;
- start must precede end;
- neither marker is imported as reader content;
- Gutenberg headers, footers, licenses, and other material outside these
  boundaries must not enter paragraph or sentence content.

Line endings must be normalized at the input boundary so CRLF versus LF does
not affect parsing.

Do not otherwise Unicode-normalize or ASCII-fold canonical text.

Preserve original Unicode punctuation, apostrophes, quotation marks, dashes,
capitalization, and spelling.

## Chapter Detection and Mapping

Use the already-audited chapter-heading rules represented by the existing
chapter audit work.

All six v1 books have already been verified to produce a one-to-one mapping
between detected chapter headings and ordered metadata chapter records.

The importer must:

- detect chapter boundaries deterministically;
- preserve source reading order;
- map detected chapters sequentially to the ordered metadata `chapters` array;
- use metadata chapter IDs as the stable chapter source IDs;
- use one-based chapter ordinals;
- validate detected chapter count against metadata;
- treat chapter-heading lines as structural metadata, not sentence or paragraph
  content.

Do not add chapter markers to the canonical `.txt` files.

Do not invent a new chapter-detection strategy if the existing audited logic can
be reused or extracted into shared code.

If the audit implementation currently contains reusable chapter-detection
logic, refactor that logic into a shared parser module rather than maintaining
two independently evolving implementations.

The existing chapter audit must continue to work after any such refactor.

## Paragraph Parsing and Normalization

Within each detected chapter:

- one or more blank or whitespace-only lines separate prose paragraphs;
- physical lines belonging to the same prose paragraph may be hard-wrapped by
  the Gutenberg source;
- join wrapped physical lines into one logical paragraph;
- use one ASCII space where layout-only line wrapping requires a joining space;
- trim leading and trailing layout whitespace;
- collapse layout-induced repeated whitespace where required for normalized
  reader text;
- do not alter meaningful textual characters or punctuation;
- do not treat chapter headings as paragraphs.

Assign one-based paragraph ordinals:

- within the chapter; and
- within the book,

as required by the approved schema.

Paragraph IDs must follow the stable identifier strategy approved in
`docs/database-design.md`.

## Sentence Tokenization

Implement one explicit deterministic sentence tokenizer for v1.

Do not delegate sentence boundaries to an LLM or any nondeterministic process.

The tokenizer operates on normalized logical paragraph text.

It must be suitable for the inspected Jane Austen corpus and explicitly handle
at minimum:

- `.`
- `?`
- `!`
- common English abbreviations such as `Mr.` and `Mrs.`;
- initials;
- punctuation followed by closing quotation marks;
- Unicode curly quotation marks;
- apostrophes;
- ellipses;
- dialogue punctuation;
- punctuation adjacent to closing brackets or parentheses where encountered;
- historical punctuation patterns present in the six canonical texts.

A sentence must never cross a paragraph boundary.

Preserve the resulting sentence text exactly as derived from the normalized
paragraph text. Do not lowercase, ASCII-fold, stem, or otherwise alter stored
canonical sentence text.

Document the tokenizer algorithm and its protected abbreviations/rules in the
importer documentation so the sentence-counting behavior is reproducible in
future rebuilds.

Assign one-based sentence ordinals:

- within the paragraph;
- within the chapter; and
- within the book,

as required by the approved schema.

Sentence IDs must follow the stable identifier strategy approved in
`docs/database-design.md`.

## Reference Count Validation

The existing metadata sentence and paragraph counts were produced by the
earlier metadata-analysis job and are reference counts for this importer.

After parsing each chapter, compare:

- parsed paragraph count to metadata chapter `paragraphCount`;
- parsed sentence count to metadata chapter `sentenceCount`.

After parsing each book, compare:

- parsed chapter count to metadata `chapterCount`;
- parsed paragraph count to metadata `paragraphCount`;
- parsed sentence count to metadata `sentenceCount`.

Produce clear diagnostics such as:

Book: Emma
Chapter: chapter-1
Expected paragraphs: 47
Parsed paragraphs: 47
Expected sentences: 158
Parsed sentences: 160
Result: SENTENCE COUNT MISMATCH

If paragraph or sentence counts disagree:

- report every discrepancy by book and chapter;
- report expected and actual counts;
- provide enough nearby parsing context to investigate likely sentence-boundary
  differences;
- do not modify metadata counts;
- do not modify canonical text;
- do not add arbitrary tokenizer exceptions solely to force agreement;
- do not publish the staged database.

Count disagreement is a failed import, but it is also an audit result. Preserve
the diagnostic information necessary for the next review.

## Book Metadata Import

Populate `books` according to the approved schema and database design.

Import the approved metadata fields, including:

- stable source ID;
- slug;
- title;
- author;
- publication year;
- Gutenberg ID;
- relative canonical source path;
- canonical raw text/body where required by the approved schema;
- approved stored/validated counts.

Use metadata values as authoritative for factual book metadata.

Do not derive publication year from Gutenberg release information.

## Chapter Import

Populate `chapters` using:

- stable metadata chapter ID;
- parent book;
- chapter ordinal;
- display title;
- approved count fields required by the schema.

Preserve the metadata chapter titles for display.

Raw source headings are structural parsing inputs and do not replace the
approved metadata display title unless the schema explicitly stores both.

## Character and Alias Import

Populate the approved character and character-alias tables from metadata.

Requirements:

- preserve canonical character names;
- preserve approved aliases;
- preserve optional notes where supported;
- preserve explicit ambiguity information where supported by the current
  schema/design;
- do not perform sentence-level character tagging;
- do not infer additional characters or aliases;
- do not modify metadata to resolve alias collisions.

Alias collisions that are permitted by the approved metadata/design must not
cause entity merging.

## Location and Alias Import

The normalized application and database terminology is `locations`.

If the existing canonical metadata JSON uses the source field `places`, treat
that only as the input field name and map its records into the database
`locations` and `location_aliases` tables.

Populate the approved location and location-alias tables from metadata.

Requirements:

- preserve canonical location names;
- preserve location types;
- preserve aliases;
- preserve optional notes where supported;
- do not infer additional locations;
- do not perform sentence-level location tagging;
- do not modify canonical metadata solely to rename the source JSON field.

All new application code, database terminology, importer documentation, reports,
and future API terminology must use `locations`.

## Paragraph and Sentence Import

Populate the approved paragraph and sentence tables in deterministic reading
order.

Each sentence must retain the relationships and ordinals necessary to identify
its:

- book;
- chapter;
- paragraph;
- position within its paragraph;
- position within its chapter;
- position within its book.

The resulting data must support both future use cases:

1. ordered eReader chapter rendering;
2. sentence-level search results that can resolve back to an exact reader
   location.

Do not implement either frontend behavior in this job.

## FTS5

Populate the existing `sentences_fts` design exactly as approved by
`sql/schema.sql` and `docs/database-design.md`.

Do not redesign the FTS schema.

After import, validate that:

- every canonical sentence has the expected FTS representation;
- no orphan FTS rows exist;
- FTS synchronization behavior works as designed;
- representative sentence text can be found through FTS5;
- canonical sentence text remains stored in the canonical `sentences` table.

Do not implement the future `/api/search` route.

## Atomic Rebuild

The importer must build and validate a complete staged database before replacing
the existing generated database.

Follow the atomic publication principles already used by the scaffold
initialization utility.

A failed import must leave the previously published
`data/database.sqlite` untouched.

The workflow should be conceptually:

1. validate source inputs;
2. create a new temporary/staging database;
3. apply `sql/schema.sql`;
4. import all six books;
5. populate all relational data;
6. populate/verify FTS;
7. validate counts;
8. run database integrity checks;
9. close the staged database;
10. atomically replace the generated database only after every validation
    succeeds.

Clean up temporary database files after failure.

Do not partially update the existing published database.

## Database Validation

Before publication, verify at minimum:

- all six configured books were imported exactly once;
- expected chapter counts match;
- expected paragraph counts match;
- expected sentence counts match;
- metadata entities were imported;
- foreign-key integrity passes;
- stable IDs are unique at their required scopes;
- ordinals are sequential and one-based;
- no paragraph is orphaned;
- no sentence is orphaned;
- no empty sentence exists;
- FTS consistency checks pass;
- SQLite integrity check passes.

Where practical, validate totals both globally and by book.

## CLI / npm Workflow

Provide a clear importer command through `package.json`, preferably:

`npm run import`

The command must:

- rebuild from canonical source data;
- produce useful progress output;
- return exit code 0 only on complete success;
- return a non-zero exit code on validation or import failure.

Do not require manually running `npm run db:init` before every import if the
importer owns creation of its staged database.

Preserve `npm run db:init` as the existing schema-only initialization tool.

## Import Report

Generate a human-readable Markdown import report under `docs/` or another
appropriate existing documentation/report directory.

The report must include:

- importer execution status;
- books processed;
- chapter totals by book;
- paragraph expected/parsed totals by book;
- sentence expected/parsed totals by book;
- metadata entity counts;
- FTS row/count validation;
- database integrity result;
- foreign-key result;
- any warnings;
- every parsing/count discrepancy if the import fails.

For count mismatches, include chapter-level diagnostics.

The report should be useful for manual review without requiring the console
output to be preserved.

Do not overwrite historical audit documentation.

## Tests

Add automated tests appropriate to the importer.

At minimum test:

- body-boundary extraction;
- line-ending normalization;
- paragraph detection;
- wrapped-line joining;
- chapter detection/mapping;
- sentence tokenization;
- abbreviation handling;
- dialogue/closing-quote sentence boundaries;
- one-based ordinal generation;
- stable ID generation;
- metadata validation;
- source-path validation;
- canonical metadata location-field mapping into database `locations`;
- atomic failure behavior;
- successful schema population using controlled fixture data;
- foreign-key integrity;
- FTS synchronization/lookup.

Use small controlled fixtures for parser unit tests rather than depending only
on full-book integration tests.

Also run the importer against the six real configured books as the final
integration test.

Do not weaken validation merely to make tests pass.

## Documentation

Create or update importer documentation describing:

- importer architecture;
- canonical inputs;
- parsing stages;
- body-boundary rules;
- chapter-detection strategy;
- paragraph normalization rules;
- exact sentence-tokenization rules;
- stable ID construction;
- ordinal semantics;
- metadata mapping;
- FTS population;
- atomic rebuild behavior;
- validation behavior;
- CLI usage;
- failure/reporting behavior.

Document the tokenizer precisely enough that a future implementation could
reproduce its behavior without guessing.

## Constraints

Do not:

- modify canonical `.txt` files;
- modify canonical metadata JSON;
- change reference counts automatically;
- add chapter markers to source text;
- import deferred v2 books;
- implement API routes;
- implement search endpoints;
- implement the frontend;
- implement the eReader;
- add frontend frameworks;
- add deployment configuration;
- add CORS;
- add production rate limiting;
- add production security middleware;
- redesign the approved schema without stopping and reporting the issue;
- use embeddings, vectors, semantic search, or AI-generated sentence parsing.

Keep this job focused on producing a deterministic, validated SQLite database
from the approved canonical sources.

## Final Verification

Run:

- the complete automated test suite;
- the real six-book importer;
- SQLite foreign-key validation;
- SQLite integrity validation;
- FTS consistency validation.

If the real-book importer succeeds, report:

- total books;
- total chapters;
- total paragraphs;
- total sentences;
- total characters;
- total character aliases;
- total locations;
- total location aliases;
- FTS row count;
- test results.

If the real-book importer fails because parsed counts differ from metadata,
that is an acceptable outcome for this job.

Do not attempt an undocumented fix.

Instead:

1. leave the existing published database untouched;
2. write the complete discrepancy report;
3. identify the affected books and chapters;
4. summarize the likely tokenizer or paragraph-boundary cases requiring review;
5. stop.

## Done When

This job is complete when either:

### Successful import

All six configured books parse and validate against the approved metadata,
the complete SQLite database is populated and published atomically, FTS and
database integrity checks pass, and all tests pass.

OR:

### Parser audit required

The importer implementation and tests are complete, but one or more real-book
paragraph or sentence counts differ from the reference metadata.

In that case, the importer must fail safely, preserve the existing database,
generate the complete discrepancy report, and stop for human review rather
than altering the source, metadata, or tokenizer to manufacture agreement.
