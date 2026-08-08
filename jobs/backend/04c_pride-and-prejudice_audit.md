This is an audit-only follow-up to Prompt 4B.

Do not modify the parser, schema, metadata, canonical source text, or published
database in this job.

The purpose of this task is to determine why the current paragraph parser
reproduces the approved paragraph counts for five novels exactly but produces
fewer paragraphs than metadata for Pride and Prejudice.

# Prompt 4C — Pride and Prejudice Paragraph Boundary Audit

## Objective

Investigate the Pride and Prejudice paragraph-count mismatch produced by the
Prompt 4B paragraph parser.

Current result:

- expected Pride and Prejudice paragraphs: 2,121
- parsed Pride and Prejudice paragraphs: 2,060
- difference: 61
- mismatched chapters: 39
- five other v1 novels match their approved paragraph counts exactly
- chapter detection still passes for all 61 Pride and Prejudice chapters
- Chapter LXI now matches 14/14 after excluding the terminal illustrated
  `THE END`

Do not attempt to make the counts match in this job.

Determine exactly what source structures account for the difference.

## Read Before Auditing

Read and treat as authoritative/current context:

- `docs/requirements.md`
- `docs/database-design.md`
- `docs/book-format-analysis.md`
- `docs/importer.md`
- `docs/import-report.md`
- `metadata/pride-and-prejudice/pride-and-prejudice.txt`
- `metadata/pride-and-prejudice/pride-and-prejudice.metadata.json`
- `metadata/pride-and-prejudice/pride-and-prejudice.metadata-report.md`
- current paragraph parser implementation
- current chapter parser implementation
- current importer tests

Also inspect the Prompt 4B implementation as needed.

Do not use the three deferred v2 works.

## Core Question

Answer this question:

> Why does the current structural paragraph parser produce fewer paragraphs than
> the documented Pride and Prejudice metadata counts, while reproducing the
> paragraph counts for the other five v1 novels exactly?

The answer must be based on concrete source evidence.

Do not assume the parser is wrong.

Do not assume the metadata is wrong.

Audit both possibilities.

## Scope

Focus first on these chapters:

- Chapter I
- Chapter II
- Chapter III
- Chapter XXVIII
- Chapter LXI

These serve different purposes:

- Chapters I–III are early mismatched chapters with small count differences.
- Chapter XXVIII was previously thought to be explained by illustration
  handling but still mismatches after correct exclusion.
- Chapter LXI is now a known-good control case.

After analyzing those chapters, inspect additional mismatched chapters if needed
to determine whether the same structural pattern explains the full 61-paragraph
difference.

Do not manually inspect all 39 chapters unless necessary.

Prefer identifying a repeatable structural rule or count pattern.

## Required Audit Method

For each selected chapter, compare:

1. metadata expected paragraph count;
2. current parser paragraph count;
3. raw source structure;
4. parser-retained logical paragraphs;
5. excluded illustration/decorative blocks;
6. locations where the parser joins multiple physical source blocks into one
   retained paragraph;
7. locations where metadata appears to have counted more than one paragraph
   within one parser-retained paragraph.

The audit must preserve source line references wherever possible.

## Source Structure to Examine

Pay particular attention to:

- blank lines;
- whitespace-only lines;
- indentation changes;
- dialogue formatting;
- letters;
- quoted material;
- poetry or verse-like layout;
- decorative typography;
- illustration placement;
- illustration captions;
- copyright lines;
- standalone headings;
- centered/aligned text;
- italic markers;
- superscript notation;
- `/*` or other production markup;
- em-dash or hyphen-separated structural breaks;
- unusually short blocks;
- blocks separated visually in source without a conventional blank line;
- blocks the old metadata job may have treated specially.

Do not classify a source pattern as meaningful merely because it looks unusual.
Show whether it actually accounts for a count difference.

## Paragraph-by-Paragraph Comparison

For each audited chapter, produce a comparison that identifies the first point
where parser paragraph numbering diverges from the expected metadata count.

For each divergence, show enough surrounding source text to determine whether:

- two source units were merged by the parser;
- one source unit was excluded by the parser;
- the metadata likely counted an editorial/illustration unit;
- a formatting convention may have been interpreted as a paragraph boundary;
- the expected count cannot be explained from the current source.

