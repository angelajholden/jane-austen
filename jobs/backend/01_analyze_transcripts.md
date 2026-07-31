This is a multi-step project. Please complete only this job. Do not anticipate future jobs or begin implementing anything outside the stated scope. If you discover decisions that should be made before implementation, document them in the deliverable rather than making assumptions.

# Prompt 1 — Analyze Transcript Format

## Objective

Analyze the approved transcript directories and document the transcript format. Do not write application code.

## Read

- requirements.md

## Scope

Inspect only the approved transcript directories provided for this job.

`/Users/angelajholden/Projects/content-agent/transcripts/22_colorado`
`/Users/angelajholden/Projects/content-agent/transcripts/23_ui_snacks`
`/Users/angelajholden/Projects/content-agent/transcripts/24_practice_layouts/`
`/Users/angelajholden/Projects/content-agent/transcripts/25_youtube_database`

Treat these directories as the complete scope of analysis. Do not inspect or make assumptions based on any other transcript directories.

Determine:

- Required and optional frontmatter fields
- Timestamp format
- Transcript chunk format
- Multi-line behavior
- Relative path derivation
- Validation rules
- The meaning of `stream_offset_seconds` (including whether positive or negative values are used)
- Any inconsistencies or edge cases

## Deliverable

Create `docs/transcript-format-analysis.md` containing:

- Parsing contract
- Validation rules
- Example transcript object
- Example chunk object
- Offset calculation rule
- Edge cases
- Files inspected

## Constraints

- Do not modify transcript files.
- Do not create the database.
- Do not scaffold the application.

## Done When

Another developer could implement the importer without reopening the transcript files.
