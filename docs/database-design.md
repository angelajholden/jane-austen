# Jane Austen Database: SQLite Design

## 1. Design goals

This design supports the six approved v1 books only: Emma, Mansfield Park, Northanger Abbey, Persuasion, Pride and Prejudice, and Sense and Sensibility.

It provides:

- deterministic one-based reading order from book through chapter and paragraph;
- stable public identifiers independent of SQLite row allocation;
- one canonical paragraph row per searchable chunk;
- SQLite FTS5 keyword and exact-phrase search;
- optional book, character, and location filters without paragraph-level entity tagging;
- book-scoped canonical names and aliases from the approved metadata;
- paragraph-level addressing suitable for both search results and the eReader;
- atomic full rebuilds with foreign-key integrity and synchronized FTS content.

The schema stores the canonical raw text on `books` because the requirements explicitly require book text. Reader rendering and search use normalized paragraph rows; the raw text remains available for provenance and validation.

The canonical source-analysis document is `docs/book-format-analysis.md`.

The six approved metadata files contain integer `publicationYear` values and use the top-level field `locations`.

Sentence counts may remain stored as source metadata for provenance and reference, but sentences are not first-class relational or searchable entities in v1.

---

## 2. Entity relationship overview

```text
books 1 ──< chapters 1 ──< paragraphs
  │                         │
  │                         └── external-content paragraphs_fts
  │
  ├──< characters 1 ──< character_aliases
  └──< locations  1 ──< location_aliases
```

Characters and locations are intentionally book-scoped.

The approved metadata does not define global identity, and source IDs repeat across books. A non-null `book_id` is therefore the book-character or book-location relationship.

A many-to-many junction would imply unsupported cross-book identity and is not used in v1.

---

## 3. Table-by-table design

### `books`

One row per approved book.

It stores:

- source string ID;
- slug;
- display metadata;
- publication year;
- Gutenberg ID;
- derived repository-relative text path;
- exact canonical source-file text;
- validated metadata counts;
- optional notes.

`source_text` is provenance content, not FTS content.

Gutenberg boilerplate, illustrations, decorative material, and other excluded source content must not become searchable merely because they remain present in the canonical raw source text.

Only normalized retained prose in `paragraphs.text` is indexed.

### `chapters`

One row per chapter detected by the approved heading audit.

Each row stores:

- metadata chapter source ID;
- globally unique stable ID;
- one-based book ordinal;
- display title;
- approved metadata counts.

Chapter headings are metadata, not reader prose.

They live in `chapters.title` and do not create paragraph rows. This prevents chapter headings from appearing as paragraph search hits while still allowing the eReader to render them.

### `paragraphs`

One row per retained logical prose paragraph.

A paragraph is the canonical searchable chunk in v1.

Each row stores:

- parent book;
- parent chapter;
- globally unique stable ID;
- one-based ordinal within the chapter;
- one-based ordinal within the book;
- normalized paragraph text.

Paragraph text is produced from the canonical source by joining hard-wrapped physical lines that belong to the same logical paragraph.

Physical source lines are not database chunks.

Blank-line paragraph boundaries determine logical prose structure, subject to the approved source-cleanup rules.

Illustration, decorative, and other excluded non-prose blocks do not create paragraph rows. Removing such blocks must preserve structural paragraph separation so prose before and after an excluded block is never incorrectly joined.

Paragraph rows serve both primary application functions:

1. ordered eReader rendering;
2. FTS-backed search results.

The frontend may display an entire matching paragraph or derive a shorter excerpt around the matching keyword or exact phrase. That presentation decision does not change the canonical paragraph-level search granularity.

### `characters`

One row per book-scoped character metadata entry.

`source_id` is unique only within a book.

`canonical_name` and optional notes preserve approved metadata.

The direct `book_id` foreign key is the v1 book-character association.

### `character_aliases`

One row per alias attached to a character.

Exact duplicates are prohibited per character, but aliases are not necessarily unique across a book.

Explicit `ambiguousAliases` are stored with `is_ambiguous = 1` and their notes.

V1 character filtering excludes explicitly ambiguous alias rows.

Ordinary aliases remain available for filter expansion unless later product decisions change collision handling.

### `locations`

One row per book-scoped location metadata entry.

It stores:

- source ID;
- canonical name;
- free-form source `type` as `location_type`;
- optional notes.

The type is intentionally not constrained to an invented enumeration.

### `location_aliases`

One row per location alias.

It parallels character aliases and supports an ambiguity flag even though the six approved files do not currently provide explicit ambiguous location aliases.

### `paragraphs_fts`

An FTS5 external-content virtual table indexing only `paragraphs.text`.

Its rowid is the canonical `paragraphs.id`, so every FTS hit joins directly back to one paragraph and its book/chapter hierarchy.

