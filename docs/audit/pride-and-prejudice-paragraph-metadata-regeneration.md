# Pride and Prejudice Paragraph Metadata Regeneration

## Summary

- Previous book paragraph total: **2,121**
- Regenerated book paragraph total: **2,060**
- Difference: **-61**
- Total chapters: **61**
- Changed chapters: **39**
- Unchanged chapters: **22**
- Parser authority: the production chapter mapper in `scripts/lib/chapter-parser.js` and the approved bracket-aware paragraph parser in `scripts/lib/book-parser.js`.

Replacement values were derived from the canonical source with the current production parsers. Historical metadata counts were used only for the before/after comparison.

## Chapter changes

| Chapter | Previous paragraphCount | Regenerated paragraphCount | Difference |
| ---: | ---: | ---: | ---: |
| 1 | 36 | 34 | -2 |
| 2 | 28 | 27 | -1 |
| 3 | 23 | 21 | -2 |
| 6 | 55 | 54 | -1 |
| 7 | 51 | 49 | -2 |
| 8 | 60 | 59 | -1 |
| 10 | 68 | 66 | -2 |
| 14 | 19 | 18 | -1 |
| 16 | 62 | 60 | -2 |
| 18 | 79 | 77 | -2 |
| 20 | 36 | 35 | -1 |
| 22 | 22 | 20 | -2 |
| 23 | 26 | 25 | -1 |
| 25 | 22 | 20 | -2 |
| 26 | 31 | 30 | -1 |
| 27 | 24 | 23 | -1 |
| 28 | 23 | 20 | -3 |
| 30 | 16 | 13 | -3 |
| 34 | 32 | 31 | -1 |
| 36 | 16 | 14 | -2 |
| 37 | 22 | 20 | -2 |
| 38 | 19 | 17 | -2 |
| 40 | 37 | 35 | -2 |
| 41 | 42 | 40 | -2 |
| 42 | 19 | 18 | -1 |
| 44 | 20 | 18 | -2 |
| 46 | 34 | 32 | -2 |
| 47 | 75 | 74 | -1 |
| 48 | 36 | 35 | -1 |
| 49 | 57 | 55 | -2 |
| 50 | 24 | 23 | -1 |
| 51 | 41 | 40 | -1 |
| 52 | 40 | 39 | -1 |
| 53 | 61 | 60 | -1 |
| 54 | 37 | 35 | -2 |
| 56 | 78 | 76 | -2 |
| 57 | 22 | 21 | -1 |
| 58 | 47 | 46 | -1 |
| 59 | 49 | 48 | -1 |

## Unchanged chapters

The following 22 chapters already matched the approved parser and were not changed: 4, 5, 9, 11, 12, 13, 15, 17, 19, 21, 24, 29, 31, 32, 33, 35, 39, 43, 45, 55, 60, 61.

## Validation

- Sum of regenerated chapter counts: **2,060**
- Top-level regenerated `paragraphCount`: **2,060**
- Chapter sum and top-level total agree: **yes**
- All 61 chapters detected: **yes**
- Prompt 4C 39 changed / 22 unchanged split reproduced: **yes**
- Changed chapter set reproduced: **yes**
- Non-paragraph metadata fields changed: **no**
- Chapter IDs, numbers, and titles changed: **no**
- Sentence counts changed: **no**
- Character or location metadata changed: **no**

## File modifications

- `metadata/pride-and-prejudice/pride-and-prejudice.metadata.json`
- `metadata/pride-and-prejudice/pride-and-prejudice.metadata-report.md`
- `docs/audit/pride-and-prejudice-paragraph-metadata-regeneration.md`
- `scripts/metadata/regenerate-pride-and-prejudice-paragraph-counts.js`
- `tests/metadata-regeneration.test.js`

The canonical text, production parsers, Prompt 4C audit report, schema, other books' metadata, and database were not modified.
