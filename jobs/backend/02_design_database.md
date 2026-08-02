This is a multi-step project. Complete only the job described below.

Do not anticipate later jobs or begin implementing the importer, API, or
frontend.

When a design decision cannot be resolved from the requirements and approved
source analysis, document it instead of making an assumption.

# Prompt 2 — Design the Database

## Objective

Design the SQLite schema for the Jane Austen Database.

The schema must support both:

1. An eReader that retrieves books, chapters, paragraphs, and sentences in
   source order.
2. A search and filter tool that searches sentence chunks by keyword or exact
   phrase and optionally filters by book, character, and location.

Design only. Do not create or populate the database.

## Read

- `requirements.md`
- `docs/book-format-analysis.md`
- `docs/audit/chapter-headings/chapter-audit-summary.md`
- the six approved book metadata JSON files

Do not inspect or use the deferred v2 books.

## Approved v1 Books

- `emma`
- `mansfield-park`
- `northanger-abbey`
- `persuasion`
- `pride-and-prejudice`
- `sense-and-sensibility`

## Scope

Design the normalized SQLite schema, including where appropriate:

- books
- chapters
- paragraphs
- sentences
- characters
- character aliases
- locations
- location aliases
- book-character relationships
- book-location relationships
- SQLite FTS5 sentence search
- indexes
- foreign keys
- uniqueness constraints
- ordinal and reading-order fields

Document why each table exists.

## Required Design Support

### eReader

The schema must support:

- retrieving all books
- retrieving one book and its chapter list
- retrieving one chapter in reading order
- preserving paragraph order within a chapter
- preserving sentence order within a paragraph, chapter, and book
- stable identifiers for books, chapters, paragraphs, and sentences

Use one-based content ordinals unless the approved source analysis establishes
a reason not to.

### Search

The schema must support:

- required keyword search
- required exact-phrase search
- optional book filter
- optional character filter
- optional location filter
- one result per matching sentence
- returning the matching sentence with its parent book, chapter, paragraph, and
  ordinals

Character and location filters use canonical names and approved aliases when
evaluating sentence text.

Dropdown selections alone do not return search results.

### Metadata

The schema must support:

- book title
- publication year
- author
- Gutenberg ID
- chapter, paragraph, and sentence counts
- characters
- character aliases
- locations
- location aliases
- location type
- optional metadata notes
- relative canonical text path

## Design Questions to Resolve

Document and justify:

- whether book, chapter, paragraph, and sentence counts are stored, derived, or
  both
- whether string source IDs are primary keys or separate internal integer keys
  are used
- how paragraph and sentence stable identifiers are generated
- whether ordinals are stored at book, chapter, and paragraph scope
- whether chapter headings are stored as reader content or chapter metadata
- how the FTS5 table relates to the canonical sentences table
- whether FTS5 uses external-content mode
- which fields are indexed
- how exact-phrase search is executed
- how character and location aliases are expanded into search constraints
- how ambiguous aliases are excluded or represented in v1
- how the database supports efficient chapter retrieval and ordered rendering
- how deletes and importer rebuilds preserve referential integrity

Do not invent sentence-level character or location tagging. The source metadata
associates characters and locations with books, while filtering evaluates
canonical names and approved aliases against sentence text.

## Deliverables

Create:

- `docs/database-design.md`
- `sql/schema.sql`

`docs/database-design.md` must include:

1. Design goals
2. Entity relationship overview
3. Table-by-table design
4. Primary keys and stable identifiers
5. Foreign keys and delete behavior
6. Ordinal and reading-order strategy
7. FTS5 design
8. Character and location filter strategy
9. Index strategy
10. Example eReader queries
11. Example search queries
12. Import and atomic-rebuild considerations
13. Unresolved decisions, if any

`sql/schema.sql` must contain the proposed schema only. It must not insert data.

## Constraints

- Do not build or populate the database.
- Do not write the importer.
- Do not implement API routes.
- Do not build the frontend.
- Do not use embeddings, vectors, or AI search.
- Do not include the three deferred v2 works.
- Do not modify source text or metadata files.

## Done When

The schema can be reviewed before implementation and fully supports:

- ordered eReader retrieval
- sentence-level FTS5 search
- book, character, and location filtering
- stable relationships from a search result back to its book, chapter,
  paragraph, and sentence
