# Jane Austen Database v1 Requirements

## Goal

Build a structured, searchable Jane Austen database with an Express.js API.

The database must support two primary application functions:

1. An eReader for reading books and chapters in source order.
2. A search and filter interface for locating matching sentence chunks by keyword or exact phrase, with optional book, character, and location filters.

Search results must include enough book, chapter, paragraph, and sentence
information to open the matching sentence in the eReader.

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
lady-susan/
love-and-freindship/
mansfield-park/
northanger-abbey/
persuasion/
pride-and-prejudice/
sense-and-sensibility/
the-letters-of-jane-austen/

```

The importer reads the local filesystem.

It does **not** read GitHub.

---

# Import Configuration

The importer reads an explicit list of approved book directories.

Example:

```js
export const bookDirectories = ["emma", "lady-susan", "love-and-freindship"];
```

---

# Import Process

Every importer run:

1. Reads the approved metadata-directory configuration.
2. Traverses every approved directory.
3. Reads and validates every plain text and JSON metadata file in those directories.
4. Parses metadata and sentence chunks.
5. Rebuilds the SQLite metadata and FTS data.
6. Commits the replacement only after the complete import succeeds.

No incremental updates in v1.

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
- book sentence chunks

The relative file path is derived automatically from the folder structure.

Example:

```
metadata/emma/emma.txt
metadata/emma/emma.metadata.json
```

No additional metadata field is required.

---

# Search

SQLite FTS5

Supports:

- keyword search
- exact phrase search

No AI.

No embeddings.

No vector database.

---

# Filters

Current planned filters:

- Open keyword search
- Character dropdown
- Location/Place dropdown
- Book title dropdown

If a user selects "Emma" from the Book title dropdown, the Character dropdown and the Location dropdown should update to reflect only characters and locations from "Emma".

---

# Frontend Responsibilities

- Search form
- Filters
- Results table
- Client-side sorting

---

# Backend Responsibilities

- Traverse metadata directory
- Import plain text and JSON
- Parse plain text and JSON
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

One API search result represents one matching book sentence chunk.

If multiple chunks from the same book match the query, the API returns multiple results. Each result includes the parent book metadata, the matching chunk sentence, chapter and book path.

The frontend may later group, collapse, or deduplicate results by book, but the API preserves chunk-level matches.

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

---

# Search Execution

A keyword or exact phrase is required to execute a search.

Selecting or changing a dropdown filter does not return sentence results by
itself.

Dropdown filters may update the available options in other dropdowns. For
example, selecting `Emma` from the book-title dropdown limits the character and
location dropdowns to characters and locations associated with `Emma`.

When the search is submitted, the API returns sentence chunks that match the
required text query and all selected filters.

# Character and Location Filter Semantics

The metadata associates characters and locations with books.

Character and location filters are applied at the sentence-chunk level using
the selected entity's canonical name and configured aliases.

A returned sentence chunk must:

- match the required keyword or exact phrase
- belong to the selected book, when a book is selected
- contain the selected character's canonical name or one of its aliases, when a
  character is selected
- contain the selected location's canonical name or one of its aliases, when a
  location is selected

Dropdown selections alone never return search results.
