#!/usr/bin/env python3
"""bin/generate-spec.py — Scaffold forms/<slug>/spec/index.md per form.

For every directory under forms/ that contains an index.md, ensure a
spec/ directory exists holding index.md (the living domain spec) plus a
README.md symlink — the form-level counterpart to the top-level system
spec. (Older forms used a single `spec.md` file; the gold standard is
now the `spec/` directory.)

The per-form spec is a HAND-MAINTAINED living document: it is the
source of truth for behaviour, updated before code changes
(spec-driven development). This tool therefore only SCAFFOLDS:

- default: write spec/index.md only where it is missing or empty
  (seeded from index.md), and repair a missing README.md symlink;
- --force: deliberately regenerate the named forms' spec/index.md
  from the template, overwriting hand edits (requires explicit slugs);
- --check: exit non-zero if any form lacks a non-empty spec/index.md
  or its README.md symlink. Hand-edited content is never "drift".

Usage:
  bin/generate-spec.py                    # scaffold all missing specs
  bin/generate-spec.py <slug> ...         # scaffold only the named forms
  bin/generate-spec.py --force <slug> ... # regenerate named forms (overwrite)
  bin/generate-spec.py --check            # structural check, no writes
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
    sql_dir = form_dir / "sql"
    if not sql_dir.is_dir():
        return 0
    return len([p for p in sql_dir.glob("*.sql")])


def stack_inventory(form_dir: Path) -> list[tuple[str, str]]:
    """Return [(subdir, status)] for each artefact directory present."""
    items: list[tuple[str, str]] = []
    candidates = [
        ("sql", "source of truth"),
        ("xml", "generated"),
        ("fhir", "generated"),
        ("protobuf", "generated"),
        ("openapi", "generated"),
        ("front-end-with-html", "HTML + Lily (wizard + dashboard)"),
        ("front-end-with-svelte", "SvelteKit (wizard + dashboard)"),
        ("back-end-with-loco", "Rust + Loco JSON API"),
    ]
    for name, label in candidates:
        path = form_dir / name
        present = (path.is_dir() and any(path.iterdir())) or (path.is_file() and path.stat().st_size > 0)
        items.append((name, label if present else f"{label} — not implemented"))
    # The setup file is a single executable, not a directory
    setup = form_dir / "back-end-with-loco-setup"
    if setup.is_file() and setup.stat().st_size > 0:
        items.append(("back-end-with-loco-setup", "generated scaffold script"))
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
    out.append("Full design description: [`index.md`](../index.md).")
    out.append("")
    out.append("## 2. Scope")
    out.append("")
    out.append(
        "In scope: the schema, scoring engine, the two consolidated front-ends "
        "(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API "
        "crate, and the generated representations (XML, FHIR R5, protobuf, "
        "OpenAPI) listed in §5. Out of scope: hosted deployment, authentication, "
        "multi-tenancy."
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
            "See [`index.md`](../index.md) for the scoring instrument, ranges, and "
            "categories applicable to this form."
        )
        out.append("")
    out.append("## 4. Inputs and outputs")
    out.append("")
    out.append(
        "**Inputs.** A typed assessment object whose shape mirrors the SQL schema "
        "in `sql/` ({} migration files). Unanswered text and enum "
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
        "[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes."
    )
    out.append("")
    out.append("## 6. Acceptance criteria")
    out.append("")
    out.append("- `bin/test-form {}` exits cleanly.".format(slug))
    out.append("- The scoring engine is pure (no side effects, no I/O) and unit-tested.")
    out.append("- The HTML front-ends conform to the Lily HTML headless contract")
    out.append("  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).")
    out.append("- The SvelteKit front-ends conform to the Lily Svelte headless contract")
    out.append("  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))")
    out.append("  and pass `pnpm check` and `pnpm test`.")
    out.append("- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).")
    out.append("- `bin/lily-html-refactor --check {}` reports no drift.".format(slug))
    out.append("- LocalStorage keys preserve draft state across reloads:")
    out.append("  - `{}.front-end-with-html.v1` (HTML)".format(slug))
    out.append("  - `{}.front-end-with-svelte.v1` (SvelteKit)".format(slug))
    out.append("")
    out.append("## 7. Compliance")
    out.append("")
    out.append(
        "Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), "
        "UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA "
        "Software and AI as a Medical Device. Form-specific classification (e.g. "
        "Class IIa where output drives clinical decisions) is recorded in "
        "[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs "
        "from the baseline."
    )
    out.append("")
    out.append("## 8. References")
    out.append("")
    out.append("- [`index.md`](../index.md) — form description and scoring details")
    out.append("- [`AGENTS.md`](../AGENTS.md) — agent instructions")
    out.append("- [`plan.md`](../plan.md) — implementation roadmap")
    out.append("- [`tasks.md`](../tasks.md) — task tracking")
    out.append("- [`/spec.md`](../../../spec.md) — system-level specification")
    out.append("- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions")
    out.append("- [`../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) — Lily HTML contract")
    out.append("- [`../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) — Lily Svelte contract")
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
    parser.add_argument("slugs", nargs="*", help="Specific slugs to scaffold; omit for all")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if any form lacks spec/index.md or its README symlink",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenerate spec/index.md from the template, overwriting hand edits "
        "(requires explicit slugs)",
    )
    args = parser.parse_args()

    if args.force and not args.slugs:
        sys.exit("--force overwrites hand-maintained specs; name explicit slugs")
    if args.force and args.check:
        sys.exit("--force and --check are mutually exclusive")

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

    written = present = missing = 0
    for slug, d in targets:
        spec_dir = d / "spec"
        spec_path = spec_dir / "index.md"
        readme = spec_dir / "README.md"
        has_spec = spec_path.is_file() and spec_path.stat().st_size > 0
        has_readme = readme.is_symlink() or readme.is_file()

        if args.check:
            if not has_spec:
                missing += 1
                print(f"missing spec: {spec_path.relative_to(REPO_ROOT)}")
            elif not has_readme:
                missing += 1
                print(f"missing README symlink: {readme.relative_to(REPO_ROOT)}")
            else:
                present += 1
            continue

        if has_spec and not args.force:
            present += 1
        else:
            spec_dir.mkdir(exist_ok=True)
            spec_path.write_text(render_spec(slug, d))
            written += 1
        # README.md -> index.md symlink for GitHub rendering of the spec dir
        if not has_readme:
            try:
                readme.symlink_to("index.md")
            except OSError:
                pass

    print(f"spec scaffolder [{'CHECK' if args.check else 'WRITE'}]: "
          f"{len(targets)} target(s), present={present}, "
          f"{'missing' if args.check else 'written'}={missing if args.check else written}")
    if args.check and missing > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
