# Book Source Format Analysis

This analysis covers only the nine approved directories named in `jobs/backend/requirements.md`. It describes the files as inspected on 2026-08-01. The source material is raw Project Gutenberg text, not a pre-segmented sentence-chunk format. Several editorial rules needed to reproduce the JSON counts are described informally in the metadata reports but are not encoded precisely enough to implement without additional decisions.

## 1. Files and directories inspected

| Approved directory                     | Canonical text                   | JSON metadata                              | Extra file                                      |
| -------------------------------------- | -------------------------------- | ------------------------------------------ | ----------------------------------------------- |
| `metadata/emma/`                       | `emma.txt`                       | `emma.metadata.json`                       | `emma.metadata-report.md`                       |
| `metadata/lady-susan/`                 | `lady-susan.txt`                 | `lady-susan.metadata.json`                 | `lady-susan.metadata-report.md`                 |
| `metadata/love-and-freindship/`        | `love-and-freindship.txt`        | `love-and-freindship.metadata.json`        | `love-and-freindship.metadata-report.md`        |
| `metadata/mansfield-park/`             | `mansfield-park.txt`             | `mansfield-park.metadata.json`             | `mansfield-park.metadata-report.md`             |
| `metadata/northanger-abbey/`           | `northanger-abbey.txt`           | `northanger-abbey.metadata.json`           | `northanger-abbey.metadata-report.md`           |
| `metadata/persuasion/`                 | `persuasion.txt`                 | `persuasion.metadata.json`                 | `persuasion.metadata-report.md`                 |
| `metadata/pride-and-prejudice/`        | `pride-and-prejudice.txt`        | `pride-and-prejudice.metadata.json`        | `pride-and-prejudice.metadata-report.md`        |
| `metadata/sense-and-sensibility/`      | `sense-and-sensibility.txt`      | `sense-and-sensibility.metadata.json`      | `sense-and-sensibility.metadata-report.md`      |
| `metadata/the-letters-of-jane-austen/` | `the-letters-of-jane-austen.txt` | `the-letters-of-jane-austen.metadata.json` | `the-letters-of-jane-austen.metadata-report.md` |

No nested directories were present. Every approved directory contained exactly these three regular files. The report is supporting documentation, not one of the two canonical source-of-truth files identified by the requirements.

## 2. Directory and filename contract

- Approved directories are selected by explicit configuration; directory discovery must not implicitly approve other directories.
- Every inspected directory name is a lowercase ASCII hyphenated slug.
- For directory slug `<slug>`, the canonical pair is `<slug>.txt` and `<slug>.metadata.json`. All inspected pairs follow this rule.
- In every JSON file, `id` and `slug` equal the directory slug.
- In every JSON file, `sourceFile` equals the repository-relative canonical path `metadata/<slug>/<slug>.txt`.
- The requirements say the relative path is derived from the folder structure and requires no additional metadata field. Therefore, the importer can derive `metadata/<slug>/<slug>.txt`; the existing `sourceFile` is redundant and should be validated against that derived value rather than trusted as a second path authority.
- `<slug>.metadata-report.md` is an extra file in every directory. It is supported by the observed corpus, but no requirements rule says whether arbitrary additional files are allowed.
- Filenames are case-sensitive in the observed contract. No alternative casing or extension appears.

## 3. Plain-text parsing contract

### Encoding and line structure

- All nine text files are UTF-8 without a byte-order mark or NUL bytes.
- All use CRLF (`\r\n`) line endings exclusively. A reader should normalize CRLF and LF at input boundaries so a line-ending-only change cannot alter parsing.
- One physical line is **not** one sentence chunk. Prose is hard-wrapped across lines. For example, Gutenberg introductory prose begins on one line and continues on the next without a sentence boundary.
- A prose paragraph is described by all nine reports as a non-empty block separated by one or more blank lines, after wrapped lines are joined.
- Whitespace-only physical lines occur in every text file. They should be treated as blank separators if the agreed parser follows the reports.
- Within a prose block, wrapped lines need to be joined. The source does not establish whether joining always inserts one ASCII space, nor how indentation, hyphenated line endings, verse, tables, lists, or alignment markup should be handled. This must be specified before implementation.

### Book boundaries and non-book material

The files are complete Gutenberg transcriptions, not body-only books. Observed non-body material includes:

