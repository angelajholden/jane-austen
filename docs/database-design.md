# Jane Austen Database: SQLite Design

## 1. Design goals

This design supports the six approved v1 books only: Emma, Mansfield Park, Northanger Abbey, Persuasion, Pride and Prejudice, and Sense and Sensibility. It provides:

- deterministic one-based reading order from book through chapter, paragraph, and sentence;
- stable public identifiers independent of SQLite row allocation;
- one canonical sentence row per search result;
- SQLite FTS5 keyword and exact-phrase search;
- optional book, character, and location filters without sentence-level entity tagging;
- book-scoped canonical names and aliases from the approved metadata;
- atomic full rebuilds with foreign-key integrity and synchronized FTS content.

The schema stores the canonical raw text on `books` because the requirements explicitly require book text. Reader rendering and search use normalized child rows; the raw text remains available for provenance and validation.

The required source-analysis path, `docs/book-format-analysis.md`, did not exist during design. The prior deliverable was read from `jobs/output/book-format-analysis.md`, its user-directed location. The six current metadata files supersede two stale observations in that analysis: they now contain integer `publicationYear` values and use the top-level field `locations`.

## 2. Entity relationship overview

```text
books 1 ──< chapters 1 ──< paragraphs 1 ──< sentences
  │                                      │
  │                                      └── external-content sentences_fts
  │
  ├──< characters 1 ──< character_aliases
  └──< locations  1 ──< location_aliases
```

Characters and locations are intentionally book-scoped. The approved metadata does not define global identity, and source IDs repeat across books: for example, `mr-morris` is used by two different fictional characters, while location IDs such as `london` recur in several books. A non-null `book_id` is therefore the book-character or book-location relationship. A many-to-many junction would imply unsupported cross-book identity and is not used in v1.

## 3. Table-by-table design

### `books`

One row per approved book. It stores the source string ID and slug, display metadata, publication year, Gutenberg ID, derived repository-relative text path, exact canonical source-file text, validated metadata counts, and optional notes.

`source_text` is provenance content, not FTS content. Gutenberg boilerplate in that raw file must not become searchable; only parsed `sentences.text` is indexed.

### `chapters`

One row per chapter detected by the approved heading audit. The audit reports all six books passing with exactly the metadata chapter count. Each row stores the metadata chapter source ID, a globally unique stable ID, one-based book ordinal, display title, and validated paragraph/sentence counts.

Chapter headings are metadata, not reader prose. They live in `chapters.title` and do not create paragraph or sentence rows. This prevents headings from appearing as search hits while still allowing the reader to render them.

### `paragraphs`

One row per retained prose paragraph. It groups sentences and stores one-based ordinals within its chapter and book. Paragraph text is not duplicated: the ordered sentence rows are the normalized paragraph content. This avoids a second copy that could disagree with the sentence source used by search.

### `sentences`

One row per canonical sentence chunk. It stores one-based ordinals within its paragraph, chapter, and book, plus the normalized sentence text. The redundant higher-scope ordinals are deliberate: they make reader addressing, result payloads, validation, and ordered retrieval efficient. Composite foreign keys ensure the recorded book, chapter, and paragraph belong to the same hierarchy.

### `characters`

One row per book-scoped character metadata entry. `source_id` is unique only within a book. `canonical_name` and optional notes preserve approved metadata. The direct `book_id` foreign key is the v1 book-character association.

### `character_aliases`

One row per alias attached to a character. Exact duplicates are prohibited per character, but aliases are not unique across a book: approved metadata contains collisions such as `Miss Bertram`, `Miss Musgrove`, and `Miss Steele`.

Explicit `ambiguousAliases` are stored with `is_ambiguous = 1` and their notes. V1 character filtering excludes those rows. Ordinary aliases remain searchable even when the same text is assigned to another character, because the source metadata presents them as approved `aliases`; this behavior is called out under unresolved decisions.

### `locations`

One row per book-scoped location metadata entry. It stores the source ID, canonical name, free-form source `type` as `location_type`, and optional notes. The type is intentionally not constrained to an invented enumeration.

### `location_aliases`

One row per location alias. It parallels character aliases and supports an ambiguity flag even though the six approved files do not currently provide explicit ambiguous location aliases.

