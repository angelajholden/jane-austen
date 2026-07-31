This is a multi-step project. Please complete only this job. Do not anticipate future jobs or begin implementing anything outside the stated scope. If you discover decisions that should be made before implementation, document them in the deliverable rather than making assumptions.

# Prompt 5 — Design the API Contract

## Objective

Design the JSON returned by the backend before implementing routes.

## Read

- requirements.md
- current schema

## Scope

Design:

- GET /api/search
- GET /api/metadata

Return frontend-ready JSON.

The frontend must not calculate timestamps or YouTube URLs.

Provide realistic JSON examples and fixtures.

One search result must represent one matching transcript chunk, not one aggregated transcript.

## Constraints

Do not implement routes.

## Done When

The frontend can be developed against the JSON fixtures.
