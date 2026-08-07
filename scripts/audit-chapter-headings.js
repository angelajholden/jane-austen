import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { bookDirectories } from "../config/books.js";
import { projectRoot } from "../config/database.js";
import {
  detectChapterHeadings,
  detectVolumeHeadings,
  extractBookBody,
} from "./lib/chapter-parser.js";

function parseArguments(argv) {
  const options = {
    book: null,
    all: false,
    metadataRoot: path.join(projectRoot, "metadata"),
    outputDirectory: path.join(projectRoot, "docs", "audit", "chapter-headings"),
    context: 1,
    showVolumes: false,
    consoleReport: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--book") options.book = argv[++index];
    else if (argument === "--all") options.all = true;
    else if (argument === "--metadata-root") {
      options.metadataRoot = path.resolve(argv[++index]);
    } else if (argument === "--output-dir") {
      options.outputDirectory = path.resolve(argv[++index]);
    } else if (argument === "--context") {
      options.context = Number.parseInt(argv[++index], 10);
    } else if (argument === "--show-volumes") options.showVolumes = true;
    else if (argument === "--no-console-report") options.consoleReport = false;
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (Boolean(options.book) === Boolean(options.all)) {
    throw new Error("Specify exactly one of --book <slug> or --all.");
  }
  if (!Number.isInteger(options.context) || options.context < 0) {
    throw new Error("--context must be a non-negative integer.");
  }

  return options;
}

function nonEmptyContext(lines, lineIndex, direction, count, lower, upper) {
  const collected = [];
  let cursor = lineIndex + direction;

  while (cursor >= lower && cursor < upper && collected.length < count) {
    const text = lines[cursor].trim();
    if (text) {
      if (direction < 0) collected.unshift(text);
      else collected.push(text);
    }
    cursor += direction;
  }

  return collected;
}

function candidateMarkdown(candidate, chapter, extracted, contextCount) {
  const lines = [
    `### Candidate ${chapter.number}`,
    "",
    `- **Source line:** ${candidate.lineNumber}`,
    `- **Detection rule:** \`${candidate.patternName}\``,
    `- **Proposed chapter ID:** \`${chapter.id}\``,
    `- **Metadata title:** ${chapter.title}`,
    "",
    "```text",
    candidate.text,
    "```",
  ];

  const before = nonEmptyContext(
    extracted.lines,
    candidate.lineIndex,
    -1,
    contextCount,
    extracted.bodyStartIndex,
    extracted.bodyEndIndex,
  );
  const after = nonEmptyContext(
    extracted.lines,
    candidate.lineIndex,
    1,
    contextCount,
    extracted.bodyStartIndex,
    extracted.bodyEndIndex,
  );

  if (before.length) lines.push("", "**Context before**", "", "```text", ...before, "```");
  if (after.length) lines.push("", "**Context after**", "", "```text", ...after, "```");
  lines.push("");
  return lines;
}

function auditBook(slug, options) {
  const directory = path.join(options.metadataRoot, slug);
  const textPath = path.join(directory, `${slug}.txt`);
  const metadataPath = path.join(directory, `${slug}.metadata.json`);

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    if (!Array.isArray(metadata.chapters)) {
      throw new Error("metadata chapters must be an array");
    }
    const text = fs.readFileSync(textPath, "utf8");
    const extracted = extractBookBody(text, textPath);
    const candidates = detectChapterHeadings(
      extracted.lines,
      extracted.bodyStartIndex,
      extracted.bodyEndIndex,
    );
    const matches = candidates.length === metadata.chapters.length;
    const report = [
      `# ${metadata.title ?? slug} Chapter Heading Audit`,
      "",
      "## Summary",
      "",
      `- **Book slug:** \`${slug}\``,
      `- **Text file:** \`${path.relative(projectRoot, textPath)}\``,
      `- **Metadata file:** \`${path.relative(projectRoot, metadataPath)}\``,
      `- **Book body starts:** source line ${extracted.bodyStartIndex + 1}`,
      `- **Book body ends:** source line ${extracted.bodyEndIndex}`,
      `- **Expected chapters:** ${metadata.chapters.length}`,
      `- **Detected headings:** ${candidates.length}`,
      `- **Count matches:** ${matches ? "Yes" : "No"}`,
      `- **Result:** ${matches ? "PASS" : "REVIEW REQUIRED"}`,
      "",
      "## Likely Chapter Headings",
      "",
    ];

    if (matches) {
      for (const [index, candidate] of candidates.entries()) {
        report.push(
          ...candidateMarkdown(
            candidate,
            metadata.chapters[index],
            extracted,
            options.context,
          ),
        );
      }
    } else {
      report.push("Detected headings do not map one-to-one to metadata; no IDs assigned.", "");
    }

    if (options.showVolumes) {
      const volumes = detectVolumeHeadings(
        extracted.lines,
        extracted.bodyStartIndex,
        extracted.bodyEndIndex,
      );
      report.push("## Volume Headings", "");
      for (const volume of volumes) {
        report.push(`- Source line ${volume.lineNumber}: ${volume.text}`);
      }
      report.push("");
    }

    return {
      slug,
      expected: metadata.chapters.length,
      detected: candidates.length,
      matches,
      error: null,
      report: `${report.join("\n").trim()}\n`,
    };
  } catch (error) {
    return {
      slug,
      expected: 0,
      detected: 0,
      matches: false,
      error: error.message,
      report: `# ${slug} Chapter Heading Audit\n\n## Result\n\n**ERROR**\n\n\`\`\`text\n${error.message}\n\`\`\`\n`,
    };
  }
}

function summaryMarkdown(results) {
  const passed = results.filter((result) => result.matches && !result.error).length;
  const errors = results.filter((result) => result.error).length;
  const review = results.length - passed - errors;
  const lines = [
    "# Chapter Heading Audit Summary",
    "",
    "## Totals",
    "",
    `- **Books audited:** ${results.length}`,
    `- **Passed:** ${passed}`,
    `- **Review required:** ${review}`,
    `- **Errors:** ${errors}`,
    "",
    "## Books",
    "",
    "| Book | Expected | Detected | Result | Report |",
    "|---|---:|---:|---|---|",
  ];
  for (const result of results) {
    const status = result.error ? "ERROR" : result.matches ? "PASS" : "REVIEW REQUIRED";
    lines.push(
      `| \`${result.slug}\` | ${result.expected} | ${result.detected} | ${status} | [Open report](${result.slug}-chapter-audit.md) |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

export function runChapterAudit(options) {
  const slugs = options.book ? [options.book] : bookDirectories;
  fs.mkdirSync(options.outputDirectory, { recursive: true });
  const results = slugs.map((slug) => auditBook(slug, options));

  for (const result of results) {
    const reportPath = path.join(
      options.outputDirectory,
      `${result.slug}-chapter-audit.md`,
    );
    fs.writeFileSync(reportPath, result.report, "utf8");
    if (options.consoleReport) process.stdout.write(`${result.report}\n`);
    console.log(`Wrote report: ${reportPath}`);
  }

  const summaryPath = path.join(options.outputDirectory, "chapter-audit-summary.md");
  fs.writeFileSync(summaryPath, summaryMarkdown(results), "utf8");
  console.log(`Summary: ${summaryPath}`);
  return results.every((result) => result.matches && !result.error) ? 0 : 1;
}

const isCommandLineEntry =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCommandLineEntry) {
  try {
    process.exitCode = runChapterAudit(parseArguments(process.argv.slice(2)));
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}
