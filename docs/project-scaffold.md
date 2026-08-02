# Project Scaffold

## Files created

| Path | Purpose |
|---|---|
| `.gitignore` | Ignores dependencies, generated SQLite files, temporary database files, environment files, logs, and common local artifacts |
| `package.json` | Node.js package metadata, dependencies, and npm scripts |
| `package-lock.json` | Reproducible dependency resolution |
| `config/books.js` | Explicit list of the six approved v1 metadata directory slugs |
| `config/database.js` | Repository root, SQLite database path, and schema path configuration |
| `config/server.js` | Validated placeholder server port configuration |
| `data/.gitkeep` | Preserves the generated-data directory while database files remain ignored |
| `data/database.sqlite` | Generated empty SQLite database; ignored by Git |
| `scripts/init-db.js` | Schema-only database initialization and validation utility |
| `server/db.js` | SQLite connection factory with foreign-key enforcement |
| `server/server.js` | Basic Express entry point serving the placeholder client; no API routes |
| `client/index.html` | Minimal semantic HTML shell without behavior or styling |
| `tests/schema.test.js` | Empty-schema, table, trigger, and foreign-key checks |
| `tests/server.test.js` | Placeholder server startup and HTML delivery check |

The pre-existing `docs/`, `scripts/`, and `sql/` content was preserved. No canonical text or metadata file was modified.

## Dependencies

Only two runtime dependencies were added:

- `express` 5.2.1: placeholder HTTP server and static client delivery;
- `better-sqlite3` 12.11.1: SQLite schema initialization and connection management.

No test framework or development-only dependency was added. Tests use Node.js's built-in `node:test` runner. The project requires Node.js 20 or newer.

Installation completed successfully with 103 audited packages and zero reported vulnerabilities. npm emitted a deprecation warning for the transitive `prebuild-install` package; it is not a direct project dependency.

## npm scripts

| Command | Purpose |
|---|---|
| `npm start` | Run the placeholder Express server |
| `npm run dev` | Run the placeholder server with Node watch mode |
| `npm run db:init` | Initialize a new empty database from `sql/schema.sql` |
| `npm test` | Run all scaffold tests with Node's built-in test runner |

## Initialize the empty database

Install dependencies and initialize the database:

```sh
npm install
npm run db:init
```

The default database path is `data/database.sqlite`. The initializer:

1. creates a temporary database in the target directory;
2. enables SQLite foreign keys;
3. applies `sql/schema.sql`;
4. verifies the expected tables, zero row counts, and foreign-key integrity;
5. publishes the validated empty database at the configured path.

Initialization refuses to overwrite an existing database. To intentionally replace it with a new empty database:

```sh
npm run db:init -- --force
```

The `--force` form deletes all data in the existing target database and should only be used when complete replacement is intended.

Set `DATABASE_PATH` to override the default path. A relative override is resolved from the repository root; an absolute override remains absolute.

## Run the placeholder server

Initialize the database first, then run:

```sh
npm start
```

The server listens on port `3000` by default and serves `client/index.html`. Set `PORT` to a valid integer from 1 through 65535 to override it. The server opens the configured SQLite database through `server/db.js`, which enables and verifies foreign-key enforcement for that connection.

There are no API routes, importer behavior, search implementation, or eReader behavior in this scaffold.

## Tests executed

The final `npm test` run passed:

```text
tests:   2
passed:  2
failed:  0
```

The tests verify that:

- the approved schema initializes an empty temporary database;
- foreign-key enforcement is enabled;
- the expected canonical and FTS tables exist and contain zero rows;
- the three FTS synchronization triggers exist;
- the production placeholder server starts against an initialized database;
- an HTTP request receives the semantic HTML shell.

`npm run db:init -- --force` also completed successfully against the generated scaffold database. `npm start` reached the listening state successfully and was then stopped after verification.

## Unresolved issues

No schema initialization issue was found, so `sql/schema.sql` was not changed during scaffolding. Source parsing, importing, API routes, search behavior, and eReader behavior remain deliberately deferred to later jobs.
