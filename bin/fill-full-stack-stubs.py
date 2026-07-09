#!/usr/bin/env python3
"""Fill stub back-end-with-loco/ AGENTS.md, plan.md, index.md files across all
forms.

Replaces files that contain the placeholder phrase "Not yet implemented." with
templated content describing the planned Rust JSON API back-end. Each form's
root index.md is read to extract the form's title and one-line description.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"
SUBDIR_NAME = "back-end-with-loco"
STUB_PHRASE = "Not yet implemented."


def slug_to_title(slug: str) -> str:
    """Best-effort conversion of a kebab-case slug to a human title.

    Falls back to the slug itself if the form's root index.md can't be parsed.
    """
    # Special-case acronyms and government bodies common in this repo.
    overrides = {
        "united-kingdom": "UK",
        "world-health-organization": "WHO",
        "who": "WHO",
        "uk": "UK",
        "dvla": "DVLA",
        "nhs": "NHS",
        "dass": "DASS",
        "ess": "ESS",
        "act": "ACT",
        "psqi": "PSQI",
        "phq": "PHQ",
        "gad": "GAD",
        "mat-b1": "MAT B1",
        "b1": "B1",
        "m1": "M1",
        "v1": "V1",
    }
    parts = []
    for part in slug.split("-"):
        parts.append(overrides.get(part, part.capitalize()))
    return " ".join(parts)


def read_form_title(form_dir: Path) -> str:
    """Read the first H1 from the form's root index.md, if available."""
    index_md = form_dir / "index.md"
    if not index_md.is_file():
        return slug_to_title(form_dir.name)
    for line in index_md.read_text().splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return slug_to_title(form_dir.name)


def read_form_oneline(form_dir: Path) -> str:
    """Read the first non-heading paragraph from index.md as a one-liner."""
    index_md = form_dir / "index.md"
    if not index_md.is_file():
        return f"{slug_to_title(form_dir.name)} clinical workflow."
    text = index_md.read_text()
    # Skip frontmatter and the H1, take the first paragraph.
    paragraphs = re.split(r"\n\s*\n", text, maxsplit=10)
    for p in paragraphs[1:]:
        p = p.strip()
        if not p or p.startswith("#"):
            continue
        # Collapse internal whitespace and trim to a sentence.
        p = re.sub(r"\s+", " ", p)
        return p
    return f"{slug_to_title(form_dir.name)} clinical workflow."


def index_md_template(title: str, oneline: str) -> str:
    return f"""# {title}: Back-end with Rust Axum Loco (JSON API)

{oneline}

## Status

Pending implementation. Scaffold present (sql, generated setup
script). Rust crate not yet authored.

See [AGENTS.md](AGENTS.md) for the planned project layout, and the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md)
for the canonical back-end JSON API stack, conventions, and route plan.
"""


def plan_md_template(title: str) -> str:
    return f"""# Plan: {title}: Back-end with Rust Axum Loco (JSON API)

## Current status

Pending implementation. Scaffold present (sql, generated setup
script). Rust crate not yet authored.

## Implementation plan

1. Run the generated `back-end-with-loco-setup` script to scaffold the Loco
   app and run `cargo loco generate scaffold ... --api` for each table in
   `sql/`.
2. Author engine types, rules, grader, and flagged-issues mirroring the
   front-end-form-with-svelte engine, with `serde(rename_all = "camelCase")`
   on shared structs.
3. Wire JSON HTTP routes under `/api/assessments`:
   `GET /api/assessments`, `POST /api/assessments`,
   `GET /api/assessments/{{id}}`, `PATCH /api/assessments/{{id}}`,
   `POST /api/assessments/{{id}}/submit`,
   `GET /api/assessments/{{id}}/result`.
4. Add cargo tests covering the grader, flagged-issues, and JSON API
   end-to-end.

See [AGENTS.md](AGENTS.md) for the planned project structure.
"""


def agents_md_template(title: str, oneline: str) -> str:
    return f"""# {title} -- Back-end with Rust Axum Loco (JSON API)

{oneline}

@../../../AGENTS/back-end-with-loco.md

## Status

Pending implementation. Scaffold present (sql, generated setup
script). Rust crate not yet authored.

## Project structure

See the parent
[AGENTS/back-end-with-loco.md](../../../AGENTS/back-end-with-loco.md)
for the canonical Loco crate layout, scoring-engine module conventions,
and the JSON API route plan. Per-form notes will be added here as the
Rust implementation progresses.
"""


TEMPLATES = {
    "index.md": index_md_template,
    "plan.md": plan_md_template,
    "AGENTS.md": agents_md_template,
}


def main() -> int:
    if not FORMS_DIR.is_dir():
        print(f"forms dir not found: {FORMS_DIR}", file=sys.stderr)
        return 1

    rewritten = 0
    skipped = 0
    for form_dir in sorted(FORMS_DIR.iterdir()):
        if not form_dir.is_dir():
            continue
        sub = form_dir / SUBDIR_NAME
        if not sub.is_dir():
            continue

        title = read_form_title(form_dir)
        oneline = read_form_oneline(form_dir)

        for filename, template in TEMPLATES.items():
            target = sub / filename
            if not target.is_file():
                continue
            content = target.read_text()
            if STUB_PHRASE not in content:
                skipped += 1
                continue

            if filename == "AGENTS.md":
                new_content = template(title, oneline)
            elif filename == "index.md":
                new_content = template(title, oneline)
            else:
                new_content = template(title)

            target.write_text(new_content)
            rewritten += 1
            print(f"rewrote {target.relative_to(REPO_ROOT)}")

    print(f"\nDone. rewritten={rewritten} skipped={skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
