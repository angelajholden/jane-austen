function countAliases(records) {
  return records.reduce(
    (total, record) =>
      total + record.aliases.length + (record.ambiguousAliases?.length ?? 0),
    0,
  );
}

export function expectedImportTotals(books) {
  return books.reduce(
    (totals, book) => {
      totals.books += 1;
      totals.chapters += book.metadata.chapterCount;
      totals.paragraphs += book.metadata.paragraphCount;
      totals.characters += book.metadata.characters.length;
      totals.characterAliases += countAliases(book.metadata.characters);
      totals.locations += book.metadata.locations.length;
      totals.locationAliases += countAliases(book.metadata.locations);
      return totals;
    },
    {
      books: 0,
      chapters: 0,
      paragraphs: 0,
      characters: 0,
      characterAliases: 0,
      locations: 0,
      locationAliases: 0,
    },
  );
}

function insertAliases(insertAlias, parentId, record) {
  for (const alias of record.aliases) {
    insertAlias.run(parentId, alias, 0, null);
  }

  for (const ambiguousAlias of record.ambiguousAliases ?? []) {
    insertAlias.run(
      parentId,
      ambiguousAlias.alias,
      1,
      ambiguousAlias.notes ?? null,
    );
  }
}

export function populateDatabase(database, books) {
  const statements = {
    book: database.prepare(
      `INSERT INTO books (
         source_id, slug, title, publication_year, author, gutenberg_id,
         relative_text_path, source_text, chapter_count, paragraph_count,
         sentence_count, notes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ),
    chapter: database.prepare(
      `INSERT INTO chapters (
         book_id, source_id, stable_id, ordinal, title,
         paragraph_count, sentence_count, notes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ),
    paragraph: database.prepare(
      `INSERT INTO paragraphs (
         stable_id, book_id, chapter_id, ordinal_in_chapter, ordinal_in_book, text
       ) VALUES (?, ?, ?, ?, ?, ?)`,
    ),
    character: database.prepare(
      `INSERT INTO characters (book_id, source_id, canonical_name, notes)
       VALUES (?, ?, ?, ?)`,
    ),
    characterAlias: database.prepare(
      `INSERT INTO character_aliases (
         character_id, alias, is_ambiguous, notes
       ) VALUES (?, ?, ?, ?)`,
    ),
    location: database.prepare(
      `INSERT INTO locations (
         book_id, source_id, canonical_name, location_type, notes
       ) VALUES (?, ?, ?, ?, ?)`,
    ),
    locationAlias: database.prepare(
      `INSERT INTO location_aliases (
         location_id, alias, is_ambiguous, notes
       ) VALUES (?, ?, ?, ?)`,
    ),
  };

  const populate = database.transaction(() => {
    for (const book of books) {
      const metadata = book.metadata;
      const bookId = Number(
        statements.book.run(
          metadata.id,
          metadata.slug,
          metadata.title,
          metadata.publicationYear,
          metadata.author,
          metadata.gutenbergId,
          book.relativeTextPath,
          book.rawText,
          metadata.chapterCount,
          metadata.paragraphCount,
          metadata.sentenceCount,
          metadata.notes ?? null,
        ).lastInsertRowid,
      );

      for (const chapter of book.chapters) {
        const chapterId = Number(
          statements.chapter.run(
            bookId,
            chapter.sourceId,
            chapter.stableId,
            chapter.ordinal,
            chapter.title,
            chapter.expectedParagraphCount,
            chapter.expectedSentenceCount,
            null,
          ).lastInsertRowid,
        );

        for (const paragraph of chapter.paragraphs) {
          statements.paragraph.run(
            paragraph.stableId,
            bookId,
            chapterId,
            paragraph.ordinalInChapter,
            paragraph.ordinalInBook,
            paragraph.text,
          );
        }
      }

      for (const character of metadata.characters) {
        const characterId = Number(
          statements.character.run(
            bookId,
            character.id,
            character.name,
            character.notes ?? null,
          ).lastInsertRowid,
        );
        insertAliases(statements.characterAlias, characterId, character);
      }

      for (const location of metadata.locations) {
        const locationId = Number(
          statements.location.run(
            bookId,
            location.id,
            location.name,
            location.type,
            location.notes ?? null,
          ).lastInsertRowid,
        );
        insertAliases(statements.locationAlias, locationId, location);
      }
    }
  });

  populate();
}

function tableCount(database, table) {
  return database.prepare(`SELECT count(*) AS count FROM ${table}`).get().count;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}; found ${actual}`);
  }
}

function validateSequentialRows(database, sql, groupKey, ordinalKey, label) {
  const rows = database.prepare(sql).all();
  const expectedByGroup = new Map();

  for (const row of rows) {
    const expected = (expectedByGroup.get(row[groupKey]) ?? 0) + 1;
    if (row[ordinalKey] !== expected) {
      throw new Error(
        `${label}: group ${row[groupKey]} expected ordinal ${expected}; found ${row[ordinalKey]}`,
      );
    }
    expectedByGroup.set(row[groupKey], expected);
  }
}

function validateStoredCounts(database, books) {
  for (const book of books) {
    const storedBook = database
      .prepare(
        `SELECT id, chapter_count, paragraph_count, sentence_count
         FROM books WHERE source_id = ?`,
      )
      .get(book.slug);

    assertEqual(storedBook.chapter_count, book.metadata.chapterCount, `${book.slug} stored chapter count`);
    assertEqual(storedBook.paragraph_count, book.metadata.paragraphCount, `${book.slug} stored paragraph count`);
    assertEqual(storedBook.sentence_count, book.metadata.sentenceCount, `${book.slug} stored sentence metadata`);

    const actualBookParagraphs = database
      .prepare("SELECT count(*) AS count FROM paragraphs WHERE book_id = ?")
      .get(storedBook.id).count;
    assertEqual(actualBookParagraphs, book.metadata.paragraphCount, `${book.slug} paragraph count`);

    for (const chapter of book.chapters) {
      const storedChapter = database
        .prepare(
          `SELECT id, paragraph_count, sentence_count
           FROM chapters WHERE book_id = ? AND source_id = ?`,
        )
        .get(storedBook.id, chapter.sourceId);
      assertEqual(
        storedChapter.paragraph_count,
        chapter.expectedParagraphCount,
        `${book.slug}/${chapter.sourceId} stored paragraph count`,
      );
      assertEqual(
        storedChapter.sentence_count,
        chapter.expectedSentenceCount,
        `${book.slug}/${chapter.sourceId} stored sentence metadata`,
      );
      const actualChapterParagraphs = database
        .prepare("SELECT count(*) AS count FROM paragraphs WHERE chapter_id = ?")
        .get(storedChapter.id).count;
      assertEqual(
        actualChapterParagraphs,
        chapter.expectedParagraphCount,
        `${book.slug}/${chapter.sourceId} paragraph count`,
      );
    }
  }
}

function validateFts(database, expectedParagraphCount) {
  database
    .prepare("INSERT INTO paragraphs_fts(paragraphs_fts) VALUES ('integrity-check')")
    .run();

  database.exec(
    "CREATE VIRTUAL TABLE temp.importer_paragraphs_vocab USING fts5vocab(main, paragraphs_fts, instance)",
  );
  try {
    const indexedDocuments = database
      .prepare("SELECT count(DISTINCT doc) AS count FROM temp.importer_paragraphs_vocab")
      .get().count;
    assertEqual(indexedDocuments, expectedParagraphCount, "indexed paragraph documents");

    const orphanDocuments = database
      .prepare(
        `SELECT count(DISTINCT vocab.doc) AS count
         FROM temp.importer_paragraphs_vocab AS vocab
         LEFT JOIN paragraphs AS paragraph ON paragraph.id = vocab.doc
         WHERE paragraph.id IS NULL`,
      )
      .get().count;
    assertEqual(orphanDocuments, 0, "orphan FTS documents");
  } finally {
    database.exec("DROP TABLE temp.importer_paragraphs_vocab");
  }

  const representative = database
    .prepare("SELECT id, book_id, chapter_id, text FROM paragraphs ORDER BY id LIMIT 1")
    .get();
  if (!representative && expectedParagraphCount > 0) {
    throw new Error("FTS validation: no representative paragraph exists");
  }

  let representativeMatches = 0;
  if (representative) {
    const token = representative.text.match(/[\p{L}\p{N}]{3,}/u)?.[0];
    if (!token) {
      throw new Error("FTS validation: representative paragraph has no searchable token");
    }
    representativeMatches = database
      .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH ?")
      .get(`\"${token.replaceAll('"', '""')}\"`).count;
    if (representativeMatches < 1) {
      throw new Error(`FTS validation: representative token ${JSON.stringify(token)} was not found`);
    }

    database.exec("SAVEPOINT importer_fts_sync_check");
    try {
      database
        .prepare("UPDATE paragraphs SET text = text || ' importerftsupdateprobe' WHERE id = ?")
        .run(representative.id);
      assertEqual(
        database
          .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'importerftsupdateprobe'")
          .get().count,
        1,
        "FTS update synchronization",
      );

      const nextChapterOrdinal = database
        .prepare("SELECT max(ordinal_in_chapter) + 1 AS ordinal FROM paragraphs WHERE chapter_id = ?")
        .get(representative.chapter_id).ordinal;
      const nextBookOrdinal = database
        .prepare("SELECT max(ordinal_in_book) + 1 AS ordinal FROM paragraphs WHERE book_id = ?")
        .get(representative.book_id).ordinal;
      const probeId = Number(
        database
          .prepare(
            `INSERT INTO paragraphs (
               stable_id, book_id, chapter_id, ordinal_in_chapter, ordinal_in_book, text
             ) VALUES ('__importer_fts_probe__', ?, ?, ?, ?, 'importerftsinsertprobe')`,
          )
          .run(
            representative.book_id,
            representative.chapter_id,
            nextChapterOrdinal,
            nextBookOrdinal,
          ).lastInsertRowid,
      );
      assertEqual(
        database
          .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'importerftsinsertprobe'")
          .get().count,
        1,
        "FTS insert synchronization",
      );
      database.prepare("DELETE FROM paragraphs WHERE id = ?").run(probeId);
      assertEqual(
        database
          .prepare("SELECT count(*) AS count FROM paragraphs_fts WHERE paragraphs_fts MATCH 'importerftsinsertprobe'")
          .get().count,
        0,
        "FTS delete synchronization",
      );
    } finally {
      database.exec("ROLLBACK TO importer_fts_sync_check; RELEASE importer_fts_sync_check");
    }
  }

  return {
    rowCount: tableCount(database, "paragraphs_fts"),
    representativeMatches,
    integrity: "ok",
    synchronization: "ok (insert/delete/update)",
    exclusions: "ok",
  };
}

