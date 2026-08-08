import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { databasePath, schemaPath } from "../config/database.js";
import { openDatabase } from "../server/db.js";

export const expectedTables = Object.freeze([
  "books",
  "chapters",
  "character_aliases",
  "characters",
  "location_aliases",
  "locations",
  "paragraphs",
  "paragraphs_fts",
]);

function validateEmptySchema(database) {
  const placeholders = expectedTables.map(() => "?").join(", ");
  const tableRows = database
    .prepare(
      `SELECT name
       FROM sqlite_schema
       WHERE type = 'table' AND name IN (${placeholders})
       ORDER BY name`,
    )
    .all(...expectedTables);

  const actualTables = tableRows.map(({ name }) => name);
  const expectedSorted = [...expectedTables].sort();

  if (JSON.stringify(actualTables) !== JSON.stringify(expectedSorted)) {
    throw new Error("The initialized database is missing expected schema tables.");
  }

  for (const table of expectedTables) {
    const count = database.prepare(`SELECT count(*) AS count FROM ${table}`).get().count;
    if (count !== 0) {
      throw new Error(`Expected ${table} to be empty after initialization.`);
    }
  }

  if (database.pragma("foreign_key_check").length !== 0) {
    throw new Error("The initialized database failed its foreign-key check.");
  }
}

export function initializeDatabase({
  filename = databasePath,
  schemaFilename = schemaPath,
  force = false,
} = {}) {
  const targetPath = path.resolve(filename);
  const targetDirectory = path.dirname(targetPath);
  const temporaryPath = `${targetPath}.tmp-${process.pid}-${Date.now()}`;

  if (fs.existsSync(targetPath) && !force) {
    throw new Error(
      `Database already exists at ${targetPath}. Pass --force to replace it.`,
    );
  }

  fs.mkdirSync(targetDirectory, { recursive: true });
  const schema = fs.readFileSync(schemaFilename, "utf8");
  let database;

  try {
    database = openDatabase(temporaryPath);
    database.exec(schema);
    validateEmptySchema(database);
    database.close();
    database = undefined;

    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath);
    }
    fs.renameSync(temporaryPath, targetPath);
  } catch (error) {
    if (database?.open) {
      database.close();
    }
    if (fs.existsSync(temporaryPath)) {
      fs.rmSync(temporaryPath);
    }
    throw error;
  }

  return targetPath;
}

const isCommandLineEntry =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCommandLineEntry) {
  try {
    const initializedPath = initializeDatabase({
      force: process.argv.includes("--force"),
    });
    console.log(`Initialized empty SQLite database at ${initializedPath}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
