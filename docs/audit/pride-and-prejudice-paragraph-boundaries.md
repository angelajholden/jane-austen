# Pride and Prejudice Paragraph Boundary Audit

## Summary

| Measure | Count |
|---|---:|
| Metadata paragraph total | 2,121 |
| Current parser paragraph total | 2,060 |
| Difference | 61 |
| Chapters with a current mismatch | 39 of 61 |
| Chapters detected | 61 of 61 |

The 61-paragraph difference is fully explained by blank-line-separated blocks nested inside Pride and Prejudice illustration containers. The current parser treats each bracket-balanced illustration, including its caption and copyright payload, as one excluded structural region. The stored metadata counts instead match an apparent historical block filter that excluded a blank-separated block only when that block itself began with `[Illustration` or `[_Copyright`, plus a special exclusion for the terminal illustrated `THE END`.

That reconstructed convention counts 60 caption payload blocks and one ununderscored `[Copyright ...]` block as paragraphs. Adding those 61 non-prose units to the current 2,060 retained prose paragraphs reproduces 2,121 exactly. It also reproduces every one of the 61 chapter-level metadata counts, not merely the book total.

No audited mismatch is caused by the current parser merging two blank-line-separated prose blocks. The divergences occur inside excluded illustrations.

## Method

The audit compared the canonical source, metadata chapter totals, current parser output, and every current exclusion. It also evaluated a candidate historical convention against every chapter:

1. Split chapter content into non-empty blocks at one or more blank or whitespace-only lines.
2. Join hard-wrapped physical lines within each block.
3. Exclude blocks beginning with `[Illustration`.
4. Exclude blocks beginning with `[_Copyright` (with the underscore).
5. Exclude the terminal `THE END` block.
6. Count all other blocks, including caption-only blocks nested within a larger illustration and the one `[Copyright ...]` block without an underscore.

This candidate is an audit reconstruction, not a proposed importer rule. It produces:

- total paragraphs: 2,121;
- chapter-level mismatches against metadata: 0;
- current-parser shortfall accounted for: 61 of 61.

The read-only audit can be reproduced with:

```sh
node scripts/audit/pride-and-prejudice-paragraph-boundaries.js
```

The script reads canonical text and metadata and calls the current parser. It does not write source, metadata, parser output, schema, or database files.

## Representative chapter overview

| Chapter | Raw blank-separated blocks | Metadata | Current parser | Difference | Metadata-only units reconstructed inside exclusions |
|---|---:|---:|---:|---:|---:|
| I | 42 | 36 | 34 | 2 | 2 captions |
| II | 31 | 28 | 27 | 1 | 1 caption |
| III | 29 | 23 | 21 | 2 | 2 captions |
| XXVIII | 27 | 23 | 20 | 3 | 2 captions and 1 plain copyright block |
| LXI | 17 | 14 | 14 | 0 | 0 |

“Raw blank-separated blocks” includes prose, illustration openers, caption payloads, copyright payloads, and terminal decoration. It is therefore not itself a paragraph count.

## Chapter I

- Metadata: 36
- Current parser: 34
- Difference: 2
- Current retained prose blocks: 34
- Current excluded illustration containers: 3

The first eight retained paragraphs occupy source lines 699–719. The first inferred numbering divergence occurs in the illustration at lines 721–725:

```text
[Illustration:

“He came down to see the place”

[_Copyright 1894 by George Allen._]]
```

The current parser excludes the complete bracket-balanced container. Under the reconstructed historical convention, the opener and underscored copyright blocks are excluded, but the caption at line 723 is an independent non-empty blank-separated block and is counted. It would occupy metadata position 9. Current paragraph 9, `This was invitation enough.` at line 727, would then occupy reconstructed position 10.

The illustration at lines 817–819 contributes no difference because its caption begins on the same blank-separated block as `[Illustration`:

```text
[Illustration: M^{r.} & M^{rs.} Bennet

[_Copyright 1894 by George Allen._]]
```

The second counted caption payload appears at line 826 inside the illustration at lines 824–828:

```text
[Illustration:

“I hope Mr. Bingley will like it”

[_Copyright 1894 by George Allen._]]
```

The two blank-separated caption payloads account exactly for 36 minus 34. No prose blocks are merged.

## Chapter II

- Metadata: 28
- Current parser: 27
- Difference: 1
- Current retained prose blocks: 27
- Current excluded illustration containers: 3

The standalone `[Illustration]` at line 836 and the single-block caption illustration at line 941 are excluded by both the current and reconstructed conventions. Neither produces a count difference.

The first and only inferred divergence occurs after current paragraph 27, which ends at line 939. The final illustration spans lines 946–949:

```text
[Illustration:

     “He rode a black horse”
]
```

The caption and closing bracket occupy a separate blank-delimited block at lines 948–949. The reconstructed convention counts that block as metadata paragraph 28; the current parser correctly keeps it inside the excluded illustration. This one caption accounts exactly for the chapter difference.

## Chapter III