Do not merely report that the chapter is short by N paragraphs.

Identify the structural cause.

## Chapter XXVIII

Audit Chapter XXVIII in detail.

Current state:

- metadata expected: 23
- current parser: 20
- illustration blocks are excluded correctly

Determine where the remaining difference of 3 comes from.

Specifically identify:

- all retained paragraph boundaries;
- all excluded illustration/decorative blocks;
- any source divisions that the current parser joins but the original metadata
  counting convention may have counted separately.

Do not change the parser.

## Chapter LXI Control

Use Chapter LXI as a control.

Current state:

- metadata expected: 14
- current parser: 14
- terminal illustrated `THE END` is excluded

Document why this chapter now agrees.

Use it to distinguish valid illustration exclusion from whatever causes the
remaining mismatches elsewhere.

## Compare Against Matching Novels

Because the same parser reproduces the other five books exactly, briefly compare
the suspect Pride and Prejudice source structures against at least one matching
book.

The goal is to determine whether Pride and Prejudice contains an edition-specific
formatting convention not present elsewhere.

Do not perform a full second-book audit.

A small number of representative source comparisons is enough.

## Metadata Report Review

Review the existing Pride and Prejudice metadata report's stated counting rule:

- non-empty prose blocks;
- separated by one or more blank lines;
- hard-wrapped lines joined;
- standalone illustrations/captions excluded.

Determine whether the actual stored paragraph counts appear consistent with
that documented rule.

If they are not, say so explicitly.

Do not rewrite the metadata report in this job.

## Programmatic Assistance

You may write temporary audit code or add an audit-only script if useful.

Any audit script must:

- be read-only with respect to canonical source and metadata;
- not alter parser output;
- not alter schema;
- not publish a database;
- produce reproducible diagnostics.

If you add a reusable audit script, place it under an appropriate `scripts/audit`
or similar location and document what it does.

Do not turn audit heuristics into importer behavior during this job.

## Required Output

Create:

`docs/audit/pride-and-prejudice-paragraph-boundaries.md`

The report must include:

### Summary

- expected total paragraphs;
- parsed total paragraphs;
- total difference;
- mismatched chapter count;
- high-level conclusion.

### Representative chapter analysis

Detailed findings for:

- Chapter I
- Chapter II
- Chapter III
- Chapter XXVIII
- Chapter LXI

Include source line references and concrete examples.

### Pattern analysis

State whether the mismatches are explained by one or more repeatable source
patterns.

For each pattern:

- describe it;
- show examples;
- state how many audited discrepancies it explains;
- state whether it appears unique to Pride and Prejudice.

### Parser assessment

Classify the current parser as one of:

- consistent with the approved paragraph contract;
- missing a defensible structural rule;
- ambiguous pending product decision.

Explain why.

### Metadata assessment

Classify the current Pride and Prejudice paragraph counts as one of:

- consistent with the documented counting rule;
- inconsistent with the documented counting rule;
- not reproducible from the available source/report.

Explain why.

### Recommendation

Recommend exactly one next action:

1. revise the parser with a clearly identified structural rule;
2. regenerate Pride and Prejudice paragraph metadata from the approved parser;
3. perform a narrower manual audit before deciding.

Do not implement the recommendation in this job.

## Evidence Standard

Do not conclude that metadata is wrong merely because the new parser differs.

Do not conclude that the parser is wrong merely because metadata differs.

A conclusion must be supported by source-level evidence.

If the original metadata counting behavior cannot be reconstructed, say so.

## Constraints

Do not:

- modify canonical text files;
- modify metadata JSON;
- modify metadata reports;
- modify `sql/schema.sql`;
- modify importer production behavior;
- change paragraph parsing rules;
- add sentence tokenization;
- publish a database;
- implement API routes;
- implement frontend behavior;
- broaden into search relevance or eReader design.

This is an audit only.

## Done When

The task is complete when:

- the five required chapters have been audited;
- the first divergence points are identified;
- the likely structural cause or causes are documented;
- the current parser and metadata are each assessed against the approved
  paragraph contract;
- a single evidence-based next action is recommended;
- no production parser/schema/source/metadata changes have been made.
