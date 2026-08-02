import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));

const configuredDatabasePath =
  process.env.DATABASE_PATH ?? path.join("data", "database.sqlite");

export const databasePath = path.resolve(projectRoot, configuredDatabasePath);
export const schemaPath = path.resolve(projectRoot, "sql", "schema.sql");
