# Pride and Prejudice metadata report

## Summary

- Source: `books/pride-and-prejudice.txt`
- Chapters: **61**
- Sentences: **5,899**
- Paragraphs: **2,121**
- Named character entries: **48**
- Named place entries: **49**

## Counting method and uncertainty

The novel begins with the prose following the decorated `Chapter I.]` heading and ends with the final prose paragraph of Chapter LXI. The preface, title matter, contents, illustration list, illustration captions, printer colophons, Gutenberg header/footer, and Gutenberg license are excluded.

All 61 chapter headings were detected directly in the source. They run consecutively from Roman numeral I through LXI, so there is no chapter-count discrepancy. The first and forty-sixth headings use mixed-case `Chapter`; the others use uppercase `CHAPTER`. Several headings omit or vary terminal punctuation, but their numbering is unambiguous. JSON chapter titles use the requested normalized form “Chapter 1” through “Chapter 61”; the source supplies numbers, not descriptive chapter titles.

A paragraph is a non-empty prose block separated by one or more blank lines after wrapped lines are joined. Standalone illustration/caption blocks and decorative publishing matter are not paragraphs. Indented letters remain part of the novel and are counted according to their blank-line-separated blocks.

Sentence counts use a deterministic punctuation-based segmentation after joining wrapped lines: terminal periods, question marks, and exclamation marks close sentences, while common honorific abbreviations (such as `Mr.` and `Mrs.`), initials, and decimal points do not. Dialogue punctuation and typographic closing quotation marks are respected. Because the source contains eighteenth-/nineteenth-century punctuation, semicolon-heavy prose, interrupted dialogue, editorial markup, and letters, a different linguistic sentence tokenizer may produce slightly different totals. These counts should therefore be treated as reproducible editorial counts, not as the only possible linguistic interpretation.

## Character and alias ambiguity

- `Miss Bennet` is inherently context-dependent. It most often denotes Jane as the eldest unmarried Bennet daughter, but can denote Elizabeth or another Bennet daughter in some contexts. It is stored in `ambiguousAliases`, not treated as an exclusive alias.
- Surname-only family references such as `the Bennets`, `the Gardiners`, `the Lucases`, and `the Bingleys` are not assigned to one individual.
- `Mrs. Darcy`, `Mrs. Bingley`, and `Mrs. Wickham` can reflect married names at different points in the narrative. Only the text-supported unambiguous married form `Mrs. Wickham` is included as an alias; contextual post-marriage references to Mrs. Darcy and Mrs. Bingley should be reviewed if alias matching will ignore chronology.
- `her Ladyship` is included for Lady Catherine because it is repeatedly used in her immediate context, but it is a contextual form of address rather than a globally unique name.
- Minor named people mentioned briefly are included where the text gives a stable name. Unnamed servants, officers, children, and other generic persons are excluded.

## Place uncertainty

- `Pemberley`, `Netherfield`, and `Rosings` can refer to an estate, its principal house, or the household by metonymy. The entries use their dominant property sense; Pemberley House is also recorded separately because the text clearly distinguishes the house during the visit.
- `Hunsford Parsonage` is a descriptive normalized label for the Collins residence; the text also calls it the parsonage or parsonage-house.
- `the Lakes` and `the Peak` are regional labels rather than sharply bounded administrative places.
- The source mentions an unnamed “town of ----” and other deliberately unnamed destinations. These are excluded because the job requires named or clearly identifiable places.
- The Bell at Bromley is identifiable as an inn from the immediate travel context, although the text uses only “the Bell.”

## Gutenberg and edition formatting issues

This Gutenberg text reproduces an illustrated 1894 George Allen edition. Chapter I is embedded in an illustration heading, and many illustrations interrupt prose between blank-line blocks. Decorative brackets, italic markers, superscript notation, copyright captions, and printer matter are present. One letter includes visible production markup (`/*` and alignment text). Those elements were excluded from counts when they were standalone editorial matter; the words of letters and other narrative content were retained.

## Manual review recommended

- Re-run the same documented counting convention if the source file is replaced, because Gutenberg states that updated editions may replace earlier files.
- Manually review ambiguous title matching before using aliases for automatic entity linking.
- Manually review estate-versus-house place matches where an application needs that distinction.
- If counts must match a third-party edition or tokenizer, agree on its sentence and paragraph rules first and compare chapter by chapter.
