#!/usr/bin/env python3
"""bin/generate-spec.py — Generate forms/<slug>/spec.md per form.

For every directory under forms/ that contains an index.md, write a
spec.md that:

- restates the form purpose (drawn from index.md),
- lists the contract artefacts each implementation must satisfy
  (SQL, XML, FHIR, protobuf, OpenAPI, four front-ends, Rust crate),
- records the acceptance criteria,
- cross-links AGENTS.md, plan.md, tasks.md, doc/.

The spec.md is the **living domain spec** for each form, the form-level
counterpart to the top-level spec.md.

Idempotent: re-running with no upstream change is a no-op (same bytes).

Usage:
  bin/generate-spec.py            # generate for every form
  bin/generate-spec.py <slug> ... # generate only the named forms
  bin/generate-spec.py --check    # exit non-zero if any spec.md would change
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"

H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)
H2_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)


def read_text(path: Path) -> str:
    try:
        return path.read_text()
    except FileNotFoundError:
        return ""


def first_paragraphs(text: str, n: int = 2) -> str:
    """Return the first n paragraphs after the H1, stripped."""
    # Skip H1
    body = re.sub(r"^#\s+.+?\n", "", text, count=1)
    paras: list[str] = []
    for block in body.split("\n\n"):
        block = block.strip()
        if not block:
            continue
        if block.startswith("#"):
            break
        paras.append(block)
        if len(paras) >= n:
            break
    return "\n\n".join(paras)


def extract_title(index_md: str, slug: str) -> str:
    m = H1_RE.search(index_md)
    if m:
        return m.group(1).strip()
    # Fall back to a humanised slug.
    return " ".join(word.capitalize() for word in slug.replace("-", " ").split())


def section(index_md: str, name: str) -> str:
    """Return the body of an H2 section by name, empty if missing."""
    lines = index_md.splitlines()
    capturing = False
    out: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## "):
            if capturing:
                break
            if stripped[3:].strip().lower() == name.lower():
                capturing = True
                continue
        if capturing:
            out.append(line)
    return "\n".join(out).strip()


def count_sql(form_dir: Path) -> int:
    sql_dir = form_dir / "sql-migrations"
    if not sql_dir.is_dir():
        return 0
    return len([p for p in sql_dir.glob("*.sql")])


def stack_inventory(form_dir: Path) -> list[tuple[str, str]]:
    """Return [(subdir, status)] for each artefact directory present."""
    items: list[tuple[str, str]] = []
    candidates = [
        ("sql-migrations", "source of truth"),
        ("xml-representations", "generated"),
        ("fhir-r5", "generated"),
        ("protobuf", "generated"),
        ("openapi", "generated"),
        ("front-end-form-with-html", "Lily contract"),
        ("front-end-form-with-svelte", "SvelteKit"),
        ("front-end-dashboard-with-html", "Lily contract"),
        ("front-end-dashboard-with-svelte", "SvelteKit + SVAR"),
        ("full-stack-with-loco-tera-htmx-alpine", "Rust + Loco"),
    ]
    for name, label in candidates:
        path = form_dir / name
        present = (path.is_dir() and any(path.iterdir())) or (path.is_file() and path.stat().st_size > 0)
        items.append((name, label if present else f"{label} — not implemented"))
    # The setup file is a single executable, not a directory
    setup = form_dir / "full-stack-with-loco-tera-htmx-alpine-setup"
    if setup.is_file() and setup.stat().st_size > 0:
        items.append(("full-stack-with-loco-tera-htmx-alpine-setup", "generated scaffold script"))
    return items


def render_spec(slug: str, form_dir: Path) -> str:
    index_md = read_text(form_dir / "index.md")
    title = extract_title(index_md, slug)
    purpose = first_paragraphs(index_md, n=2) or (
        f"Domain spec for the {title} form. See `index.md` for the full description."
    )
    scoring = section(index_md, "Scoring system")
    sql_count = count_sql(form_dir)
    inventory = stack_inventory(form_dir)

    out: list[str] = []
    out.append(f"# {title} — specification")
    out.append("")
    out.append(
        "This file is the **living domain spec** for this form. It captures the "
        "contract each implementation (SQL schema, generated representations, "
        "front-ends, and Rust backend) must satisfy. Treat it as the source of "
        "truth for behaviour — update the spec before changing code."
    )
    out.append("")
    out.append(f"Slug: `{slug}`")
    out.append("")
    out.append("## 1. Purpose")
    out.append("")
    out.append(purpose)
    out.append("")
    out.append("Full design description: [`index.md`](index.md).")
    out.append("")
    out.append("## 2. Scope")
    out.append("")
    out.append(
        "In scope: the schema, scoring engine, four front-ends (form + dashboard, "
        "each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. "
        "Out of scope: hosted deployment, authentication, multi-tenancy."
    )
    out.append("")
    if scoring:
        out.append("## 3. Scoring system")
        out.append("")
        out.append(scoring)
        out.append("")
    else:
        out.append("## 3. Scoring system")
        out.append("")
        out.append(
            "See [`index.md`](index.md) for the scoring instrument, ranges, and "
            "categories applicable to this form."
        )
        out.append("")
    out.append("## 4. Inputs and outputs")
    out.append("")
    out.append(
        "**Inputs.** A typed assessment object whose shape mirrors the SQL schema "
        "in `sql-migrations/` ({} migration files). Unanswered text and enum "
        "fields default to `''`; unanswered numeric, date, and time fields "
        "default to `null`.".format(sql_count)
    )
    out.append("")
    out.append(
        "**Outputs.** A grading object emitted by the engine: scoring result "
        "(per the instrument named in §3), `firedRules[]`, `additionalFlags[]`, "
        "and a clinical / administrative report. Rendered as HTML in the "
        "browser, exported as PDF via the SvelteKit endpoint, and convertible "
        "to FHIR R5 Bundle, XML, JSON, CSV, or TSV."
    )
    out.append("")
    out.append("## 5. Artefacts")
    out.append("")
    out.append("Required artefacts and their current status:")
    out.append("")
    out.append("| Subdirectory | Role |")
    out.append("| --- | --- |")
    for name, label in inventory:
        out.append(f"| `{name}` | {label} |")
    out.append("")
    out.append(
        "Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco "
        "setup script) are never hand-edited; re-run the generators in "
        "[`/AGENTS.md`](../../AGENTS.md) §Tools after schema changes."
    )
    out.append("")
    out.append("## 6. Acceptance criteria")
    out.append("")
    out.append("- `bin/test-form {}` exits cleanly.".format(slug))
    out.append("- The scoring engine is pure (no side effects, no I/O) and unit-tested.")
    out.append("- The HTML front-ends conform to the Lily HTML headless contract")
    out.append("  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).")
    out.append("- The SvelteKit front-ends conform to the Lily Svelte headless contract")
    out.append("  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))")
    out.append("  and pass `pnpm check` and `pnpm test`.")
    out.append("- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).")
    out.append("- `bin/lily-html-refactor --check {}` reports no drift.".format(slug))
    out.append("- LocalStorage keys preserve draft state across reloads:")
    out.append("  - `{}.front-end-form-with-html.v1` (HTML)".format(slug))
    out.append("  - `{}.front-end-form-with-svelte.v1` (SvelteKit)".format(slug))
    out.append("")
    out.append("## 7. Compliance")
    out.append("")
    out.append(
        "Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), "
        "UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA "
        "Software and AI as a Medical Device. Form-specific classification (e.g. "
        "Class IIa where output drives clinical decisions) is recorded in "
        "[`index.md`](index.md) and [`AGENTS.md`](AGENTS.md) where it differs "
        "from the baseline."
    )
    out.append("")
    out.append("## 8. References")
    out.append("")
    out.append("- [`index.md`](index.md) — form description and scoring details")
    out.append("- [`AGENTS.md`](AGENTS.md) — agent instructions")
    out.append("- [`plan.md`](plan.md) — implementation roadmap")
    out.append("- [`tasks.md`](tasks.md) — task tracking")
    out.append("- [`/spec.md`](../../spec.md) — system-level specification")
    out.append("- [`/AGENTS.md`](../../AGENTS.md) — cross-cutting agent instructions")
    out.append("- [`../AGENTS-front-end-html.md`](../AGENTS-front-end-html.md) — Lily HTML contract")
    out.append("- [`../AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md) — Lily Svelte contract")
    out.append("")
    out.append("## 9. Verify")
    out.append("")
    out.append("```sh")
    out.append(f"bin/test-form {slug}")
    out.append("```")
    out.append("")
    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("slugs", nargs="*", help="Specific slugs to generate; omit for all")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if any spec.md would change, no writes",
    )
    args = parser.parse_args()

    if not FORMS_DIR.is_dir():
        sys.exit(f"forms directory not found: {FORMS_DIR}")

    if args.slugs:
        targets = []
        for slug in args.slugs:
            d = FORMS_DIR / slug
            if not d.is_dir():
                sys.exit(f"form not found: {slug}")
            targets.append((slug, d))
    else:
        targets = []
        for d in sorted(FORMS_DIR.iterdir()):
            if not d.is_dir():
                continue
            if d.name.startswith(".") or d.name == "lily-spec":
                continue
            if not (d / "index.md").is_file():
                continue
            targets.append((d.name, d))

    written = unchanged = drift = 0
    for slug, d in targets:
        spec_path = d / "spec.md"
        new_text = render_spec(slug, d)
        current = spec_path.read_text() if spec_path.is_file() else None
        if current == new_text:
            unchanged += 1
        elif args.check:
            drift += 1
            print(f"drift: {spec_path.relative_to(REPO_ROOT)}")
        else:
            spec_path.write_text(new_text)
            written += 1

    print(f"spec generator [{'CHECK' if args.check else 'WRITE'}]: "
          f"{len(targets)} target(s), unchanged={unchanged}, "
          f"{'drift' if args.check else 'written'}={drift if args.check else written}")
    if args.check and drift > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
