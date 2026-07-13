#!/usr/bin/env python3
"""bin/generate-forms-tsv.py — Generate forms.tsv from the forms/ directory.

forms.tsv is the case-conversion lookup table read by bin/forms-as-kebab-case,
bin/forms-as-snake-case, and bin/forms-as-pascal-case (hence by bin/test and
every tool that iterates the form slugs). Each row is three tab-separated
columns derived mechanically from a form's directory name:

    <kebab-case>\t<snake_case>\t<PascalCase>

Rows are the sorted list of immediate sub-directories of forms/ that are real
form projects (they contain an index.md), excluding shared support dirs such
as lily-spec/, lily-svelte-spec/, doc/, and fhir/.

Generated artefact: do not hand-edit. Idempotent — re-running with no upstream
change is a no-op (same bytes).

Usage:
  bin/generate-forms-tsv.py          # rewrite forms.tsv to match forms/
  bin/generate-forms-tsv.py --check  # exit non-zero if forms.tsv is stale
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"
TSV_PATH = REPO_ROOT / "forms.tsv"


def is_form_dir(path: Path) -> bool:
    """A form project directory has an index.md; support dirs do not."""
    return path.is_dir() and (path / "index.md").is_file()


def to_snake(kebab: str) -> str:
    return kebab.replace("-", "_")


def to_pascal(kebab: str) -> str:
    return "".join(word.capitalize() for word in kebab.split("-"))


def form_slugs() -> list[str]:
    return sorted(p.name for p in FORMS_DIR.iterdir() if is_form_dir(p))


def render() -> str:
    lines = [f"{s}\t{to_snake(s)}\t{to_pascal(s)}" for s in form_slugs()]
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="exit non-zero if forms.tsv differs from generated output",
    )
    args = parser.parse_args()

    want = render()

    if args.check:
        have = TSV_PATH.read_text() if TSV_PATH.exists() else ""
        if have != want:
            print(
                "forms.tsv is stale — run bin/generate-forms-tsv.py",
                file=sys.stderr,
            )
            want_slugs = {ln.split("\t", 1)[0] for ln in want.splitlines()}
            have_slugs = {ln.split("\t", 1)[0] for ln in have.splitlines()}
            for missing in sorted(want_slugs - have_slugs):
                print(f"  + {missing}", file=sys.stderr)
            for extra in sorted(have_slugs - want_slugs):
                print(f"  - {extra}", file=sys.stderr)
            return 1
        return 0

    TSV_PATH.write_text(want)
    print(f"Wrote {TSV_PATH.relative_to(REPO_ROOT)} ({want.count(chr(10))} forms)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
