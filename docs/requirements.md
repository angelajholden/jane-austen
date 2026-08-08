# Jane Austen Database v1 Requirements

## Goal

Build a structured, searchable Jane Austen database with an Express.js API.

The database must support two primary application functions:

1. An eReader for reading books and chapters in source order.
2. A search and filter interface for locating matching paragraph chunks by keyword or exact phrase, with optional book, character, and location filters.

Search results must include enough book, chapter, and paragraph information to open the matching paragraph in the eReader.

The database is not an AI application.

---

## Architecture

One application and one Git repository.

```text
Frontend eReader
      │
      ▼
Express.js API
      │
      ▼
SQLite + FTS5
```

---

## Source of Truth

The `metadata/` folder is the source of truth.

Each approved book directory contains one canonical plain-text book file and one corresponding JSON metadata file. Together, those two files form the source of truth for that book.

Specifically:

```
metadata/
emma/
mansfield-park/
northanger-abbey/
persuasion/
pride-and-prejudice/
sense-and-sensibility/
```

The importer reads the local filesystem.

It does **not** read GitHub.

---

# Import Configuration

The importer reads an explicit list of approved book directories.

Example:

```js
export const bookDirectories = ["emma", "mansfield-park", "northanger-abbey"];
```

---

# Import Process

Every importer run:

1. Reads the approved metadata-directory configuration.
2. Traverses every approved directory.
3. Reads and validates every plain text and JSON metadata file in those directories.
4. Parses metadata and paragraph chunks.
5. Rebuilds the SQLite metadata and FTS data.
6. Commits the replacement only after the complete import succeeds.

No incremental updates in v1.

## Paragraph Chunk Semantics

A searchable chunk is one logical prose paragraph.

Physical line breaks in the canonical plain-text source do not define chunks. Hard-wrapped physical lines belonging to the same prose paragraph are joined during import.

Blank-line paragraph boundaries in the canonical source are used to determine logical paragraph structure.

Illustration, decorative, and other non-prose blocks are not searchable paragraph content. Removing such a block must preserve paragraph boundaries so prose appearing before and after the excluded block is never incorrectly joined into one paragraph.

Sentence boundaries are not used to define searchable chunks in v1.

---

# Database Stores

Each novel/book should include at minimum:

- book title
- book date
- book id
- chapter count
- sentence count
- paragraph count
- characters
- locations
- character aliases
- location aliases
- relative book path
- book text
- book paragraph chunks

The relative file path is derived automatically from the folder structure.

Example:

```
metadata/emma/emma.txt
metadata/emma/emma.metadata.json
```

No additional metadata field is required.

Sentence counts may remain part of the canonical book metadata, but sentences are not first-class searchable chunks in the v1 database.

---

# Search

SQLite FTS5

Supports:

- keyword search
- exact phrase search

Search operates on paragraph chunks.

No AI.

No embeddings.

No vector database.

---

# Filters

Current planned filters:

- Open keyword search
- Character dropdown
- Location dropdown
- Book title dropdown

If a user selects "Emma" from the Book title dropdown, the Character dropdown and the Location dropdown should update to reflect only characters and locations from "Emma".

---

# Frontend Responsibilities

- Search form
- Filters
- Results table
- Client-side sorting
- Highlight matching keyword or exact phrase within paragraph results
- Open a search result at the corresponding paragraph in the eReader

---

# Backend Responsibilities

- Traverse metadata directory
- Import plain text and JSON
- Parse plain text and JSON
- Normalize canonical paragraph chunks
- Populate SQLite
- Execute FTS queries
- Return JSON

---

# Explicitly Out of Scope (v1)

- AI search
- RAG
- Embeddings
- Automatic tagging
- Incremental imports
- Vector databases

## Proposed Structure

```
jane-austen/
  data/
    database.sqlite

  scripts/
    import-books.js

  server/
    server.js
    db.js
    routes/
      search.js
      metadata.js

  client/
    index.html
    src/
      main.js
      api/
      components/
      utils/
```

# Search Result Granularity

One API search result represents one matching paragraph chunk.

If multiple paragraph chunks from the same book match the query, the API returns multiple results. Each result includes the parent book metadata, chapter information, matching paragraph, paragraph location, and book path needed to resolve the result to the eReader.

The frontend may later group, collapse, or deduplicate results by book, but the API preserves paragraph-level matches.

The frontend may display either the complete matching paragraph or a shorter excerpt around the match. This presentation choice does not change the paragraph-level search granularity.

---

# Frontend Development Scope

The project owner will implement the final frontend structure, presentation, interactions, and styling.

Codex may provide:

- an initial semantic HTML shell
- an API fetch example
- a minimal proof-of-concept render

Any Codex-generated frontend must remain deliberately minimal and disposable.

The backend API and its JSON response contract must be completed before the final frontend is implemented.

---

# API Contract

The backend must return frontend-ready JSON.

The frontend must not:

- inspect raw SQLite rows
- derive relative book paths

The API contract must be documented and represented by realistic JSON fixtures before the final frontend is built.

Search results must contain enough information to identify the matching paragraph and resolve that paragraph to its location within the appropriate book and chapter.

---

# Search Execution

A keyword or exact phrase is required to execute a search.

Selecting or changing a dropdown filter does not return paragraph results by itself.

Dropdown filters may update the available options in other dropdowns. For example, selecting `Emma` from the book-title dropdown limits the character and location dropdowns to characters and locations associated with `Emma`.

When the search is submitted, the API returns paragraph chunks that match the required text query and all selected filters.

# Character and Location Filter Semantics

The metadata associates characters and locations with books.

Character and location filters are applied at the paragraph-chunk level using the selected entity's canonical name and configured aliases.

A returned paragraph chunk must:

- match the required keyword or exact phrase
- belong to the selected book, when a book is selected
- contain the selected character's canonical name or one of its aliases, when a character is selected
- contain the selected location's canonical name or one of its aliases, when a location is selected

Dropdown selections alone never return search results.
