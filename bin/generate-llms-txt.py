#!/usr/bin/env python3
"""bin/generate-llms-txt.py — Generate forms/<slug>/llms.txt per form.

Writes each form's llms.txt in the llmstxt.org format: an H1 title, a
one-paragraph blockquote summary (both drawn from the form's index.md),
and a Docs section linking the form's key artefacts. The file gives LLM
agents a compact, curated entry point into the form directory.

Generated artefact: do not hand-edit. Idempotent — re-running with no
upstream change is a no-op (same bytes).

Usage:
  bin/generate-llms-txt.py            # generate for every form
  bin/generate-llms-txt.py <slug> ... # generate only the named forms
  bin/generate-llms-txt.py --check    # exit non-zero if any llms.txt would change
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"

H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)


def extract_title(index_md: str, slug: str) -> str:
    m = H1_RE.search(index_md)
    return m.group(1) if m else slug.replace("-", " ").title()


def first_paragraph(index_md: str) -> str:
    """First prose paragraph after the H1, flattened to one line."""
    body = re.sub(r"^#\s+.+?\n", "", index_md, count=1)
    for block in body.split("\n\n"):
        block = block.strip()
        if not block or block.startswith("#"):
            continue
        return re.sub(r"\s+", " ", block)
    return ""


def render_llms_txt(slug: str, form_dir: Path) -> str:
    index_md = (form_dir / "index.md").read_text()
    title = extract_title(index_md, slug)
    summary = first_paragraph(index_md) or f"The {title} form."

    out: list[str] = []
    out.append(f"# {title}")
    out.append("")
    out.append(f"> {summary}")
    out.append("")
    out.append("## Docs")
    out.append("")
    out.append("- [Form description and scoring details](index.md)")
    out.append("- [Living domain spec — the behavioural contract](spec/index.md)")
    out.append("- [Agent instructions](AGENTS.md)")
    out.append("- [Implementation plan](plan.md)")
    out.append("- [Task tracking](tasks.md)")
    out.append("- [Changelog](CHANGELOG.md)")
    out.append("")
    out.append("## Artefacts")
    out.append("")
    out.append("- [SQL migrations — source of truth for the data shape](sql/)")
    out.append("- [Filled-form JSON fixture + FHIR R5 Bundle examples](examples/)")
    out.append("- [HTML front-end — single-page wizard + dashboard](front-end-with-html/)")
    out.append("- [SvelteKit front-end — RESTful wizard + dashboard](front-end-with-svelte/)")
    out.append("- [Rust Loco JSON-API back-end](back-end-with-loco/)")
    out.append("")
    out.append("## Generated representations")
    out.append("")
    out.append("- [XML + DTD per SQL table](xml/)")
    out.append("- [FHIR HL7 R5 JSON per SQL entity](fhir/r5/)")
    out.append("- [Protocol Buffers schemas](protobuf/)")
    out.append("- [OpenAPI 3.1 specifications](openapi/)")
    out.append("")
    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("slugs", nargs="*", help="Specific slugs; omit for all")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if any llms.txt would change, no writes",
    )
    args = parser.parse_args()

    if args.slugs:
        targets = []
        for slug in args.slugs:
            d = FORMS_DIR / slug
            if not d.is_dir():
                sys.exit(f"form not found: {slug}")
            targets.append((slug, d))
    else:
        targets = [
            (d.name, d)
            for d in sorted(FORMS_DIR.iterdir())
            if d.is_dir()
            and not d.name.startswith(".")
            and not d.name.startswith("lily-")
            and (d / "index.md").is_file()
        ]

    written = unchanged = drift = 0
    for slug, d in targets:
        path = d / "llms.txt"
        new_text = render_llms_txt(slug, d)
        current = path.read_text() if path.is_file() else None
        if current == new_text:
            unchanged += 1
        elif args.check:
            drift += 1
            print(f"drift: {path.relative_to(REPO_ROOT)}")
        else:
            path.write_text(new_text)
            written += 1

    print(
        f"llms.txt generator [{'CHECK' if args.check else 'WRITE'}]: "
        f"{len(targets)} target(s), unchanged={unchanged}, "
        f"{'drift' if args.check else 'written'}={drift if args.check else written}"
    )
    if args.check and drift > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