Insert, delete, and text-update triggers keep the index synchronized.

---

## 4. Primary keys and stable identifiers

All ordinary tables use SQLite `INTEGER PRIMARY KEY` values for compact foreign keys, efficient joins, and direct FTS rowid integration.

Source string IDs remain alternate keys rather than physical primary keys.

Public stable identifiers use deterministic strings:

| Entity    | Proposed stable identifier                     |
| --------- | ---------------------------------------------- |
| Book      | Metadata `id`, stored as `books.source_id`     |
| Chapter   | `<book-source-id>:chapter:<chapter-source-id>` |
| Paragraph | `<book-source-id>:paragraph:<ordinal-in-book>` |

Examples:

```text
emma
emma:chapter:chapter-1
emma:paragraph:1
```

The importer must construct and validate these values.

The schema does not parse string components.

These identifiers are stable across a rebuild of the same normalized source.

Paragraph IDs after an insertion or deletion earlier in a book will shift. The approved sources provide no immutable paragraph source IDs or offsets, so stronger cross-edition stability cannot be guaranteed without inventing data.

---

## 5. Foreign keys and delete behavior

Every child foreign key uses `ON DELETE CASCADE`:

- deleting a book deletes its chapters, paragraphs, characters, locations, and aliases;
- deleting a chapter deletes its paragraphs;
- deleting a character deletes its aliases;
- deleting a location deletes its aliases.

Foreign keys must enforce hierarchy consistency.

A paragraph cannot claim a chapter belonging to another book.

Deleting paragraphs must also invoke the FTS delete trigger so orphaned index entries cannot remain.

Every database connection must enable:

```sql
PRAGMA foreign_keys = ON;
```

The schema file may enable it for the connection applying the schema, but SQLite requires the setting per connection.

---

## 6. Ordinal and reading-order strategy

All content ordinals are one-based:

- chapters: `ordinal` within book;
- paragraphs: `ordinal_in_chapter` and `ordinal_in_book`.

Uniqueness constraints prevent two sibling rows from occupying the same reading position.

Import validation must additionally require contiguous sequences beginning at one, because SQL `CHECK` and `UNIQUE` constraints cannot prohibit gaps across multiple rows.

Reader order is never inferred from internal integer primary keys.

It is always expressed with content ordinals.

A paragraph's stable ID and ordinals provide the canonical address needed for search-result resolution and eReader navigation.

---

## 7. FTS5 design

`paragraphs_fts` uses external-content mode:

```sql
CREATE VIRTUAL TABLE paragraphs_fts USING fts5(
    text,
    content = 'paragraphs',
    content_rowid = 'id',
    tokenize = 'unicode61 remove_diacritics 0'
);
```

External-content mode is preferred because `paragraphs` remains the canonical relational row while FTS stores its search index without becoming a second authoritative text source.

The shared integer rowid provides a direct join from an FTS result to its paragraph.

The `unicode61` tokenizer provides Unicode-aware tokenization and case-insensitive token matching.

`remove_diacritics 0` preserves distinctions instead of silently rewriting source orthography.

No stemming, embeddings, vectors, or AI search are used.

The API/query layer must never pass unrestricted user text directly as raw FTS grammar.

It should construct an FTS expression from validated input:

- keyword search: combine escaped keyword tokens using the approved AND/OR policy;
- exact phrase search: safely quote the complete phrase;
- character filtering: add a group containing the selected character's canonical name and approved aliases;
- location filtering: add a group containing the selected location's canonical name and approved aliases.

For example, an exact phrase plus character filter may conceptually become:

```text
"not handsome enough" AND ("Fitzwilliam Darcy" OR "Mr. Darcy" OR "Darcy")
```

The FTS triggers cover normal data changes.

After any bulk load that bypasses triggers, the importer must rebuild or otherwise synchronize the FTS index as required and verify index/content agreement before publishing the database.

---

## 8. Character and location filter strategy

Filters do not create paragraph-entity junction tables.

This follows the requirement not to invent automatic entity tagging.

For a selected character:

1. Verify the character belongs to the selected book, if a book filter is present.
2. Load `characters.canonical_name` and eligible `character_aliases.alias` values.
3. Convert each value into the approved FTS phrase representation.
4. Join the alternatives with `OR`.
5. Combine that group with the required keyword or exact-phrase expression using `AND`.

Location filtering follows the same process using `locations` and `location_aliases`.

If both character and location filters are selected, both phrase groups are required.

Selecting filters without a required keyword or exact phrase must not execute a paragraph search.

Entity terms are evaluated against the complete paragraph at query time.

This does not claim that an occurrence is semantically the selected entity. It only establishes that the selected canonical name or an approved alias appears in the same paragraph that satisfies the required search query.

