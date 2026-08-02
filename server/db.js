import Database from "better-sqlite3";

import { databasePath } from "../config/database.js";

export function openDatabase(filename = databasePath, options = {}) {
  const database = new Database(filename, options);
  database.pragma("foreign_keys = ON");

  if (database.pragma("foreign_keys", { simple: true }) !== 1) {
    database.close();
    throw new Error("SQLite foreign-key enforcement could not be enabled.");
  }

  return database;
}
