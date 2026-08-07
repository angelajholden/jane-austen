export const BOOK_START_MARKER = "[[BOOK_START]]";
export const BOOK_END_MARKER = "[[BOOK_END]]";

const ROMAN_OR_ARABIC = "(?:[IVXLCDM]+|\\d+)";

export const STANDARD_CHAPTER_PATTERN = new RegExp(
  `^\\s*CHAPTER\\s+${ROMAN_OR_ARABIC}[.\\s]*$`,
  "i",
);

const VOLUME_PATTERN = /^\s*VOLUME\s+[IVXLCDM]+[.\s]*$/i;

export function normalizeLineEndings(text) {
  return text.replace(/\r\n?/g, "\n");
}

function markerIndexes(lines, marker) {
  const indexes = [];

  for (const [index, line] of lines.entries()) {
    if (line.trim() === marker) {
      indexes.push(index);
    }
  }

  return indexes;
}

export function extractBookBody(text, sourceLabel = "book text") {
  const normalizedText = normalizeLineEndings(text);
  const lines = normalizedText.split("\n");
  const starts = markerIndexes(lines, BOOK_START_MARKER);
  const ends = markerIndexes(lines, BOOK_END_MARKER);

  if (starts.length !== 1) {
    throw new Error(
      `${sourceLabel}: expected exactly one ${BOOK_START_MARKER} marker; found ${starts.length}`,
    );
  }

  if (ends.length !== 1) {
    throw new Error(
      `${sourceLabel}: expected exactly one ${BOOK_END_MARKER} marker; found ${ends.length}`,
    );
  }

  if (starts[0] >= ends[0]) {
    throw new Error(
      `${sourceLabel}: ${BOOK_START_MARKER} must precede ${BOOK_END_MARKER}`,
    );
  }

  return {
    normalizedText,
    lines,
    bodyStartIndex: starts[0] + 1,
    bodyEndIndex: ends[0],
    bodyLines: lines.slice(starts[0] + 1, ends[0]),
  };
}

export function isChapterHeading(line) {
  return STANDARD_CHAPTER_PATTERN.test(line);
}

export function detectChapterHeadings(lines, bodyStartIndex, bodyEndIndex) {
  const headings = [];

  for (let index = bodyStartIndex; index < bodyEndIndex; index += 1) {
    if (isChapterHeading(lines[index])) {
      headings.push({
        lineIndex: index,
        lineNumber: index + 1,
        text: lines[index].trim(),
        patternName: /\d/.test(lines[index])
          ? "chapter-arabic"
          : "chapter-roman",
      });
    }
  }

  return headings;
}

export function detectVolumeHeadings(lines, bodyStartIndex, bodyEndIndex) {
  const headings = [];

  for (let index = bodyStartIndex; index < bodyEndIndex; index += 1) {
    if (VOLUME_PATTERN.test(lines[index])) {
      headings.push({
        lineIndex: index,
        lineNumber: index + 1,
        text: lines[index].trim(),
        patternName: "volume",
      });
    }
  }

  return headings;
}

export function mapChapterSections(extractedBody, metadataChapters, sourceLabel) {
  const headings = detectChapterHeadings(
    extractedBody.lines,
    extractedBody.bodyStartIndex,
    extractedBody.bodyEndIndex,
  );

  if (headings.length !== metadataChapters.length) {
    throw new Error(
      `${sourceLabel}: detected ${headings.length} chapter headings; metadata defines ${metadataChapters.length}`,
    );
  }

  return headings.map((heading, index) => {
    const nextHeading = headings[index + 1];

    return {
      ...heading,
      metadata: metadataChapters[index],
      ordinal: index + 1,
      contentLines: extractedBody.lines.slice(
        heading.lineIndex + 1,
        nextHeading?.lineIndex ?? extractedBody.bodyEndIndex,
      ),
    };
  });
}