- Gutenberg header, start/end markers, footer, and license;
- title pages, contents, publication matter, credits, and transcriber notes;
- volume headings and duplicated contents headings;
- illustrations, captions, decorative matter, and printer/editorial material;
- introductions, advertisements, notes, and anthology section titles;
- in the letter collection, dates, addresses, salutations, signatures, postscripts, and editorial footnotes.

The reports state that front matter, contents, terminal markers, licenses, and standalone editorial/illustration matter were excluded from counts. However, they do not provide exact start/end line markers or a complete machine-readable classification rule. In-letter apparatus in `the-letters-of-jane-austen.txt` is expressly retained, while front/back editorial matter is excluded.

### Chapters and chapter-equivalent sections

The JSON `chapters` arrays provide ordered, normalized chapter records, but their `title` values cannot be used as exact source-line delimiters. Exact trimmed-line matching found no metadata title in the text for Emma, Lady Susan, Mansfield Park, Northanger Abbey, Persuasion, Pride and Prejudice, Sense and Sensibility, or The Letters of Jane Austen. In Love and Freindship, some normalized titles occur zero, once, or twice, so exact matching is still incomplete or ambiguous.

Source headings vary by work and edition:

- Emma: 55 sequential chapter objects across three volumes; source numbering restarts within volumes. JSON titles retain volume context, such as `Volume I, Chapter I`.
- Lady Susan: 41 Roman-numbered letters plus `Conclusion`, represented as 42 chapter-equivalent sections.
- Love and Freindship: 36 heterogeneous anthology sections, including letters and short works; repeated letter-style headings occur.
- Mansfield Park: 48 Roman-numbered chapters.
- Northanger Abbey: 31 numbered chapters; the author advertisement and final editorial note are excluded.
- Persuasion: 24 Roman-numbered chapters.
- Pride and Prejudice: 61 Roman-numbered headings with casing and punctuation variation; JSON normalizes titles to `Chapter 1` through `Chapter 61`. The first heading is embedded in decorated illustration material.
- Sense and Sensibility: 50 chapters; edition introduction and illustration material are excluded.
- The Letters of Jane Austen: 78 Roman-numbered letters treated as chapters.

Chapter headings, volume headings, anthology headings, and contents entries are not sentence chunks or prose paragraphs under the report conventions. A stable raw-file reading order is physical order after explicit classification and exclusion. The source does not yet provide a deterministic, corpus-wide heading detector or precise body ranges.

### Sentences

The reports describe deterministic punctuation-based segmentation after paragraph lines are joined. Periods, question marks, and exclamation marks are terminal punctuation; common abbreviations, initials, and decimal points are protected; dialogue punctuation and closing quotation marks are considered. No complete abbreviation list, regular expression, quote/bracket-closing rule, ellipsis rule, or dash/interruption rule is supplied. Consequently, the reported sentence counts are reference totals, but they are not independently reproducible from the current contract.

Unicode spelling, punctuation, curly quotation marks, apostrophes, dashes, and historical typography must be preserved in sentence text. Unicode normalization is not authorized by the source contract. Line-ending normalization and removal of layout-only wrapping are distinct from changing textual characters.

## 4. JSON metadata contract

All nine JSON files are well-formed and share these top-level fields:

| Field            | Observed type | Observed rule                                            |
| ---------------- | ------------- | -------------------------------------------------------- |
| `id`             | string        | Non-empty; equals directory slug in all files            |
| `title`          | string        | Non-empty display title                                  |
| `slug`           | string        | Non-empty; equals directory slug and `id`                |
| `author`         | string        | `Jane Austen` in all files                               |
| `gutenbergId`    | integer       | Positive numeric Gutenberg identifier                    |
| `sourceFile`     | string        | Repository-relative `metadata/<slug>/<slug>.txt`         |
| `chapterCount`   | integer       | Non-negative; equals `chapters.length`                   |
| `sentenceCount`  | integer       | Non-negative; equals sum of chapter sentence counts      |
| `paragraphCount` | integer       | Non-negative; equals sum of chapter paragraph counts     |
| `characters`     | array         | Character/person records                                 |
| `places`         | array         | Place records; the source uses `places`, not `locations` |
| `chapters`       | array         | Ordered chapter-equivalent records                       |

No publication date or publication year field exists in any JSON file. Gutenberg release/update dates and edition dates visible in raw text are not reliably the book's publication date. The required `book date` therefore cannot currently be populated without a schema/source decision.

Because every top-level field appears in every inspected file, they form the observed common schema. The files do not independently say whether fields such as `author`, `gutenbergId`, `sourceFile`, or `slug` are semantically required; validator requiredness must be approved rather than inferred solely from presence.