- Metadata: 23
- Current parser: 21
- Difference: 2
- Current retained prose blocks: 21
- Current excluded illustration containers: 4

The standalone heading illustration at line 957 is excluded under both conventions. The first inferred divergence occurs between current paragraphs 4 and 5, inside lines 994–998:

```text
[Illustration:

     “When the Party entered”

[_Copyright 1894 by George Allen._]]
```

The caption at line 996 is counted by the reconstructed convention. Current paragraph 5 begins at line 1000 and would therefore be reconstructed position 6.

A second caption at line 1069, inside the illustration at lines 1067–1071, accounts for the remaining difference:

```text
[Illustration:

“She is tolerable”

[_Copyright 1894 by George Allen._]]
```

The standalone illustration at line 1140 contributes no difference. The two caption payloads account exactly for 23 minus 21. No dialogue, indentation, or prose-wrap rule is implicated.

## Chapter XXVIII

- Metadata: 23
- Current parser: 20
- Difference: 3
- Raw blank-separated blocks: 27
- Current excluded illustration containers: 3

### All retained paragraph boundaries

The current parser retains every blank-line-separated prose block and joins only hard-wrapped physical lines within each range:

| Current paragraph | Source lines | Opening text |
|---:|---:|---|
| 1 | 6323–6326 | `Every object in the next day’s journey...` |
| 2 | 6328–6331 | `When they left the high road...` |
| 3 | 6333–6349 | `At length the Parsonage was discernible.` |
| 4 | 6351–6378 | `Elizabeth was prepared to see him in his glory...` |
| 5 | 6380–6390 | `From his garden, Mr. Collins would have led them...` |
| 6 | 6392–6394 | `She had already learnt that Lady Catherine...` |
| 7 | 6396–6405 | `“Yes, Miss Elizabeth, you will have the honour...”` |
| 8 | 6407–6408 | `“Lady Catherine is a very respectable...”` |
| 9 | 6410–6411 | `“Very true, my dear...”` |
| 10 | 6413–6421 | `The evening was spent chiefly in talking...` |
| 11 | 6423–6428 | `About the middle of the next day...` |
| 12 | 6436–6438 | `“Oh, my dear Eliza! pray make haste...”` |
| 13 | 6440–6443 | `Elizabeth asked questions in vain...` |
| 14 | 6445–6447 | `“And is this all?” cried Elizabeth.` |
| 15 | 6449–6452 | `“La! my dear,” said Maria...` |
| 16 | 6454–6455 | `“She is abominably rude...”` |
| 17 | 6457–6458 | `“Oh, Charlotte says she hardly ever does.”` |
| 18 | 6460–6462 | `“I like her appearance,” said Elizabeth...` |
| 19 | 6464–6468 | `Mr. Collins and Charlotte were both standing...` |
| 20 | 6470–6474 | `At length there was nothing more to be said...` |

There is no place where the current parser joins two blank-line-separated prose units. In particular, paragraphs 11 and 12 remain distinct on opposite sides of the central illustration.

### Excluded blocks and the three-unit difference

The chapter-opening `[Illustration]` at line 6321 is a standalone structural block and is excluded under both conventions.

The first divergence occurs after current paragraph 11. The illustration at lines 6430–6434 contains three raw blank-separated blocks:

```text
[Illustration:

     “In Conversation with the ladies”

[Copyright 1894 by George Allen.]]
```

The current parser excludes the entire container and then begins paragraph 12 at line 6436, so the illustration cannot merge the surrounding prose. The reconstructed metadata convention counts two units inside it:

1. caption at line 6432;
2. `[Copyright 1894 by George Allen.]]` at line 6434.

The second unit is the corpus’s only copyright payload lacking the usual leading underscore. A filter matching `[_Copyright` excludes the common form but does not exclude this `[Copyright` form. This explains why the earlier block-oriented implementation was still one short in Chapter XXVIII even when it retained captions but excluded both copyright spellings.

The final illustration at lines 6479–6483 is:

```text
[Illustration:

     ‘Lady Catherine, said she, you have given me a treasure.’

[_Copyright 1894 by George Allen._]]
```

The reconstructed convention counts its caption at line 6481 but excludes the opener and underscored copyright blocks. The two central units plus this final caption account exactly for 23 minus 20.

## Chapter LXI control

- Metadata: 14
- Current parser: 14
- Difference: 0
- Raw blank-separated blocks: 17
- Current excluded illustration containers: 2

The current parser retains 14 prose/letter blocks at these ranges:

```text
14423–14432, 14434–14436, 14438–14443, 14445–14453,
14455–14461, 14463–14471, 14473, 14475–14482, 14484,
14486–14507, 14509–14513, 14515–14525, 14527–14538,
14540–14543
```

The indented letter and its visible `/*` production wrapper do not cause a discrepancy. Its salutation, body, and closing remain three blank-separated retained blocks at lines 14473, 14475–14482, and 14484, consistent with metadata.

Two illustrations are excluded:

- chapter-opening `[Illustration]`, line 14421;
- terminal illustration, lines 14545–14549:

