import assert from "node:assert/strict";
import { once } from "node:events";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { initializeDatabase } from "../scripts/init-db.js";
import { startServer } from "../server/server.js";

test("the placeholder server starts and serves the semantic HTML shell", async (context) => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "jane-austen-server-"),
  );
  const filename = path.join(temporaryDirectory, "database.sqlite");
  initializeDatabase({ filename });

  const server = startServer({ port: 0, databaseFilename: filename });
  context.after(() => fs.rmSync(temporaryDirectory, { recursive: true, force: true }));

  if (!server.listening) {
    await once(server, "listening");
  }

  const address = server.address();
  assert.equal(typeof address, "object");

  const response = await fetch(`http://127.0.0.1:${address.port}/`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.match(html, /<h1>Jane Austen Database<\/h1>/);

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