export function validatePopulatedDatabase(database, books) {
  const expected = expectedImportTotals(books);
  const actual = {
    books: tableCount(database, "books"),
    chapters: tableCount(database, "chapters"),
    paragraphs: tableCount(database, "paragraphs"),
    characters: tableCount(database, "characters"),
    characterAliases: tableCount(database, "character_aliases"),
    locations: tableCount(database, "locations"),
    locationAliases: tableCount(database, "location_aliases"),
  };

  for (const key of Object.keys(expected)) {
    assertEqual(actual[key], expected[key], `${key} count`);
  }

  const bookIds = database
    .prepare("SELECT source_id FROM books ORDER BY source_id")
    .all()
    .map(({ source_id: sourceId }) => sourceId);
  const expectedBookIds = books.map((book) => book.slug).sort();
  if (JSON.stringify(bookIds) !== JSON.stringify(expectedBookIds)) {
    throw new Error("Imported book IDs do not match the configured book set");
  }

  validateStoredCounts(database, books);
  validateSequentialRows(
    database,
    "SELECT book_id, ordinal FROM chapters ORDER BY book_id, ordinal",
    "book_id",
    "ordinal",
    "chapter ordinals",
  );
  validateSequentialRows(
    database,
    `SELECT chapter_id, ordinal_in_chapter
     FROM paragraphs ORDER BY chapter_id, ordinal_in_chapter`,
    "chapter_id",
    "ordinal_in_chapter",
    "paragraph chapter ordinals",
  );
  validateSequentialRows(
    database,
    "SELECT book_id, ordinal_in_book FROM paragraphs ORDER BY book_id, ordinal_in_book",
    "book_id",
    "ordinal_in_book",
    "paragraph book ordinals",
  );

  const orphanParagraphs = database
    .prepare(
      `SELECT count(*) AS count FROM paragraphs AS p
       LEFT JOIN chapters AS c ON c.id = p.chapter_id AND c.book_id = p.book_id
       WHERE c.id IS NULL`,
    )
    .get().count;
  const emptyParagraphs = database
    .prepare("SELECT count(*) AS count FROM paragraphs WHERE length(trim(text)) = 0")
    .get().count;
  const leakedDecorations = database
    .prepare(
      `SELECT count(*) AS count FROM paragraphs
       WHERE text LIKE '[Illustration%'
          OR text LIKE '[Copyright%'
          OR text LIKE '[_Copyright%'
          OR upper(trim(text)) IN ('FINIS', 'FINIS.', 'THE END')`,
    )
    .get().count;

  assertEqual(orphanParagraphs, 0, "orphan paragraphs");
  assertEqual(emptyParagraphs, 0, "empty paragraphs");
  assertEqual(leakedDecorations, 0, "excluded structural paragraphs");

  const schemaObjects = database
    .prepare("SELECT name FROM sqlite_schema WHERE name IN ('sentences', 'sentences_fts')")
    .all();
  assertEqual(schemaObjects.length, 0, "sentence schema objects");

  const foreignKeyRows = database.pragma("foreign_key_check");
  if (foreignKeyRows.length !== 0) {
    throw new Error(`Foreign-key validation returned ${foreignKeyRows.length} row(s)`);
  }

  const integrityRows = database.pragma("integrity_check");
  const integrity = integrityRows.map((row) => row.integrity_check);
  if (integrity.length !== 1 || integrity[0] !== "ok") {
    throw new Error(`SQLite integrity check failed: ${integrity.join(", ")}`);
  }

  const fts = validateFts(database, expected.paragraphs);
  assertEqual(fts.rowCount, expected.paragraphs, "FTS row count");

  return {
    expected,
    actual,
    foreignKeys: "ok",
    integrity: "ok",
    fts,
  };
}
