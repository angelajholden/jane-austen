I have downloaded the Project Gutenberg plain-text version of _Pride and Prejudice_.

Analyze the text file and create a structured metadata file for the book. Do not write application code, database code, API endpoints, or importer logic. This task is only about examining the novel and gathering reliable book-level metadata.

Create a JSON file named:

`pride-and-prejudice.metadata.json`

Include the following fields:

```json
{
	"id": "pride-and-prejudice",
	"title": "Pride and Prejudice",
	"slug": "pride-and-prejudice",
	"author": "Jane Austen",
	"gutenbergId": 1342,
	"sourceFile": "",
	"chapterCount": 0,
	"sentenceCount": 0,
	"paragraphCount": 0,
	"characters": [],
	"places": []
}
```

## Chapter and text counts

Determine:

- The total number of chapters.
- The total number of sentences in the novel.
- The total number of paragraphs in the novel.
- The sentence count for each chapter.
- The paragraph count for each chapter.

Add a `chapters` array using this structure:

```json
{
	"id": "chapter-1",
	"number": 1,
	"title": "Chapter 1",
	"sentenceCount": 0,
	"paragraphCount": 0
}
```

Use the chapter numbering and headings found in the source text. Do not invent chapter titles when the book only supplies chapter numbers.

Do not include the Project Gutenberg header, footer, license, or other non-novel content in any counts.

## Characters

Create a list of named characters who appear in the novel.

For each character, include:

```json
{
	"id": "elizabeth-bennet",
	"name": "Elizabeth Bennet",
	"aliases": ["Elizabeth", "Lizzy", "Eliza", "Miss Elizabeth Bennet"]
}
```

Requirements:

- Use the character’s clearest full or commonly recognized name as the primary `name`.
- Include forms of address, nicknames, surname-only references, and other names used for that same character in the novel.
- Do not treat every use of titles such as “Mrs. Bennet” or “Miss Bennet” as automatically unambiguous. Note ambiguity where necessary.
- Do not invent aliases that are not supported by the text.
- Do not include unnamed people such as “the servant,” “the officer,” or “a gentleman” unless they are consistently treated as a distinct character.
- Keep separate characters separate even when they share a surname or title.

When an alias could refer to more than one character, include an optional field:

```json
{
	"alias": "Miss Bennet",
	"ambiguous": true,
	"notes": "This may refer to Jane Bennet or another unmarried Bennet daughter depending on context."
}
```

Use a structure that remains valid JSON and makes the ambiguity clear.

## Places

Create a list of named places mentioned in the novel.

Include categories such as:

- towns
- villages
- cities
- counties
- countries
- estates
- houses
- inns
- streets
- parks
- schools
- churches
- military locations
- other specifically named geographic or physical locations

For each place, use:

```json
{
	"id": "longbourn",
	"name": "Longbourn",
	"type": "estate",
	"aliases": [],
	"notes": ""
}
```

Requirements:

- Only include places that are named or clearly identifiable in the text.
- Distinguish between geographic places and named properties.
- Do not infer modern addresses or coordinates.
- Do not invent a more precise location than the novel provides.
- If a place is fictional, historical, real, or uncertain, note that only when it can be stated confidently.
- Merge spelling or naming variations into one entry and store the variations as aliases.

## ID conventions

- Book IDs should be globally unique.
- Chapter IDs should be unique within a book.
- Character IDs should be unique within a book.
- Place IDs should be unique within a book.
- Use lowercase kebab-case.
- IDs should be deterministic and stable across repeated executions.

## Validation report

Also create a Markdown file named:

`pride-and-prejudice.metadata-report.md`

The report should contain:

1. A summary of the extracted counts.
2. Any uncertainty about chapter detection.
3. Any uncertainty about sentence or paragraph counting.
4. Characters whose names or aliases are ambiguous.
5. Places whose type or identity is uncertain.
6. Any Project Gutenberg formatting issues that affected the analysis.
7. Any items that should be manually reviewed.

Do not silently guess when the text is ambiguous. Record the uncertainty in the report.

## Important boundaries

- Do not modify the source text file.
- Do not generate one JSON object per sentence.
- Do not build the sentence parser or importer.
- Do not design database tables.
- Do not generate frontend or backend code.
- Do not add themes, motifs, personality traits, literary analysis, important quotes, or subjective character descriptions.
- Keep the metadata factual and grounded in the text.
- Validate that the final JSON is syntactically correct.
- Preserve apostrophes, quotation marks, capitalization, and Unicode characters correctly.
- Before finishing, compare the chapter count against the actual chapter headings in the text and report any discrepancy.
