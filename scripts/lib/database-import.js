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
      totals.sentences += book.metadata.sentenceCount;
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
      sentences: 0,
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
         stable_id, book_id, chapter_id, ordinal_in_chapter, ordinal_in_book
       ) VALUES (?, ?, ?, ?, ?)`,
    ),
    sentence: database.prepare(
      `INSERT INTO sentences (
         stable_id, book_id, chapter_id, paragraph_id,
         ordinal_in_paragraph, ordinal_in_chapter, ordinal_in_book, text
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
          const paragraphId = Number(
            statements.paragraph.run(
              paragraph.stableId,
              bookId,
              chapterId,
              paragraph.ordinalInChapter,
              paragraph.ordinalInBook,
            ).lastInsertRowid,
          );

          for (const sentence of paragraph.sentences) {
            statements.sentence.run(
              sentence.stableId,
              bookId,
              chapterId,
              paragraphId,
              sentence.ordinalInParagraph,
              sentence.ordinalInChapter,
              sentence.ordinalInBook,
              sentence.text,
            );
          }
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

function validateFts(database, expectedSentenceCount) {
  database
    .prepare("INSERT INTO sentences_fts(sentences_fts) VALUES ('integrity-check')")
    .run();

  const representative = database
    .prepare("SELECT id, text FROM sentences ORDER BY id LIMIT 1")
    .get();

  if (!representative && expectedSentenceCount > 0) {
    throw new Error("FTS validation: no representative sentence exists");
  }

  let representativeMatches = 0;
  if (representative) {
    const token = representative.text.match(/[\p{L}\p{N}]{3,}/u)?.[0];
    if (!token) {
      throw new Error("FTS validation: representative sentence has no searchable token");
    }
    representativeMatches = database
      .prepare("SELECT count(*) AS count FROM sentences_fts WHERE sentences_fts MATCH ?")
      .get(`\"${token.replaceAll('"', '""')}\"`).count;
    if (representativeMatches < 1) {
      throw new Error(`FTS validation: representative token ${JSON.stringify(token)} was not found`);
    }

    database.exec("SAVEPOINT importer_fts_sync_check");
    try {
      database
        .prepare("UPDATE sentences SET text = text || ' importerftsprobe' WHERE id = ?")
        .run(representative.id);
      const probeCount = database
        .prepare(
          "SELECT count(*) AS count FROM sentences_fts WHERE sentences_fts MATCH 'importerftsprobe'",
        )
        .get().count;
      if (probeCount !== 1) {
        throw new Error(`FTS synchronization: expected one probe match; found ${probeCount}`);
      }
    } finally {
      database.exec(
        "ROLLBACK TO importer_fts_sync_check; RELEASE importer_fts_sync_check",
      );
    }
  }

  const orphanFtsRows = database
    .prepare(
      `SELECT count(*) AS count
       FROM sentences_fts AS fts
       LEFT JOIN sentences AS sentence ON sentence.id = fts.rowid
       WHERE sentence.id IS NULL`,
    )
    .get().count;

  assertEqual(orphanFtsRows, 0, "orphan FTS rows");

  return {
    rowCount: tableCount(database, "sentences_fts"),
    representativeMatches,
    integrity: "ok",
    synchronization: "ok",
  };
}

export function validatePopulatedDatabase(database, books) {
  const expected = expectedImportTotals(books);
  const actual = {
    books: tableCount(database, "books"),
    chapters: tableCount(database, "chapters"),
    paragraphs: tableCount(database, "paragraphs"),
    sentences: tableCount(database, "sentences"),
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
  validateSequentialRows(
    database,
    `SELECT paragraph_id, ordinal_in_paragraph
     FROM sentences ORDER BY paragraph_id, ordinal_in_paragraph`,
    "paragraph_id",
    "ordinal_in_paragraph",
    "sentence paragraph ordinals",
  );
  validateSequentialRows(
    database,
    `SELECT chapter_id, ordinal_in_chapter
     FROM sentences ORDER BY chapter_id, ordinal_in_chapter`,
    "chapter_id",
    "ordinal_in_chapter",
    "sentence chapter ordinals",
  );
  validateSequentialRows(
    database,
    "SELECT book_id, ordinal_in_book FROM sentences ORDER BY book_id, ordinal_in_book",
    "book_id",
    "ordinal_in_book",
    "sentence book ordinals",
  );

  const orphanParagraphs = database
    .prepare(
      `SELECT count(*) AS count FROM paragraphs AS p
       LEFT JOIN chapters AS c ON c.id = p.chapter_id AND c.book_id = p.book_id
       WHERE c.id IS NULL`,
    )
    .get().count;
  const orphanSentences = database
    .prepare(
      `SELECT count(*) AS count FROM sentences AS s
       LEFT JOIN paragraphs AS p
         ON p.id = s.paragraph_id
        AND p.chapter_id = s.chapter_id
        AND p.book_id = s.book_id
       WHERE p.id IS NULL`,
    )
    .get().count;
  const emptySentences = database
    .prepare("SELECT count(*) AS count FROM sentences WHERE length(trim(text)) = 0")
    .get().count;

  assertEqual(orphanParagraphs, 0, "orphan paragraphs");
  assertEqual(orphanSentences, 0, "orphan sentences");
  assertEqual(emptySentences, 0, "empty sentences");

  const foreignKeyRows = database.pragma("foreign_key_check");
  if (foreignKeyRows.length !== 0) {
    throw new Error(`Foreign-key validation returned ${foreignKeyRows.length} row(s)`);
  }

  const integrityRows = database.pragma("integrity_check");
  const integrity = integrityRows.map((row) => row.integrity_check);
  if (integrity.length !== 1 || integrity[0] !== "ok") {
    throw new Error(`SQLite integrity check failed: ${integrity.join(", ")}`);
  }

  const fts = validateFts(database, expected.sentences);
  assertEqual(fts.rowCount, expected.sentences, "FTS row count");

  return {
    expected,
    actual,
    foreignKeys: "ok",
    integrity: "ok",
    fts,
  };
}
