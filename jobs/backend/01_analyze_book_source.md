This is a multi-step project. Complete only the job described below.

Do not anticipate later jobs, write application code, create a database, or
scaffold the application.

When the source files do not establish a reliable rule, document the unresolved
decision instead of inventing one.

# Prompt 1 — Analyze Book Source Format

## Objective

Analyze the approved Jane Austen book directories and document the exact source
format required to implement the importer.

Do not write application code.

## Read

- `requirements.md`

## Scope

Inspect only the approved directories inside `metadata/` that are provided for
this job.

Treat those directories as the complete analysis scope. Do not inspect,
reference, or make assumptions based on files outside those directories.

Each approved directory may contain:

- a plain-text book file
- a corresponding JSON metadata file

## Determine

### Directory and file contract

- expected directory naming
- expected text filename
- expected metadata filename
- whether filenames must match the directory slug
- how the relative book path is derived
- whether extra files or nested directories exist

### Plain-text book format

- whether one physical line equals one sentence chunk
- how sentences are separated
- how chapters are represented
- how chapter headings are represented
- how paragraphs are represented
- the meaning of blank lines
- how wrapped or multi-line sentences behave
- whether whitespace must be normalized
- whether headings, front matter, notes, or other non-book text are present
- how stable reading order can be derived

### JSON metadata format

- required top-level fields
- optional fields
- data types
- book identifier and title fields
- publication-date or publication-year fields
- chapter, sentence, and paragraph counts
- character structure
- character alias structure
- location structure
- location alias structure
- whether identifiers are unique
- whether aliases are unique or may overlap
- whether metadata counts agree with the text files

### Sentence chunk contract

Determine the values that can be reliably derived for each sentence chunk,
including where supported by the source files:

- book ID
- chapter ID or chapter ordinal
- paragraph ordinal
- sentence ordinal within the book
- sentence ordinal within the chapter
- sentence text
- relative book path

Do not assume that a value can be derived when the source files do not support
it.

### Validation and edge cases

Document:

- missing file behavior
- malformed JSON
- missing required metadata
- invalid field types
- duplicate IDs
- empty books or chapters
- empty sentence chunks
- mismatched metadata counts
- inconsistent filenames
- unsupported extra files
- line-ending differences
- Unicode punctuation and quotation marks
- multi-line sentences
- any inconsistencies between books

## Deliverable

Create:

`docs/book-format-analysis.md`

The document must contain:

1. Files and directories inspected
2. Directory and filename contract
3. Plain-text parsing contract
4. JSON metadata contract
5. Sentence chunk parsing contract
6. Relative path derivation
7. Validation rules
8. Example normalized book object
9. Example normalized sentence chunk object
10. Inconsistencies and edge cases
11. Decisions required before importer implementation

Use examples taken from the inspected files, but keep examples concise.

## Constraints

- Do not modify source book or metadata files.
- Do not create or modify a database.
- Do not scaffold the application.
- Do not write importer code.
- Do not design API routes.
- Do not resolve ambiguities by assumption.

## Done When

Another developer could implement the source-file reader and validator without
reopening the inspected book files, and all unresolved format decisions are
clearly identified.
