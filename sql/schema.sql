PRAGMA foreign_keys = ON;

CREATE TABLE books (
    id                 INTEGER PRIMARY KEY,
    source_id          TEXT    NOT NULL UNIQUE
                               CHECK (length(trim(source_id)) > 0),
    slug               TEXT    NOT NULL UNIQUE
                               CHECK (length(trim(slug)) > 0),
    title              TEXT    NOT NULL
                               CHECK (length(trim(title)) > 0),
    publication_year   INTEGER NOT NULL
                               CHECK (publication_year BETWEEN 1000 AND 9999),
    author             TEXT    NOT NULL
                               CHECK (length(trim(author)) > 0),
    gutenberg_id       INTEGER NOT NULL UNIQUE
                               CHECK (gutenberg_id > 0),
    relative_text_path TEXT    NOT NULL UNIQUE
                               CHECK (length(trim(relative_text_path)) > 0),
    source_text        TEXT    NOT NULL
                               CHECK (length(source_text) > 0),
    chapter_count      INTEGER NOT NULL CHECK (chapter_count >= 0),
    paragraph_count    INTEGER NOT NULL CHECK (paragraph_count >= 0),
    sentence_count     INTEGER NOT NULL CHECK (sentence_count >= 0),
    notes              TEXT
);

CREATE TABLE chapters (
    id              INTEGER PRIMARY KEY,
    book_id         INTEGER NOT NULL,
    source_id       TEXT    NOT NULL
                            CHECK (length(trim(source_id)) > 0),
    stable_id       TEXT    NOT NULL UNIQUE
                            CHECK (length(trim(stable_id)) > 0),
    ordinal         INTEGER NOT NULL CHECK (ordinal > 0),
    title           TEXT    NOT NULL
                            CHECK (length(trim(title)) > 0),
    paragraph_count INTEGER NOT NULL CHECK (paragraph_count >= 0),
    sentence_count  INTEGER NOT NULL CHECK (sentence_count >= 0),
    notes           TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE (book_id, source_id),
    UNIQUE (book_id, ordinal),
    UNIQUE (id, book_id)
);

CREATE TABLE paragraphs (
    id                 INTEGER PRIMARY KEY,
    stable_id          TEXT    NOT NULL UNIQUE
                               CHECK (length(trim(stable_id)) > 0),
    book_id            INTEGER NOT NULL,
    chapter_id         INTEGER NOT NULL,
    ordinal_in_chapter INTEGER NOT NULL CHECK (ordinal_in_chapter > 0),
    ordinal_in_book    INTEGER NOT NULL CHECK (ordinal_in_book > 0),
    text               TEXT    NOT NULL
                               CHECK (length(trim(text)) > 0),
    FOREIGN KEY (chapter_id, book_id)
        REFERENCES chapters(id, book_id) ON DELETE CASCADE,
    UNIQUE (chapter_id, ordinal_in_chapter),
    UNIQUE (book_id, ordinal_in_book)
);

CREATE TABLE characters (
    id             INTEGER PRIMARY KEY,
    book_id        INTEGER NOT NULL,
    source_id      TEXT    NOT NULL
                           CHECK (length(trim(source_id)) > 0),
    canonical_name TEXT    NOT NULL
                           CHECK (length(trim(canonical_name)) > 0),
    notes          TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE (book_id, source_id)
);

CREATE TABLE character_aliases (
    id           INTEGER PRIMARY KEY,
    character_id INTEGER NOT NULL,
    alias        TEXT    NOT NULL
                         CHECK (length(trim(alias)) > 0),
    is_ambiguous INTEGER NOT NULL DEFAULT 0
                         CHECK (is_ambiguous IN (0, 1)),
    notes        TEXT,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    UNIQUE (character_id, alias)
);

CREATE TABLE locations (
    id             INTEGER PRIMARY KEY,
    book_id        INTEGER NOT NULL,
    source_id      TEXT    NOT NULL
                           CHECK (length(trim(source_id)) > 0),
    canonical_name TEXT    NOT NULL
                           CHECK (length(trim(canonical_name)) > 0),
    location_type  TEXT    NOT NULL
                           CHECK (length(trim(location_type)) > 0),
    notes          TEXT,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE (book_id, source_id)
);

CREATE TABLE location_aliases (
    id           INTEGER PRIMARY KEY,
    location_id  INTEGER NOT NULL,
    alias        TEXT    NOT NULL
                         CHECK (length(trim(alias)) > 0),
    is_ambiguous INTEGER NOT NULL DEFAULT 0
                         CHECK (is_ambiguous IN (0, 1)),
    notes        TEXT,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    UNIQUE (location_id, alias)
);

CREATE INDEX idx_books_title
    ON books(title);

CREATE INDEX idx_chapters_book_title
    ON chapters(book_id, title);

CREATE INDEX idx_characters_book_name
    ON characters(book_id, canonical_name);

CREATE INDEX idx_character_aliases_alias
    ON character_aliases(alias);

CREATE INDEX idx_locations_book_name
    ON locations(book_id, canonical_name);

CREATE INDEX idx_location_aliases_alias
    ON location_aliases(alias);

CREATE VIRTUAL TABLE paragraphs_fts USING fts5(
    text,
    content = 'paragraphs',
    content_rowid = 'id',
    tokenize = 'unicode61 remove_diacritics 0'
);

CREATE TRIGGER paragraphs_ai
AFTER INSERT ON paragraphs
BEGIN
    INSERT INTO paragraphs_fts(rowid, text)
    VALUES (new.id, new.text);
END;

CREATE TRIGGER paragraphs_ad
AFTER DELETE ON paragraphs
BEGIN
    INSERT INTO paragraphs_fts(paragraphs_fts, rowid, text)
    VALUES ('delete', old.id, old.text);
END;

CREATE TRIGGER paragraphs_au
AFTER UPDATE OF text ON paragraphs
BEGIN
    INSERT INTO paragraphs_fts(paragraphs_fts, rowid, text)
    VALUES ('delete', old.id, old.text);

    INSERT INTO paragraphs_fts(rowid, text)
    VALUES (new.id, new.text);
END;