### `sentences_fts`

An FTS5 external-content virtual table indexing only `sentences.text`. Its rowid is the canonical `sentences.id`, so every hit joins directly back to one sentence and its hierarchy. Insert, delete, and text-update triggers keep the index synchronized.

## 4. Primary keys and stable identifiers

All ordinary tables use SQLite `INTEGER PRIMARY KEY` values for compact foreign keys, efficient joins, and direct FTS rowid integration. Source string IDs remain alternate keys rather than physical primary keys.

Public stable identifiers use deterministic strings:

| Entity    | Proposed stable identifier                     |
| --------- | ---------------------------------------------- |
| Book      | Metadata `id`, stored as `books.source_id`     |
| Chapter   | `<book-source-id>:chapter:<chapter-source-id>` |
| Paragraph | `<book-source-id>:paragraph:<ordinal-in-book>` |
| Sentence  | `<book-source-id>:sentence:<ordinal-in-book>`  |

Examples are `emma:chapter:chapter-1`, `emma:paragraph:1`, and `emma:sentence:1`. The importer must construct and validate these values; the schema does not parse string components.

These identifiers are stable across a rebuild of the same normalized source. Paragraph and sentence IDs after an insertion or deletion earlier in a book will shift. The approved sources provide no immutable source offsets or sentence IDs, so stronger cross-edition stability cannot be guaranteed without inventing data.

## 5. Foreign keys and delete behavior

Every child foreign key uses `ON DELETE CASCADE`:

- deleting a book deletes its chapters, paragraphs, sentences, characters, locations, and aliases;
- deleting a chapter deletes its paragraphs and sentences;
- deleting a paragraph deletes its sentences;
- deleting a character or location deletes its aliases.

Composite foreign keys enforce hierarchy consistency. A sentence cannot claim a paragraph from one chapter and a chapter or book from another. Deleting sentences also invokes the FTS delete trigger, preventing orphaned index entries.

Every database connection must enable `PRAGMA foreign_keys = ON`; the schema file does so for the connection applying it, but SQLite requires the setting per connection.

## 6. Ordinal and reading-order strategy

All content ordinals are one-based, as required by Prompt 2:

- chapters: `ordinal` within book;
- paragraphs: `ordinal_in_chapter` and `ordinal_in_book`;
- sentences: `ordinal_in_paragraph`, `ordinal_in_chapter`, and `ordinal_in_book`.

Uniqueness constraints prevent two sibling rows from occupying the same reading position. Import validation must additionally require contiguous sequences beginning at one, because SQL `CHECK` and `UNIQUE` constraints cannot prohibit gaps across rows.

Reader order is never inferred from internal integer primary keys. It is always expressed with content ordinals.

## 7. FTS5 design

`sentences_fts` uses external-content mode:

```sql
CREATE VIRTUAL TABLE sentences_fts USING fts5(
    text,
    content = 'sentences',
    content_rowid = 'id',
    tokenize = 'unicode61 remove_diacritics 0'
);
```

External-content mode is preferred because `sentences` remains the canonical relational row, while FTS stores its search index without requiring a second authoritative text API. The shared integer rowid gives a direct, stable join.

The `unicode61` tokenizer provides Unicode-aware tokenization and case-insensitive token matching. `remove_diacritics 0` preserves distinctions instead of silently rewriting source orthography. No stemming, embeddings, vectors, or AI search are used.

The API/query layer must never pass unrestricted user text as raw FTS grammar. It should construct an FTS expression from validated tokens:

- keyword search: combine escaped keyword tokens using the approved AND/OR policy;
- exact phrase search: double any embedded quote characters, then wrap the entire phrase in FTS double quotes;
- character/location filtering: add an `AND` group containing quoted canonical-name and approved-alias phrases joined by `OR`.

For example, an exact phrase plus character filter can become:

```text
"not handsome enough" AND ("Fitzwilliam Darcy" OR "Mr. Darcy" OR "Darcy")
```

The FTS triggers cover normal data changes. After any bulk load that bypasses triggers, the importer must issue the FTS5 `rebuild` maintenance command and verify index/content agreement before publishing the database. That command belongs in the future importer, not in this schema-only deliverable.