### Characters

The common character shape is:

```json
{
	"id": "emma-woodhouse",
	"name": "Emma Woodhouse",
	"aliases": ["Emma", "Miss Woodhouse"]
}
```

- `id` and `name` are strings; `aliases` is an array of strings.
- Pride and Prejudice additionally uses optional `ambiguousAliases`, an array of objects such as `{ "alias": "Miss Bennet", "ambiguous": true, "notes": "..." }`. Some character records also have optional string `notes`.
- The nonfiction letter collection uses `characters` for real people.
- Character IDs are unique within every inspected book. The source does not state whether character IDs must be globally unique; many are naturally reusable across books.

### Places

The common place shape is:

```json
{
	"id": "highbury",
	"name": "Highbury",
	"type": "village",
	"aliases": [],
	"notes": ""
}
```

All place records have string `id`, `name`, `type`, and `notes`, plus a string array `aliases`. Place IDs are unique within every inspected book. The allowed vocabulary for `type` is not declared by the files and should not be closed without a separate schema decision.

### Chapters

Every chapter record has this shape:

```json
{
	"id": "chapter-1",
	"number": 1,
	"title": "Volume I, Chapter I",
	"sentenceCount": 158,
	"paragraphCount": 47
}
```

`id` and `title` are strings; `number`, `sentenceCount`, and `paragraphCount` are integers. Chapter IDs are unique per book. `number` is a sequential book-wide ordinal, even where source numbering restarts or the section is a letter/conclusion/short work.

### Count agreement

For every book:

- `chapterCount === chapters.length`;
- `sentenceCount === sum(chapters[].sentenceCount)`;
- `paragraphCount === sum(chapters[].paragraphCount)`.

The reports repeat the same totals. Agreement of these metadata fields with a fresh parse of raw text cannot be verified until the exclusion, heading, wrapping, and sentence-tokenization rules are made deterministic.

### Identifier and alias uniqueness

No duplicate character, place, or chapter IDs occur within a book. Canonical-name uniqueness was not declared as a contract. Aliases are **not unique**, even within a book. Case-insensitive overlaps observed are:

- Mansfield Park: `Mr. Bertram`, `Miss Bertram`, and `Tom` each map to two characters.
- Persuasion: `Miss Musgrove` maps to Louisa and Henrietta Musgrove.
- Sense and Sensibility: `Miss Steele` maps to Lucy and Anne Steele.
- The Letters of Jane Austen: `Captain Austen`, `Edward`, and `Elizabeth` each map to two people.

Pride and Prejudice explicitly models some ambiguity with `ambiguousAliases`; other books store ambiguous strings directly in `aliases`. Alias matching therefore cannot assume a unique entity target.

## 5. Sentence chunk parsing contract

If the outstanding parsing decisions are resolved, a sentence chunk can carry:

| Value                           | Derivation and reliability                                                                                                                           |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Book ID                         | Reliable from validated JSON `id`                                                                                                                    |
| Chapter ID                      | Reliable from the matched ordered JSON chapter record, but matching raw text to records is not yet specified                                         |
| Chapter ordinal                 | Reliable from `chapters[].number` after chapter-boundary matching                                                                                    |
| Paragraph ordinal               | Derivable by counting retained blank-line-separated prose blocks; whether ordinal is book-wide, chapter-wide, and zero- or one-based must be decided |
| Sentence ordinal within book    | Derivable by retained physical reading order after an exact tokenizer is specified                                                                   |
| Sentence ordinal within chapter | Derivable after chapter matching and tokenization are specified                                                                                      |
| Sentence text                   | Derivable after wrapping and segmentation rules are specified; Unicode textual punctuation should be preserved                                       |
| Relative book path              | Reliably derived as `metadata/<directory-slug>/<directory-slug>.txt`                                                                                 |

An empty physical line is a separator, not an empty sentence. Heading and excluded editorial blocks do not produce sentence chunks. Multiple sentences may occur in one joined paragraph, and one sentence may span multiple physical lines.

The metadata contains counts only; it does not contain per-sentence offsets, paragraph records, raw heading mappings, or body boundary offsets. Therefore it cannot by itself locate eReader targets at sentence granularity.

## 6. Relative path derivation

Given an explicitly approved slug `emma`:

1. Resolve the approved directory as `metadata/emma/` relative to the repository/import root.
2. Require the canonical text basename `emma.txt`.
3. Store the normalized repository-relative path `metadata/emma/emma.txt`, using `/` as the persisted separator.
4. Validate that JSON `id`, `slug`, and `sourceFile` agree with the approved slug and derived path.
5. Reject absolute paths, `..` traversal, symlinks escaping the allowed metadata root, or alternate basenames unless a future contract explicitly permits them.

The derivation must use configured directory identity, not unchecked JSON path input.

## 7. Validation rules

### Determinate rules supported by the inspected corpus

Fail the whole import before replacing existing data when any approved book fails validation.

- Approved directory is missing, unreadable, nested unexpectedly, or resolves outside `metadata/`.
- Exactly one slug-matched `.txt` and one slug-matched `.metadata.json` are not present.
- Text is not valid UTF-8, is empty after approved body extraction, contains a BOM/NUL unexpectedly, or cannot be read.
- JSON is missing, unreadable, malformed, has duplicate keys under the chosen JSON parser policy, or is not a top-level object.
- A required field is absent, null, or has the wrong type.
- Count or ordinal fields are not non-negative integers; chapter numbers are not sequential positive integers; IDs/names/titles are empty.
- `id` or `slug` differs from the approved directory slug; `sourceFile` differs from the derived relative text path.
- `chapterCount` differs from `chapters.length`, or book sentence/paragraph totals differ from summed chapter totals.
- IDs duplicate within the relevant book collection (`characters`, `places`, or `chapters`). Book IDs duplicate across approved directories.
- `aliases` is not an array of non-empty strings. Duplicate aliases within one entity should at least be reported; ambiguous aliases across entities must not be treated as a schema failure because they exist in approved data.
- A chapter is empty (`sentenceCount === 0` or `paragraphCount === 0`) or a produced sentence chunk is empty: no approved example establishes whether this is legal, so report it and fail under strict validation pending a decision.
- Parsed chapter, paragraph, or sentence totals differ from metadata: fail atomically and report expected versus actual by book and chapter.
- Line endings may be CRLF or LF after normalization. A mixed-ending file should be reported; whether it is fatal is a policy decision.
- Preserve Unicode punctuation and quotation marks. Do not ASCII-fold or normalize content unless separately approved.

### Rules still requiring policy

- Whether `<slug>.metadata-report.md` is the only permitted extra file, whether arbitrary extra files are ignored, and whether any nested directory is fatal.
- Whether unknown JSON fields are rejected or preserved/ignored.
- Whether all currently universal top-level fields are required, especially redundant `sourceFile` and `slug`.
- Whether empty `aliases` and `notes` are valid (they occur and therefore must be accepted) versus whether empty IDs/names/types/titles are invalid.
- Whether alias comparisons are case-sensitive and/or Unicode-normalized, and how cross-entity collisions affect filtering.
- Exact duplicate-key handling in JSON, since standard `JSON.parse` silently keeps the last duplicate.

## 8. Example normalized book object

This example uses inspected Emma data. `publicationDate` is explicitly unresolved rather than inferred from Gutenberg or edition dates.

```json
{
	"id": "emma",
	"slug": "emma",
	"title": "Emma",
	"author": "Jane Austen",
	"publicationDate": null,
	"gutenbergId": 158,
	"relativeBookPath": "metadata/emma/emma.txt",
	"chapterCount": 55,
	"sentenceCount": 7121,
	"paragraphCount": 2319,
	"characters": [
		{
			"id": "emma-woodhouse",
			"name": "Emma Woodhouse",
			"aliases": ["Emma", "Miss Woodhouse"]
		}
	],
	"places": [
		{
			"id": "highbury",
			"name": "Highbury",
			"type": "village",
			"aliases": [],
			"notes": ""
		}
	],
	"chapters": [
		{
			"id": "chapter-1",
			"number": 1,
			"title": "Volume I, Chapter I",
			"sentenceCount": 158,
			"paragraphCount": 47
		}
	]
}
```

`null` above documents missing source data; it is not a recommendation that the eventual database column accept null.

## 9. Example normalized sentence chunk object

The structure below shows values that the intended parser should produce. The sentence is the opening sentence of Emma, and the ordinals use a clearly labeled one-based convention solely to make the example readable; the project must approve that convention before implementation.

