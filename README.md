# Jane Austen Metadata

This repository contains a Project Gutenberg plain-text edition of Jane Austen’s _Pride and Prejudice_ and structured, book-level metadata derived from it.

The project focuses on factual extraction rather than literary analysis. Its metadata records chapter and text counts, named characters and aliases, named places, and stable identifiers for downstream use. Ambiguous or edition-dependent details are documented separately instead of being silently inferred.

## Repository contents

```text
.
├── books/
│   └── pride-and-prejudice.txt
├── jobs/
│   ├── metadata.md
│   └── metadata-update.md
├── metadata/
│   ├── pride-and-prejudice.metadata.json
│   └── pride-and-prejudice.metadata-report.md
├── INSTRUCTIONS.md
└── METADATA.md
```

- `books/` contains the source text. Source files should remain unchanged.
- `metadata/` contains generated JSON and its companion validation report.
- `jobs/metadata.md` defines the extraction requirements.
- `jobs/metadata-update.md` defines how older metadata is migrated to the current schema without re-analyzing the novel.
- `INSTRUCTIONS.md` provides the repository’s task entry points.
- `METADATA.md` describes the project’s extraction principles and boundaries.

## Current dataset

The current metadata file covers _Pride and Prejudice_ by Jane Austen, Project Gutenberg ebook 1342.

| Measure           | Value |
| ----------------- | ----: |
| Chapters          |    61 |
| Sentences         | 5,899 |
| Paragraphs        | 2,121 |
| Character entries |    48 |
| Place entries     |    49 |

Counts exclude the Project Gutenberg header, footer, license, preface, illustration captions, printer matter, and other non-novel content. See the [metadata report](metadata/pride-and-prejudice.metadata-report.md) for the counting convention, source-formatting issues, and items requiring manual review.

## Metadata structure

The JSON document contains:

- Book identity and source fields, including a stable book ID and Gutenberg ID.
- Aggregate chapter, sentence, and paragraph counts.
- Per-chapter IDs and sentence and paragraph counts.
- Character IDs, canonical names, supported aliases, and explicit alias ambiguity where needed.
- Place IDs, names, types, aliases, and factual notes.

All IDs are deterministic, lowercase kebab-case values. Entity IDs are namespaced with the book slug to avoid collisions.

## Working with the metadata

### Generate metadata from the source

1. Read `METADATA.md` and `jobs/metadata.md` in full.
2. Analyze `books/pride-and-prejudice.txt` as the sole source of truth.
3. Write the JSON and companion report to `metadata/`.
4. Validate the JSON and verify that aggregate counts equal the sums of the chapter counts.

Do not modify the source text or add unsupported entities, aliases, places, or interpretations.

### Update metadata to the latest schema

1. Read `jobs/metadata-update.md` in full.
2. Update `metadata/pride-and-prejudice.metadata.json` in place.
3. Preserve all existing counts and entities unless a schema requirement makes a structural change necessary.
4. Validate the resulting JSON and confirm that every required ID is unique and kebab-case.

Schema updates should not trigger a fresh analysis of the novel.

## Validation

The JSON syntax can be checked with Python’s standard library:

```sh
python3 -m json.tool metadata/pride-and-prejudice.metadata.json > /dev/null
```

Validation should also confirm that:

- `chapterCount` matches the number of chapter objects.
- Aggregate sentence and paragraph counts match the chapter-level sums.
- Book, chapter, character, and place IDs are present and unique.
- IDs contain only lowercase letters, numbers, and hyphens.
- The source text has not been modified.

## Editorial principles

- Prefer direct extraction over inference.
- Preserve uncertainty in notes or the companion report.
- Keep distinct people and properties separate, even when names overlap.
- Avoid assigning ambiguous titles such as “Miss Bennet” to a single character without context.
- Keep metadata factual; do not add themes, motifs, quotations, personality traits, or subjective analysis.
- Revalidate all generated JSON before committing changes.

## Source

The included text is a Project Gutenberg edition of _Pride and Prejudice_ (ebook 1342). Project Gutenberg licensing and distribution information is retained in the source file.
