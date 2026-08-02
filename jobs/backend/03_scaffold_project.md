This is a multi-step project. Complete only the job described below.

Do not anticipate later jobs or begin implementing the importer, API routes, or
frontend behavior.

If a decision is required before implementation, document it rather than making
an assumption.

# Prompt 3 — Scaffold the Project

## Objective

Create the Jane Austen Database project structure and initialize an empty
SQLite database using the approved schema.

## Read

- `requirements.md`
- `docs/database-design.md`
- `sql/schema.sql`

## Scope

Create or complete the repository structure:

```text
config/
data/
docs/
scripts/
server/
client/
tests/
```

Create the required Node.js package configuration, development scripts,
database initialization support, configuration files, and a minimal placeholder
client.

The scaffold must support one application containing:

- the Express.js backend
- the SQLite database
- the future importer
- the future eReader frontend

## Required Work

- Create `package.json`.
- Add only the dependencies needed for the approved scaffold and SQLite schema
  initialization.
- Add useful npm scripts for development, testing, and database initialization.
- Create the configured SQLite database location.
- Apply `sql/schema.sql` to produce an empty database.
- Enable SQLite foreign-key enforcement where database connections are created.
- Create the basic Express server entry point without implementing API routes.
- Create a minimal semantic HTML shell in `client/`.
- Add configuration for the six approved v1 book directories.
- Add `.gitignore` entries for generated database files, temporary database
  files, dependency directories, and environment files where appropriate.
- Add minimal tests verifying that the schema initializes and expected tables
  exist.

## Approved v1 Books

- `emma`
- `mansfield-park`
- `northanger-abbey`
- `persuasion`
- `pride-and-prejudice`
- `sense-and-sensibility`

Do not include the deferred v2 works.

## Constraints

- Do not implement the book importer.
- Do not parse book text or metadata.
- Do not populate the database.
- Do not implement search.
- Do not implement API routes.
- Do not implement eReader behavior or frontend styling.
- Do not modify the canonical book text or metadata files.
- Do not redesign the approved database schema unless it cannot initialize; if
  a schema issue is found, document it instead of silently changing it.

## Deliverable

Create the scaffolded project and document:

- files created
- dependencies added
- npm scripts added
- how to initialize the empty database
- how to run the placeholder server
- tests executed and their results
- any unresolved issues

## Done When

- dependencies install successfully;
- the project starts successfully;
- `sql/schema.sql` initializes an empty SQLite database;
- foreign keys are enabled;
- the expected schema objects exist;
- scaffold tests pass;
- no importer, API, or frontend behavior has been implemented.