## 8. Character and location filter strategy

Filters do not create sentence-entity junction tables. This follows the instruction not to invent sentence-level tagging.

For a selected character:

1. Verify the character belongs to the selected book, if a book filter is present.
2. Load `characters.canonical_name` and `character_aliases.alias` rows where `is_ambiguous = 0`.
3. Quote each value as an FTS phrase and join the alternatives with `OR`.
4. Combine that group with the required keyword/exact-phrase expression using `AND`.

Location filtering follows the same process with `locations` and `location_aliases`. If both filters are selected, both phrase groups are required. Selecting filters without a required text query must not execute a sentence search.

This evaluates names against each sentence at query time. It does not claim that an occurrence is semantically the selected entity. A shared approved alias can therefore match more than one dropdown entity, consistent with the source's unresolved ambiguity.

Explicitly ambiguous character aliases such as Pride and Prejudice's `Miss Bennet` are retained for auditability but excluded from v1 filter expansion. Canonical names are always included.

## 9. Index strategy

Primary keys and `UNIQUE` constraints already create indexes for:

- book source ID, slug, Gutenberg ID, and relative path;
- chapter source ID and ordinal within book;
- paragraph ordinals within chapter and book;
- sentence ordinals within paragraph, chapter, and book;
- stable IDs;
- aliases within their parent entity.

Additional B-tree indexes support display and lookup paths:

- `books(title)` for the book dropdown;
- `chapters(book_id, title)` for title lookup within a book;
- `characters(book_id, canonical_name)` and `locations(book_id, canonical_name)` for filtered dropdowns;
- alias-text indexes for validation or direct alias administration.

FTS5 supplies the text-search index. No B-tree index on `sentences.text` is useful for full-text search.

## 10. Example eReader queries

### Retrieve all books

```sql
SELECT source_id, slug, title, publication_year, author, gutenberg_id,
       relative_text_path, chapter_count, paragraph_count, sentence_count
FROM books
ORDER BY title;
```

### Retrieve one book and its chapter list

```sql
SELECT b.source_id AS book_id, b.title AS book_title,
       c.stable_id AS chapter_id, c.source_id AS chapter_source_id,
       c.ordinal AS chapter_ordinal, c.title AS chapter_title,
       c.paragraph_count, c.sentence_count
FROM books AS b
JOIN chapters AS c ON c.book_id = b.id
WHERE b.source_id = :book_source_id
ORDER BY c.ordinal;
```

### Retrieve a chapter in reading order

```sql
SELECT c.stable_id AS chapter_id, c.title AS chapter_title,
       p.stable_id AS paragraph_id, p.ordinal_in_chapter AS paragraph_ordinal,
       s.stable_id AS sentence_id,
       s.ordinal_in_paragraph,
       s.ordinal_in_chapter,
       s.ordinal_in_book,
       s.text
FROM chapters AS c
JOIN paragraphs AS p ON p.chapter_id = c.id
JOIN sentences AS s ON s.paragraph_id = p.id
WHERE c.stable_id = :chapter_stable_id
ORDER BY p.ordinal_in_chapter, s.ordinal_in_paragraph;
```

### Retrieve character and location dropdowns for one book

```sql
SELECT id, source_id, canonical_name
FROM characters
WHERE book_id = :book_id
ORDER BY canonical_name;

SELECT id, source_id, canonical_name, location_type
FROM locations
WHERE book_id = :book_id
ORDER BY canonical_name;
```

## 11. Example search queries

The application first resolves selected entity terms. For example:

```sql
SELECT canonical_name AS term
FROM characters
WHERE id = :character_id

UNION ALL

SELECT ca.alias AS term
FROM character_aliases AS ca
WHERE ca.character_id = :character_id
  AND ca.is_ambiguous = 0;
```

It safely converts those terms and the required user query into `:fts_expression`, then executes one sentence-level query:

