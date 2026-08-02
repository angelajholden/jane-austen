import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { databasePath, projectRoot } from "../config/database.js";
import { port as configuredPort } from "../config/server.js";
import { openDatabase } from "./db.js";

const modulePath = fileURLToPath(import.meta.url);
const clientPath = path.join(projectRoot, "client");

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.static(clientPath));
  return app;
}

export function startServer({
  port = configuredPort,
  databaseFilename = databasePath,
} = {}) {
  const database = openDatabase(databaseFilename);
  const app = createApp();
  app.locals.database = database;

  const server = app.listen(port);

  server.once("listening", () => {
    const address = server.address();
    const listeningPort =
      address && typeof address === "object" ? address.port : port;
    console.log(
      `Jane Austen Database placeholder server listening on port ${listeningPort}`,
    );
  });

  server.on("close", () => {
    if (database.open) {
      database.close();
    }
  });

  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === modulePath) {
  const server = startServer();

  const shutdown = () => server.close();
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
