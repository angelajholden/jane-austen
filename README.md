# Metadata Job

This job analyzes source material and produces structured metadata for later import into an application.

The objective is to extract factual information from the source material, not to build an application.

General principles:

- Treat the source material as the single source of truth.
- Prefer extraction over inference.
- When information is ambiguous, record the ambiguity instead of guessing.
- Produce deterministic, repeatable output.
- Preserve the original source material without modification.
- Separate source content from generated metadata.
- Validate all generated JSON before finishing.
- If confidence is low for any extracted data, document the uncertainty in a companion report rather than silently inventing information.

This prompt should only perform metadata analysis and generation. It should not generate application code, importer logic, database schema, frontend components, backend endpoints, or implementation details unless explicitly requested by a future prompt.