```sql
SELECT
    s.stable_id AS sentence_id,
    s.text AS sentence_text,
    s.ordinal_in_paragraph,
    s.ordinal_in_chapter,
    s.ordinal_in_book,
    p.stable_id AS paragraph_id,
    p.ordinal_in_chapter AS paragraph_ordinal_in_chapter,
    p.ordinal_in_book AS paragraph_ordinal_in_book,
    c.stable_id AS chapter_id,
    c.ordinal AS chapter_ordinal,
    c.title AS chapter_title,
    b.source_id AS book_id,
    b.title AS book_title,
    b.relative_text_path,
    bm25(sentences_fts) AS rank
FROM sentences_fts
JOIN sentences AS s ON s.id = sentences_fts.rowid
JOIN paragraphs AS p ON p.id = s.paragraph_id
JOIN chapters AS c ON c.id = s.chapter_id
JOIN books AS b ON b.id = s.book_id
WHERE sentences_fts MATCH :fts_expression
  AND (:book_id IS NULL OR b.id = :book_id)
  AND (
      :character_id IS NULL
      OR EXISTS (
          SELECT 1
          FROM characters AS selected_character
          WHERE selected_character.id = :character_id
            AND selected_character.book_id = b.id
      )
  )
  AND (
      :location_id IS NULL
      OR EXISTS (
          SELECT 1
          FROM locations AS selected_location
          WHERE selected_location.id = :location_id
            AND selected_location.book_id = b.id
      )
  )
ORDER BY rank, b.title, s.ordinal_in_book;
```

The `EXISTS` clauses enforce entity/book membership; the corresponding name-or-alias requirements are already present in the safely constructed FTS expression. Every result is one canonical sentence row with enough hierarchy and path data to open it in the reader.

## 12. Import and atomic-rebuild considerations

V1 performs complete replacement, not incremental import. Two safe publication patterns are supported:

1. Build and fully validate a new SQLite file, close it, then atomically replace the live file on the same filesystem.
2. Rebuild inside one `BEGIN IMMEDIATE` transaction in the live file and commit only after all relational, count, foreign-key, and FTS checks pass.

The staging-file approach minimizes live lock duration and guarantees that a process crash during parsing cannot expose partial rows. Whichever approach is chosen:

- enable foreign keys on every connection;
- import parent rows before children;
- rely on cascade deletes rather than disabling referential integrity;
- validate contiguous ordinals and stored counts against actual child rows;
- run `PRAGMA foreign_key_check` before publication;
- run FTS5 integrity/rebuild checks as appropriate and confirm every FTS rowid resolves to a sentence;
- publish only after all six approved v1 books succeed;
- never load the three deferred v2 works into this database build.

Stored book and chapter counts are validated metadata caches; normalized child rows are the countable relational facts. The importer must compare both. The database intentionally stores counts for fast metadata responses but must never silently accept disagreement.

## 13. Unresolved decisions

1. **Canonical analysis location:** Prompt 2 names `docs/book-format-analysis.md`, but the available prior deliverable is `jobs/output/book-format-analysis.md`. The project should either move/approve that document or update this prompt's path.
2. **Parser contract:** body boundaries, heading mapping details, paragraph line joining, and exact sentence tokenization remain importer decisions identified by the source analysis. The chapter audit resolves heading counts for v1 but not every normalization rule.
3. **Alias collision semantics:** explicitly marked `ambiguousAliases` are excluded here. Several ordinary approved aliases and some canonical-name/alias pairs also collide within a book. The design treats ordinary `aliases` as approved and searchable, but product owners should confirm whether collision detection should instead suppress them.
4. **Match semantics:** FTS token phrases are case-insensitive token sequences, not byte-for-byte substrings. Confirm whether punctuation-sensitive or case-sensitive literal containment is required for entity filters.
5. **Keyword policy:** decide whether multi-token keyword input means all tokens (`AND`) or any token (`OR`). Exact-phrase behavior is already defined by FTS quoting.
6. **Cross-edition stability:** ordinal-derived paragraph and sentence stable IDs are deterministic for one normalized source version but change after earlier content insertion/deletion. Stronger persistence would require approved immutable source anchors.
7. **Raw source normalization:** `books.source_text` is designed to store the exact UTF-8 file contents. Confirm whether preserving CRLF bytes exactly is necessary; SQLite `TEXT` preserves characters, not a separate byte-level encoding contract.