Explicitly ambiguous character aliases are retained for auditability but excluded from v1 filter expansion.

Canonical names are always included.

---

## 9. Index strategy

Primary keys and `UNIQUE` constraints should provide indexes for:

- book source ID, slug, Gutenberg ID, and relative path;
- chapter source ID and ordinal within book;
- paragraph ordinals within chapter and book;
- paragraph stable IDs;
- aliases within their parent entity.

Additional B-tree indexes support display and lookup paths:

- `books(title)` for the book dropdown;
- `chapters(book_id, title)` for title lookup within a book;
- `characters(book_id, canonical_name)` for character dropdowns;
- `locations(book_id, canonical_name)` for location dropdowns;
- alias-text indexes where useful for validation or direct alias administration.

FTS5 supplies the text-search index.

No B-tree index on `paragraphs.text` is required for full-text search.

---

## 10. Example eReader queries

These examples describe the intended relational access patterns. Exact API response shape remains a later API-contract decision.

### Retrieve all books

```sql
SELECT
    source_id,
    slug,
    title,
    publication_year,
    author,
    gutenberg_id,
    relative_text_path,
    chapter_count,
    paragraph_count,
    sentence_count
FROM books
ORDER BY title;
```

Sentence count may remain exposed as source metadata even though sentences are not relational reader/search entities.

### Retrieve one book and its chapter list

```sql
SELECT
    b.source_id AS book_id,
    b.title AS book_title,
    c.stable_id AS chapter_id,
    c.source_id AS chapter_source_id,
    c.ordinal AS chapter_ordinal,
    c.title AS chapter_title,
    c.paragraph_count,
    c.sentence_count
FROM books AS b
JOIN chapters AS c ON c.book_id = b.id
WHERE b.source_id = :book_source_id
ORDER BY c.ordinal;
```

### Retrieve a chapter in reading order

```sql
SELECT
    c.stable_id AS chapter_id,
    c.title AS chapter_title,
    p.stable_id AS paragraph_id,
    p.ordinal_in_chapter AS paragraph_ordinal_in_chapter,
    p.ordinal_in_book AS paragraph_ordinal_in_book,
    p.text
FROM chapters AS c
JOIN paragraphs AS p ON p.chapter_id = c.id
WHERE c.stable_id = :chapter_stable_id
ORDER BY p.ordinal_in_chapter;
```

The eReader can render each returned paragraph as its own prose element and use `paragraph_id` as the stable application-level address.

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

---

## 11. Example search queries

The application first resolves selected entity terms.

For example:

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

The application safely converts those terms and the required user query into an FTS expression.

A paragraph-level search then conceptually follows this shape:

```sql
SELECT
    p.stable_id AS paragraph_id,
    p.text AS paragraph_text,
    p.ordinal_in_chapter AS paragraph_ordinal_in_chapter,
    p.ordinal_in_book AS paragraph_ordinal_in_book,
    c.stable_id AS chapter_id,
    c.ordinal AS chapter_ordinal,
    c.title AS chapter_title,
    b.source_id AS book_id,
    b.title AS book_title,
    b.relative_text_path,
    bm25(paragraphs_fts) AS rank
FROM paragraphs_fts
JOIN paragraphs AS p ON p.id = paragraphs_fts.rowid
JOIN chapters AS c ON c.id = p.chapter_id
JOIN books AS b ON b.id = p.book_id
WHERE paragraphs_fts MATCH :fts_expression
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
ORDER BY rank, b.title, p.ordinal_in_book;
```

The `EXISTS` clauses enforce entity/book membership.

The corresponding canonical-name and alias requirements are already represented in the safely constructed FTS expression.

Every result represents one canonical paragraph with enough hierarchy and path information to resolve it to its position in the eReader.

The frontend is responsible for highlighting the matching keyword or exact phrase within the returned paragraph text.

The frontend may display the entire paragraph or derive a shorter excerpt around the match.

---

## 12. Import and atomic-rebuild considerations

V1 performs complete replacement, not incremental import.

The preferred publication pattern is:

1. validate all canonical inputs;
2. build a new staging SQLite file;
3. apply the approved schema;
4. import all six approved books;
5. validate relational content and counts;
6. populate and validate FTS;
7. run foreign-key and SQLite integrity checks;
8. close the staged database;
9. atomically replace the generated live database only after every required validation succeeds.

The staging-file approach minimizes live lock duration and guarantees that a process crash during parsing cannot expose partial rows.

The importer must:

- enable foreign keys on every connection;
- import parent rows before child rows;
- rely on cascade behavior rather than disabling referential integrity;
- validate contiguous chapter and paragraph ordinals;
- validate chapter detection against approved metadata;
- validate retained paragraph counts against approved metadata;
- run `PRAGMA foreign_key_check` before publication;
- run SQLite integrity validation before publication;
- validate FTS index/content synchronization;
- confirm every FTS rowid resolves to one paragraph;
- publish only after all six approved v1 books succeed;
- never load deferred v2 works into the v1 database.

Sentence counts may remain stored as source metadata, but sentence-tokenizer reproduction is not a publication requirement because sentences are no longer relational/searchable chunks.

Stored paragraph counts remain validation targets.

If paragraph parsing disagrees with approved metadata, the importer must report the discrepancy rather than silently altering canonical source data or metadata.

---

## 13. Paragraph parsing contract

Paragraph parsing is structural rather than linguistic.

A searchable paragraph chunk is one logical prose paragraph.

The importer must:

- parse only content inside the approved book body boundaries;
- exclude chapter-heading lines from paragraph content;
- treat one or more blank or whitespace-only lines as paragraph separators;
- join hard-wrapped physical lines within one logical paragraph;
- preserve original Unicode punctuation, capitalization, spelling, and meaningful characters;
- exclude illustration and decorative blocks from retained prose;
- preserve paragraph separation across excluded blocks;
- never join prose before an excluded illustration/decorative block with prose after that block;
- never split paragraphs based on sentence punctuation.

Illustration handling must support both standalone and multiline source forms encountered in the approved corpus, including forms conceptually like:

```text
[Illustration]
```

and:

```text
[Illustration:

caption or decorative content

[Copyright ...]]
```

and terminal decorative blocks such as:

```text
[Illustration:

THE
END
]
```

Excluded illustration/decorative content must not:

- create paragraph rows;
- enter `paragraphs.text`;
- enter `paragraphs_fts`;
- appear as search results.

The two known Pride and Prejudice paragraph-count discrepancies discovered during the sentence-based importer audit are expected to be resolved by correct illustration/decorative-block handling:

- Chapter XXVIII contains an illustration block between prose paragraphs. Excluding the block must not merge the prose on either side.
- Chapter LXI contains a terminal `THE END` illustration block. It must not create an additional paragraph.

These cases should become explicit parser fixtures/tests.

---

## 14. Validation strategy

A successful v1 database rebuild must verify at minimum:

- exactly six configured books are imported;
- each configured book appears exactly once;
- all expected chapters are imported;
- chapter ordinals are contiguous and one-based;
- paragraph ordinals within chapters are contiguous and one-based;
- paragraph ordinals within books are contiguous and one-based;
- paragraph stable IDs are unique;
- no retained paragraph has empty text;
- no paragraph belongs to the wrong book/chapter hierarchy;
- paragraph counts agree with approved metadata after the approved illustration/decorative rules are applied;
- characters, character aliases, locations, and location aliases are imported according to metadata;
- foreign-key validation passes;
- SQLite integrity validation passes;
- FTS synchronization validation passes;
- every retained paragraph has the expected FTS representation;
- excluded non-prose material is not searchable.

Historical sentence counts are not used to determine importer success.

They may remain stored as metadata values for provenance/reference.

---

## 15. Unresolved decisions

The following decisions may remain open without blocking the paragraph-based database importer:

1. **Alias collision semantics:** explicitly marked `ambiguousAliases` are excluded from filter expansion. Several ordinary approved aliases and canonical-name/alias pairs may also collide within a book. Confirm later whether ordinary collisions remain searchable or should be suppressed.

2. **Match semantics:** FTS token phrases are case-insensitive token sequences, not byte-for-byte substrings. Confirm later whether punctuation-sensitive or case-sensitive literal containment is required for entity filters or exact-phrase behavior.

3. **Keyword policy:** decide whether multi-token keyword input means all tokens (`AND`) or any token (`OR`). Exact-phrase behavior is defined separately.

4. **Cross-edition stability:** ordinal-derived paragraph stable IDs are deterministic for the current normalized source but change if paragraphs are inserted or removed earlier in a book. Stronger persistence would require approved immutable source anchors.

5. **Search-result presentation:** the API returns the canonical matching paragraph. The frontend may later decide whether results display the complete paragraph or a context excerpt around the match.

These decisions do not require sentence-level storage and do not block implementation of the paragraph-based v1 schema and importer.

---

## 16. Final v1 model

The canonical v1 content hierarchy is:

```text
Book
  └── Chapter
        └── Paragraph
```

A paragraph is simultaneously:

- the normalized prose unit used by the eReader;
- the canonical searchable chunk;
- the FTS content row;
- the search-result granularity;
- the stable target used to resolve a result back into the reader.

Sentence boundaries are not part of the v1 relational model.

This intentionally keeps the database aligned with observable source structure rather than requiring linguistic sentence-boundary inference.