```json
{
	"bookId": "emma",
	"chapterId": "chapter-1",
	"chapterOrdinal": 1,
	"paragraphOrdinalInChapter": 1,
	"sentenceOrdinalInBook": 1,
	"sentenceOrdinalInChapter": 1,
	"sentenceText": "Emma Woodhouse, handsome, clever, and rich, with a comfortable home and happy disposition, seemed to unite some of the best blessings of existence; and had lived nearly twenty-one years in the world with very little to distress or vex her.",
	"relativeBookPath": "metadata/emma/emma.txt"
}
```

This object cannot be generated reliably under the present contract until body boundaries, heading recognition, wrapped-line joining, and tokenization are fixed.

## 10. Inconsistencies and edge cases

- The required book date is absent from all JSON metadata.
- The raw texts are whole Gutenberg editions with materially different front matter and editorial apparatus.
- JSON chapter titles are normalized labels, not exact raw headings. Exact-title matching is unusable for eight books and incomplete/ambiguous for Love and Freindship.
- Emma restarts source chapter numbering across volumes, while JSON uses a sequential 55-record list.
- Lady Susan, Love and Freindship, and The Letters of Jane Austen use chapter records for letters, a conclusion, anthology pieces, or nonfiction correspondence.
- Love and Freindship is an anthology, so a generic `CHAPTER` detector cannot cover it.
- Pride and Prejudice contains decorated/illustrated chapter headings, capitalization and punctuation variation, captions, and production markup.
- Sense and Sensibility and Northanger Abbey include edition-specific introductory/editorial matter that must not be treated as narrative.
- The Letters of Jane Austen retains some in-letter editorial apparatus, dates, addresses, salutations, and signatures; ordinary prose-only assumptions would lose source content.
- Physical wrapping, indentation, lists, verse-like material, captions, and hyphenation prevent blind replacement of every newline with a space.
- Historical punctuation, abbreviations, initials, quotations, ellipses, dashes, and dialogue make sentence boundaries tokenizer-dependent.
- Ambiguous aliases are modeled inconsistently: Pride and Prejudice has `ambiguousAliases`, while several other books place colliding forms directly in `aliases`.
- Place terminology differs from the requirements: JSON calls the collection `places`; requirements also use `locations`.
- Metadata internal counts are consistent, but raw-text agreement is not reproducible from the presently documented algorithm.
- All current text files use CRLF, but the importer should not make semantic output depend on platform line endings.

## 11. Decisions required before importer implementation

1. **Publication date:** identify the authoritative field and granularity (original publication year, full date, edition date, or another value) and add/provide it without treating Gutenberg release dates as publication dates.
2. **Body boundaries:** provide exact per-book start/end anchors or a deterministic classification specification for excluding Gutenberg and edition matter.
3. **Chapter mapping:** provide exact raw heading patterns or source offsets for every chapter-equivalent record, including volumes, letters, anthology works, decorated headings, conclusion, and repeated headings.
4. **Paragraph normalization:** define blank-line handling, line joining, whitespace collapse, indentation, soft hyphenation, lists, verse, letters, and layout markup.
5. **Sentence tokenizer:** freeze the precise algorithm, abbreviation data, Unicode terminal/closing punctuation behavior, ellipsis and interruption handling, and its version. The implementation must reproduce the stored per-chapter counts.
6. **Ordinal semantics:** decide zero- versus one-based ordinals and whether paragraph ordinal is book-wide, chapter-wide, or both. Decide whether headings have any addressable ordinal.
7. **Text preservation:** decide whether sentence text stores normalized spaces only or also needs source offsets/raw paragraph text for exact eReader highlighting.
8. **Schema requiredness:** approve which observed top-level and nested fields are mandatory, and whether unknown fields are allowed.
9. **Path authority:** confirm that the derived `metadata/<slug>/<slug>.txt` path is authoritative and whether redundant JSON `sourceFile` remains required only for validation.
10. **Extra-file policy:** explicitly allow the metadata report and decide how other files and nested directories are handled.
11. **Alias semantics:** decide collision behavior, case/Unicode normalization, use of `ambiguousAliases`, and whether ambiguous aliases should match multiple entities, be excluded, or require a uniform schema migration.
12. **Place naming:** choose the normalized application/database term (`places` or `locations`) while preserving the source JSON field contract.
13. **Failure policy:** confirm that empty chapters/books, mixed line endings, unsupported markup, and every parsed-count mismatch are fatal to the atomic rebuild.

Until items 1–7 are resolved, another developer can implement directory, filename, JSON-shape, path, ID, and internal-count validation, but cannot implement a deterministic source reader that is guaranteed to reproduce the approved sentence chunks and counts.
