This is a multi-step project. Please complete only this job. Do not anticipate future jobs or begin implementing anything outside the stated scope. If you discover decisions that should be made before implementation, document them in the deliverable rather than making assumptions.

# Prompt 4 — Build the Importer

## Objective

Implement the transcript importer.

## Read

- requirements.md
- docs/transcript-format-analysis.md
- docs/database-design.md

## Scope

Read only the approved transcript directories.

Importer responsibilities:

- Validate directories
- Parse frontmatter
- Parse transcript chunks
- Validate data
- Rebuild the database safely
- Rebuild the FTS index
- Report import statistics

Use the verified stream offset rules from the transcript analysis.

## Constraints

Do not build the API or frontend.

## Done When

Running the importer produces a complete searchable SQLite database.
