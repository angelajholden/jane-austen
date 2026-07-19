# The Letters of Jane Austen metadata report

## Summary

- Letters: **78**
- Sentences: **3,954**
- Paragraphs: **1,320**
- Person entries in the character schema: **36**
- Place entries: **40**

## Section detection

This is an edited nonfiction letter collection, not a novel. Its 78 consecutive Roman-numbered letters are represented as chapter-equivalent sections so the requested schema remains usable. The compiler’s preface, title matter, editorial front matter, transcriber’s notes, and Gutenberg boilerplate are excluded. The body runs from Letter I through Letter LXXVIII with no numbering gap.

## Counting uncertainty

Blank-line-separated blocks within each letter are paragraphs after wrapped lines are joined. Dates, addresses, salutations, signatures, and editorial footnotes located inside letter sections remain part of their section because the edition presents them as integral letter apparatus. Sentence segmentation uses terminal punctuation with common abbreviations, initials, and decimal points protected. Lists, postscripts, abbreviations, dashes, and editorial notes mean a different tokenizer can produce different totals.

## People and alias ambiguity

The novel-oriented `characters` field is used for real named people who write, receive, or appear in the letters. Austen’s family repeatedly reused names such as Edward, Elizabeth, Mary, and Cassandra, and forms such as “Miss Austen” can change referent by context. Only principal and recurring people are listed conservatively; automated alias matching should be manually reviewed.

## Place uncertainty

Residences, villages, streets, theatres, counties, countries, and travel destinations are represented together under the place schema. Some residence names and place references change over the date range. No modern coordinates or addresses were inferred.

## Gutenberg formatting and manual review

The source includes compiler material, editorial footnotes, typographic small capitals, superscript transcription notation, and a final transcriber correction list. Front and back editorial matter were excluded; in-letter editorial apparatus was retained. An exhaustive prosopographical index would require dedicated historical disambiguation beyond this factual book-level metadata job. No source text was modified.

