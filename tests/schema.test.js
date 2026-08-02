import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { initializeDatabase, expectedTables } from "../scripts/init-db.js";
import { openDatabase } from "../server/db.js";

test("the approved schema initializes an empty database", (context) => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "jane-austen-schema-"),
  );
  const filename = path.join(temporaryDirectory, "database.sqlite");

  context.after(() => fs.rmSync(temporaryDirectory, { recursive: true, force: true }));

  initializeDatabase({ filename });

  const database = openDatabase(filename, { readonly: true });
  context.after(() => database.close());

  assert.equal(database.pragma("foreign_keys", { simple: true }), 1);
  assert.deepEqual(database.pragma("foreign_key_check"), []);

  const tables = database
    .prepare(
      `SELECT name
       FROM sqlite_schema
       WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
       ORDER BY name`,
    )
    .all()
    .map(({ name }) => name);

  for (const table of expectedTables) {
    assert.ok(tables.includes(table), `expected table ${table}`);
    assert.equal(
      database.prepare(`SELECT count(*) AS count FROM ${table}`).get().count,
      0,
      `expected ${table} to be empty`,
    );
  }

  const triggers = database
    .prepare(
      `SELECT name
       FROM sqlite_schema
       WHERE type = 'trigger'
       ORDER BY name`,
    )
    .all()
    .map(({ name }) => name);

  assert.deepEqual(triggers, ["sentences_ad", "sentences_ai", "sentences_au"]);
});
