#!/usr/bin/env python3

"""
Audit likely chapter headings in Jane Austen source files and write Markdown reports.

This script is read-only with respect to the canonical source files. It does not
modify text files, metadata JSON, or any other project source files.

Examples:

    python3 scripts/audit-chapter-headings.py --book emma

    python3 scripts/audit-chapter-headings.py --book pride-and-prejudice

    python3 scripts/audit-chapter-headings.py --all

    python3 scripts/audit-chapter-headings.py --all --context 2

By default, reports are written to:

    docs/audit/chapter-headings/
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Pattern


BOOK_START_MARKER = "[[BOOK_START]]"
BOOK_END_MARKER = "[[BOOK_END]]"


@dataclass(frozen=True)
class HeadingCandidate:
    line_number: int
    text: str
    pattern_name: str
    context_before: tuple[str, ...]
    context_after: tuple[str, ...]


@dataclass(frozen=True)
class DetectionRule:
    name: str
    pattern: Pattern[str]


@dataclass(frozen=True)
class BookAuditResult:
    slug: str
    expected_count: int
    detected_count: int
    count_matches: bool
    report_path: Path
    error: str | None = None


ROMAN_NUMERAL = r"[IVXLCDM]+"
ARABIC_NUMBER = r"\d+"

STANDARD_CHAPTER_RULES = (
    DetectionRule(
        name="chapter-roman",
        pattern=re.compile(
            rf"^\s*CHAPTER\s+{ROMAN_NUMERAL}[.\s]*$",
            re.IGNORECASE,
        ),
    ),
    DetectionRule(
        name="chapter-arabic",
        pattern=re.compile(
            rf"^\s*CHAPTER\s+{ARABIC_NUMBER}[.\s]*$",
            re.IGNORECASE,
        ),
    ),
)

LETTER_RULES = (
    DetectionRule(
        name="letter-roman",
        pattern=re.compile(
            rf"^\s*LETTER\s+{ROMAN_NUMERAL}[.\s]*$",
            re.IGNORECASE,
        ),
    ),
    DetectionRule(
        name="letter-arabic",
        pattern=re.compile(
            rf"^\s*LETTER\s+{ARABIC_NUMBER}[.\s]*$",
            re.IGNORECASE,
        ),
    ),
)

CONCLUSION_RULE = DetectionRule(
    name="conclusion",
    pattern=re.compile(r"^\s*CONCLUSION[.\s]*$", re.IGNORECASE),
)

VOLUME_RULE = DetectionRule(
    name="volume",
    pattern=re.compile(
        rf"^\s*VOLUME\s+{ROMAN_NUMERAL}[.\s]*$",
        re.IGNORECASE,
    ),
)

ANTHOLOGY_RULES = (
    *STANDARD_CHAPTER_RULES,
    *LETTER_RULES,
    CONCLUSION_RULE,
    DetectionRule(
        name="standalone-uppercase-heading",
        pattern=re.compile(r"^\s*[A-Z][A-Z0-9 '&,\-]{2,80}[.!?]?\s*$"),
    ),
)

BOOK_RULES: dict[str, tuple[DetectionRule, ...]] = {
    "emma": STANDARD_CHAPTER_RULES,
    "mansfield-park": STANDARD_CHAPTER_RULES,
    "northanger-abbey": STANDARD_CHAPTER_RULES,
    "persuasion": STANDARD_CHAPTER_RULES,
    "pride-and-prejudice": STANDARD_CHAPTER_RULES,
    "sense-and-sensibility": STANDARD_CHAPTER_RULES,
    "lady-susan": (*LETTER_RULES, CONCLUSION_RULE),
    "the-letters-of-jane-austen": LETTER_RULES,
    "love-and-freindship": ANTHOLOGY_RULES,
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Read-only audit of likely chapter headings in approved Jane Austen "
            "source files, with Markdown report output."
        )
    )

    selection = parser.add_mutually_exclusive_group(required=True)
    selection.add_argument(
        "--book",
        help="Audit one approved book directory slug.",
    )
    selection.add_argument(
        "--all",
        action="store_true",
        help="Audit every configured book directory.",
    )

    parser.add_argument(
        "--metadata-root",
        type=Path,
        default=Path("metadata"),
        help="Metadata directory root. Default: metadata",
    )

    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("docs/audit/chapter-headings"),
        help=(
            "Directory for generated Markdown reports. "
            "Default: docs/audit/chapter-headings"
        ),
    )

    parser.add_argument(
        "--context",
        type=int,
        default=1,
        help="Number of non-empty context lines shown before and after a match.",
    )

    parser.add_argument(
        "--show-volumes",
        action="store_true",
        help=(
            "Also report standalone VOLUME headings. Volume headings are not "
            "counted as chapters."
        ),
    )

    parser.add_argument(
        "--no-console-report",
        action="store_true",
        help="Write reports to files without printing full report contents.",
    )

    return parser.parse_args()


def load_json(path: Path) -> dict[str, Any]:
    try:
        with path.open("r", encoding="utf-8") as file:
            data = json.load(file)
    except FileNotFoundError as error:
        raise ValueError(f"Metadata JSON does not exist: {path}") from error
    except json.JSONDecodeError as error:
        raise ValueError(
            f"Metadata JSON is malformed: {path}\n"
            f"Line {error.lineno}, column {error.colno}: {error.msg}"
        ) from error

    if not isinstance(data, dict):
        raise ValueError(f"Metadata JSON must contain an object: {path}")

    return data


def load_text_lines(path: Path) -> list[str]:
    try:
        text = path.read_text(encoding="utf-8-sig")
    except FileNotFoundError as error:
        raise ValueError(f"Book text does not exist: {path}") from error
    except UnicodeDecodeError as error:
        raise ValueError(f"Book text is not valid UTF-8: {path}") from error

    return text.splitlines()


def find_unique_marker(lines: list[str], marker: str, path: Path) -> int:
    indexes = [
        index
        for index, line in enumerate(lines)
        if line.strip() == marker
    ]

    if not indexes:
        raise ValueError(f"Missing {marker} marker in {path}")

    if len(indexes) > 1:
        line_numbers = ", ".join(str(index + 1) for index in indexes)
        raise ValueError(
            f"Found multiple {marker} markers in {path}: lines {line_numbers}"
        )

    return indexes[0]


def get_body_range(lines: list[str], path: Path) -> tuple[int, int]:
    start_index = find_unique_marker(lines, BOOK_START_MARKER, path)
    end_index = find_unique_marker(lines, BOOK_END_MARKER, path)

    if end_index <= start_index:
        raise ValueError(
            f"{BOOK_END_MARKER} appears before {BOOK_START_MARKER} in {path}"
        )

    return start_index + 1, end_index


def non_empty_context(
    lines: list[str],
    index: int,
    direction: int,
    count: int,
    lower_bound: int,
    upper_bound: int,
) -> tuple[str, ...]:
    if count <= 0:
        return ()

    collected: list[str] = []
    cursor = index + direction

    while lower_bound <= cursor < upper_bound and len(collected) < count:
        stripped = lines[cursor].strip()

        if stripped:
            if direction < 0:
                collected.insert(0, stripped)
            else:
                collected.append(stripped)

        cursor += direction

    return tuple(collected)


def detect_candidates(
    lines: list[str],
    body_start: int,
    body_end: int,
    rules: tuple[DetectionRule, ...],
    context_count: int,
) -> list[HeadingCandidate]:
    candidates: list[HeadingCandidate] = []

    for index in range(body_start, body_end):
        text = lines[index].strip()

        if not text:
            continue

        for rule in rules:
            if rule.pattern.fullmatch(text):
                candidates.append(
                    HeadingCandidate(
                        line_number=index + 1,
                        text=text,
                        pattern_name=rule.name,
                        context_before=non_empty_context(
                            lines=lines,
                            index=index,
                            direction=-1,
                            count=context_count,
                            lower_bound=body_start,
                            upper_bound=body_end,
                        ),
                        context_after=non_empty_context(
                            lines=lines,
                            index=index,
                            direction=1,
                            count=context_count,
                            lower_bound=body_start,
                            upper_bound=body_end,
                        ),
                    )
                )
                break

    return candidates


def validate_metadata(
    metadata: dict[str, Any],
    slug: str,
    metadata_path: Path,
) -> list[dict[str, Any]]:
    errors: list[str] = []

    if metadata.get("id") != slug:
        errors.append(
            f'JSON id must equal directory slug "{slug}", '
            f'found {metadata.get("id")!r}'
        )

    if metadata.get("slug") != slug:
        errors.append(
            f'JSON slug must equal directory slug "{slug}", '
            f'found {metadata.get("slug")!r}'
        )

    chapters = metadata.get("chapters")

    if not isinstance(chapters, list):
        errors.append('JSON field "chapters" must be an array')
        chapters = []

    chapter_count = metadata.get("chapterCount")

    if not isinstance(chapter_count, int):
        errors.append('JSON field "chapterCount" must be an integer')
    elif chapter_count != len(chapters):
        errors.append(
            f"chapterCount is {chapter_count}, but chapters contains "
            f"{len(chapters)} records"
        )

    for index, chapter in enumerate(chapters, start=1):
        if not isinstance(chapter, dict):
            errors.append(f"Chapter {index} must be an object")
            continue

        chapter_id = chapter.get("id")
        chapter_number = chapter.get("number")
        chapter_title = chapter.get("title")

        if not isinstance(chapter_id, str) or not chapter_id.strip():
            errors.append(f"Chapter {index} has an invalid id")

        if chapter_number != index:
            errors.append(
                f"Chapter {index} has number {chapter_number!r}; expected {index}"
            )

        if not isinstance(chapter_title, str) or not chapter_title.strip():
            errors.append(f"Chapter {index} has an invalid title")

    if errors:
        formatted = "\n".join(f"  - {error}" for error in errors)
        raise ValueError(
            f"Metadata validation failed for {metadata_path}:\n{formatted}"
        )

    return chapters


def code_block(text: str) -> list[str]:
    return ["```text", text, "```"]


def build_candidate_section(
    candidate: HeadingCandidate,
    candidate_number: int,
    chapter: dict[str, Any] | None,
) -> list[str]:
    lines = [
        f"### Candidate {candidate_number}",
        "",
        f"- **Source line:** {candidate.line_number}",
        f"- **Detection rule:** `{candidate.pattern_name}`",
    ]

    if chapter is not None:
        lines.extend(
            [
                f"- **Proposed chapter ID:** `{chapter['id']}`",
                f"- **Metadata title:** {chapter['title']}",
                f"- **Proposed marker:** `[[CHAPTER:{chapter['id']}]]`",
            ]
        )

    lines.extend(["", "**Detected heading**", ""])
    lines.extend(code_block(candidate.text))

    if candidate.context_before:
        lines.extend(["", "**Context before**", ""])
        lines.extend(code_block("\n".join(candidate.context_before)))

    if candidate.context_after:
        lines.extend(["", "**Context after**", ""])
        lines.extend(code_block("\n".join(candidate.context_after)))

    lines.extend(["", "---", ""])
    return lines


def build_book_report(
    slug: str,
    metadata_root: Path,
    context_count: int,
    show_volumes: bool,
) -> tuple[str, int, int, bool, str | None]:
    directory = metadata_root / slug
    text_path = directory / f"{slug}.txt"
    metadata_path = directory / f"{slug}.metadata.json"

    try:
        metadata = load_json(metadata_path)
        chapters = validate_metadata(metadata, slug, metadata_path)
        lines = load_text_lines(text_path)
        body_start, body_end = get_body_range(lines, text_path)
    except ValueError as error:
        report = "\n".join(
            [
                f"# {slug} Chapter Heading Audit",
                "",
                "## Result",
                "",
                "**ERROR**",
                "",
                "```text",
                str(error),
                "```",
                "",
            ]
        )
        return report, 0, 0, False, str(error)

    rules = BOOK_RULES.get(slug, STANDARD_CHAPTER_RULES)

    candidates = detect_candidates(
        lines=lines,
        body_start=body_start,
        body_end=body_end,
        rules=rules,
        context_count=context_count,
    )

    volume_candidates: list[HeadingCandidate] = []

    if show_volumes:
        volume_candidates = detect_candidates(
            lines=lines,
            body_start=body_start,
            body_end=body_end,
            rules=(VOLUME_RULE,),
            context_count=context_count,
        )

    expected_count = len(chapters)
    detected_count = len(candidates)
    count_matches = expected_count == detected_count

    report_lines = [
        f"# {metadata.get('title', slug)} Chapter Heading Audit",
        "",
        "## Summary",
        "",
        f"- **Book slug:** `{slug}`",
        f"- **Text file:** `{text_path.as_posix()}`",
        f"- **Metadata file:** `{metadata_path.as_posix()}`",
        f"- **Book body starts:** source line {body_start + 1}",
        f"- **Book body ends:** source line {body_end}",
        f"- **Expected chapters:** {expected_count}",
        f"- **Detected headings:** {detected_count}",
        f"- **Count matches:** {'Yes' if count_matches else 'No'}",
        f"- **Result:** {'PASS' if count_matches else 'REVIEW REQUIRED'}",
        "",
    ]

    if count_matches:
        report_lines.extend(
            [
                "> The detected headings have a one-to-one sequential mapping "
                "to the metadata chapter records.",
                "",
            ]
        )
    else:
        difference = detected_count - expected_count

        if difference > 0:
            explanation = (
                f"The detector found {difference} more candidate heading(s) "
                "than the metadata defines."
            )
        elif difference < 0:
            explanation = (
                f"The detector found {abs(difference)} fewer candidate "
                "heading(s) than the metadata defines."
            )
        else:
            explanation = "The detected headings require manual review."

        report_lines.extend(
            [
                f"> {explanation}",
                "> No chapter IDs are assigned below because the candidate list "
                "does not have a verified one-to-one relationship with metadata.",
                "",
            ]
        )

    report_lines.extend(["## Likely Chapter Headings", ""])

    if not candidates:
        report_lines.extend(["No likely chapter headings were detected.", ""])
    else:
        for index, candidate in enumerate(candidates):
            chapter = chapters[index] if count_matches else None
            report_lines.extend(
                build_candidate_section(
                    candidate=candidate,
                    candidate_number=index + 1,
                    chapter=chapter,
                )
            )

    if show_volumes:
        report_lines.extend(["## Volume Headings", ""])

        if not volume_candidates:
            report_lines.extend(["No standalone volume headings were detected.", ""])
        else:
            report_lines.extend(
                [
                    "These headings are reported separately and are not counted "
                    "as chapters.",
                    "",
                ]
            )

            for index, candidate in enumerate(volume_candidates, start=1):
                report_lines.extend(
                    build_candidate_section(
                        candidate=candidate,
                        candidate_number=index,
                        chapter=None,
                    )
                )

    return (
        "\n".join(report_lines).rstrip() + "\n",
        expected_count,
        detected_count,
        count_matches,
        None,
    )


def discover_books(metadata_root: Path) -> list[str]:
    return sorted(
        slug
        for slug in BOOK_RULES
        if (metadata_root / slug).is_dir()
    )


def write_report(path: Path, report_text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(report_text, encoding="utf-8")


def build_summary_report(results: list[BookAuditResult]) -> str:
    passed = sum(1 for result in results if result.count_matches and not result.error)
    errors = sum(1 for result in results if result.error)
    review_required = len(results) - passed - errors

    lines = [
        "# Chapter Heading Audit Summary",
        "",
        "## Totals",
        "",
        f"- **Books audited:** {len(results)}",
        f"- **Passed:** {passed}",
        f"- **Review required:** {review_required}",
        f"- **Errors:** {errors}",
        "",
        "## Books",
        "",
        "| Book | Expected | Detected | Result | Report |",
        "| --- | ---: | ---: | --- | --- |",
    ]

    for result in results:
        if result.error:
            status = "ERROR"
        elif result.count_matches:
            status = "PASS"
        else:
            status = "REVIEW REQUIRED"

        lines.append(
            f"| `{result.slug}` | {result.expected_count} | "
            f"{result.detected_count} | {status} | "
            f"[Open report]({result.report_path.name}) |"
        )

    lines.append("")
    return "\n".join(lines)


def main() -> int:
    args = parse_args()

    if args.context < 0:
        print("ERROR: --context cannot be negative.", file=sys.stderr)
        return 2

    if not args.metadata_root.exists():
        print(
            f"ERROR: Metadata root does not exist: {args.metadata_root}",
            file=sys.stderr,
        )
        return 2

    if args.book:
        slugs = [args.book]
    else:
        slugs = discover_books(args.metadata_root)

        if not slugs:
            print(
                f"ERROR: No configured book directories found under "
                f"{args.metadata_root}",
                file=sys.stderr,
            )
            return 2

    args.output_dir.mkdir(parents=True, exist_ok=True)

    results: list[BookAuditResult] = []

    for slug in slugs:
        report_text, expected, detected, matches, error = build_book_report(
            slug=slug,
            metadata_root=args.metadata_root,
            context_count=args.context,
            show_volumes=args.show_volumes,
        )

        report_path = args.output_dir / f"{slug}-chapter-audit.md"
        write_report(report_path, report_text)

        result = BookAuditResult(
            slug=slug,
            expected_count=expected,
            detected_count=detected,
            count_matches=matches,
            report_path=report_path,
            error=error,
        )
        results.append(result)

        if not args.no_console_report:
            print(report_text)

        print(f"Wrote report: {report_path}")

    summary_path = args.output_dir / "chapter-audit-summary.md"
    summary_text = build_summary_report(results)
    write_report(summary_path, summary_text)

    print()
    print("=" * 80)
    print("AUDIT SUMMARY")
    print("=" * 80)
    print(f"Books audited: {len(results)}")
    print(
        f"Passed:        "
        f"{sum(1 for result in results if result.count_matches and not result.error)}"
    )
    print(
        f"Need review:   "
        f"{sum(1 for result in results if not result.count_matches and not result.error)}"
    )
    print(f"Errors:        {sum(1 for result in results if result.error)}")
    print(f"Summary:       {summary_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