```text
[Illustration:

      THE
      END
       ]
```

The terminal `THE END` payload is decorative rather than prose and the metadata report explicitly ends the book at the preceding prose paragraph. Both the current parser and reconstructed metadata convention exclude it. Chapter LXI therefore demonstrates that excluding a complete illustration is valid; the mismatches elsewhere arise because their stored counts appear to include caption payload blocks despite the report saying captions were excluded.

## Pattern analysis

### Pattern 1: blank-separated caption payloads inside illustrations

Pride and Prejudice contains 155 current illustration exclusions. Sixty-five span at least one internal blank line. When those exclusions are viewed as raw blank-separated blocks, they contain:

| Block class | Count | Counted by reconstructed metadata convention? |
|---|---:|---|
| Blocks beginning `[Illustration` | 155 | No |
| Caption-only payload blocks | 60 | Yes |
| Blocks beginning `[_Copyright` | 32 | No |
| Plain `[Copyright` block | 1 | Yes |
| Terminal `THE END` payload | 1 | No |

The 60 caption payloads explain 60 discrepancies. Their source layout makes them independent blank-separated blocks, but they remain semantically nested in a still-open illustration bracket. A stateless block filter counts them; the current bracket-aware parser excludes them.

For every one of the 39 mismatched chapters, the chapter shortfall equals the number of reconstructed metadata-only units inside its current illustration exclusions. Chapters without such units match, including Chapter LXI.

### Pattern 2: one ununderscored copyright payload

Chapter XXVIII line 6434 uses `[Copyright ...]`; the other separately blocked copyright payloads use `[_Copyright ...]`. Counting this one block explains the final one of the 61 differences and makes the reconstructed convention match Chapter XXVIII 23/23.

This is evidence of a narrow historical classification difference, not evidence of a prose paragraph boundary.

### Patterns examined but not causal

The audit found no count difference attributable to:

- indentation changes;
- dialogue formatting;
- letters;
- verse-like or centered prose;
- italics or superscript notation;
- hard-wrapped lines;
- `/*` production markup;
- em-dashes or hyphenated structural breaks;
- short prose blocks;
- a missing chapter boundary.

All selected-chapter prose blocks separated by blank lines remain separate. Every first divergence coincides with a caption or copyright payload nested in a current illustration exclusion.

## Comparison with a matching novel

Sense and Sensibility is the most useful control because it also contains many illustrations:

| Book | Metadata/current paragraphs | Current exclusions | Exclusions spanning internal blank lines | Interior blank-separated blocks |
|---|---:|---:|---:|---:|
| Sense and Sensibility | 1,809/1,809 | 40 | 0 | 0 |
| Pride and Prejudice | 2,121/2,060 | 155 | 65 | 94 |

Sense and Sensibility captions are normally contained in the same blank-separated block as their opener, for example line 535:

```text
[Illustration: _His son's son, a child of four years old._]
```

Even captions hard-wrapped across two physical lines remain in one block because no blank line intervenes. A block-oriented filter and the current bracket-aware parser therefore exclude the same unit. Emma, Mansfield Park, Northanger Abbey, and Persuasion likewise have zero exclusions spanning internal blank lines in the current body content.

The suspect convention is therefore edition-specific: Pride and Prejudice’s illustrated 1894 source uniquely places caption and copyright payloads in separately blank-delimited blocks inside an open bracketed illustration.

## Metadata report assessment

The metadata report states that:

- paragraphs are non-empty prose blocks separated by blank lines after hard wraps are joined;
- standalone illustration and caption blocks are excluded;
- illustration captions and decorative publishing matter are excluded from counts.

The stored counts are **inconsistent with the documented counting rule**. They are reproducible from the current source, but only with the undocumented stateless block convention described above. That convention counts 60 caption payloads and one copyright payload as paragraphs even though none is prose and the report says such material was excluded.

The exact chapter-by-chapter match makes this reconstruction substantially stronger than a coincidence. It does not prove the original implementation’s source code, which is unavailable, but it identifies the effective counting behavior.

## Parser assessment

The current parser is **consistent with the approved paragraph contract**.

It:

- uses blank lines to delimit prose blocks;
- joins only hard-wrapped physical lines within a prose block;
- preserves prose boundaries across excluded content;
- treats a bracket-balanced multiline illustration as one structural exclusion;
- prevents captions, copyright text, and `THE END` decoration from becoming reader/search paragraphs.

Adding a rule that counts nested caption payloads merely because blank lines surround them would contradict the requirements and database design, which explicitly exclude illustration and decorative content. No defensible missing prose-boundary rule was found.

## Recommendation

**Regenerate Pride and Prejudice paragraph metadata from the approved parser** (option 2).

The evidence supports 2,060 retained prose paragraphs under the approved contract. Regeneration should update the book total and the 39 affected chapter totals through a separately authorized metadata job, with review of the generated diff. The parser should not be changed to reproduce the undocumented caption-counting behavior.

This audit does not implement that recommendation.
