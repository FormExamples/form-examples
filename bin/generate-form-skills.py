#!/usr/bin/env python3
"""bin/generate-form-skills.py — Generate forms/<slug>/skills/ per form.

Writes two Claude Code Skills per form, mirroring the repo-root pair
(`form-examples-skill` / `form-examples-maintainer-skill`) but scoped to
one form:

- forms/<slug>/skills/<slug>-skill/SKILL.md
  End-user-facing: what the form measures, its scoring instrument and
  categories, and where to find its worked examples/personas.
- forms/<slug>/skills/<slug>-maintainer-skill/SKILL.md
  Implementation-facing: this form's directory layout, engine
  reference, and its own verify-gate commands.

Content is derived from each form's own index.md and AGENTS.md (title,
first paragraph, "Scoring system"/"Scoring engine" section, "Verify"
fenced command block) plus which artefact directories actually exist on
disk. Generated artefact: do not hand-edit. Idempotent — re-running with
no upstream change is a no-op (same bytes).

Usage:
  bin/generate-form-skills.py            # generate for every form
  bin/generate-form-skills.py <slug> ... # generate only the named forms
  bin/generate-form-skills.py --check    # exit non-zero if any skill would change
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FORMS_DIR = REPO_ROOT / "forms"

H1_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)


def yaml_scalar(value: str) -> str:
    """Render a YAML frontmatter scalar safely.

    A form's own H1 title can itself contain a colon (e.g. "WHO Emergency
    Unit Form: General"), which is embedded in `description`. An unquoted
    YAML plain scalar containing ": " is ambiguous/invalid, so always
    double-quote and escape backslashes and double-quotes.
    """
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def read_text(path: Path) -> str:
    try:
        return path.read_text()
    except FileNotFoundError:
        return ""


def extract_title(index_md: str, slug: str) -> str:
    m = H1_RE.search(index_md)
    if m:
        return m.group(1).strip()
    return " ".join(word.capitalize() for word in slug.replace("-", " ").split())


def first_paragraph(index_md: str) -> str:
    """First prose paragraph after the H1, flattened to one line."""
    body = re.sub(r"^#\s+.+?\n", "", index_md, count=1)
    for block in body.split("\n\n"):
        block = block.strip()
        if not block or block.startswith("#"):
            continue
        return re.sub(r"\s+", " ", block)
    return ""


def section(md: str, name: str) -> str:
    """Return the body of an H2 section by name (case-insensitive), empty if missing."""
    lines = md.splitlines()
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


def fenced_sh_block(section_body: str) -> str:
    """Extract the content of the first ```sh ... ``` fence in a section body."""
    m = re.search(r"```sh\n(.*?)```", section_body, re.DOTALL)
    return m.group(1).strip("\n") if m else ""


def scoring_reference(agents_md: str) -> tuple[str, str]:
    """Return (heading, body) for whichever scoring section AGENTS.md has.

    Newer-style forms document a "Scoring engine" section (TS interface +
    algorithm); older-style forms document a shorter "Scoring system"
    bullet list. Prefer the richer one when both are present.
    """
    engine = section(agents_md, "Scoring engine")
    if engine:
        return "Scoring engine", engine
    system = section(agents_md, "Scoring system")
    if system:
        return "Scoring system", system
    return "", ""


def verify_lines(slug: str, form_dir: Path, agents_md: str) -> list[str]:
    """This form's verify commands: AGENTS.md's own Verify block if present,
    else `bin/test-form <slug>`, plus any generically-applicable gate this
    form qualifies for that isn't already mentioned."""
    verify_section = section(agents_md, "Verify")
    lines = [l for l in fenced_sh_block(verify_section).splitlines() if l.strip()]
    if not lines:
        lines = [f"bin/test-form {slug}"]
    joined = "\n".join(lines)

    def add_if_absent(token: str, line: str) -> None:
        if token not in joined:
            lines.append(line)

    if (form_dir / "sql").is_dir() and any((form_dir / "sql").glob("*.sql")):
        add_if_absent("test-sql-apply", f"bin/test-sql-apply {slug}")
    if (form_dir / "examples" / "personas.json").is_file():
        add_if_absent("test-personas", f"bin/test-personas {slug}")
    if (form_dir / "front-end-with-html").is_dir():
        add_if_absent("test-e2e", f"bin/test-e2e --html {slug}")
    return lines


def stack_inventory(form_dir: Path) -> list[tuple[str, str]]:
    """Return [(subdir, status)] for each artefact directory present."""
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
    items: list[tuple[str, str]] = []
    for name, label in candidates:
        path = form_dir / name
        present = (path.is_dir() and any(path.iterdir())) or (
            path.is_file() and path.stat().st_size > 0
        )
        if present:
            items.append((name, label))
    return items


def render_user_skill(slug: str, form_dir: Path, index_md: str, agents_md: str) -> str:
    title = extract_title(index_md, slug)
    purpose = first_paragraph(index_md) or f"The {title} form."
    heading, body = scoring_reference(agents_md)
    has_personas = (form_dir / "examples" / "personas.json").is_file()
    has_doc = (form_dir / "doc").is_dir() and any((form_dir / "doc").iterdir())
    has_spec = (form_dir / "spec" / "index.md").is_file()

    description = (
        f"Explains what the {title} form measures, its scoring instrument and "
        f"categories, and how to read its example/persona fixtures. Use when a "
        f"user asks what this form does, how its score or grade is computed, or "
        f"wants a worked example for it. For cross-form concepts shared across "
        f"the monorepo, use form-examples-skill instead."
    )

    out: list[str] = []
    out.append("---")
    out.append(f"name: {slug}-skill")
    out.append(f"description: {yaml_scalar(description)}")
    out.append("---")
    out.append("")
    out.append(f"# {title}")
    out.append("")
    out.append(purpose)
    out.append("")
    out.append(
        f"This skill is the end-user-facing guide to this specific form; for "
        f"cross-form concepts and terminology shared across the monorepo, use "
        f"`form-examples-skill`. For implementation work on this form's code, "
        f"use `{slug}-maintainer-skill` instead."
    )
    out.append("")
    out.append(f"## {heading or 'Scoring'}")
    out.append("")
    if body:
        out.append(body)
    else:
        out.append(
            f"See [`../../index.md`](../../index.md) and "
            f"[`../../spec/index.md`](../../spec/index.md) for the scoring "
            f"instrument, ranges, and categories this form uses."
            if has_spec
            else f"See [`../../index.md`](../../index.md) for the scoring "
            f"instrument, ranges, and categories this form uses."
        )
    out.append("")
    out.append("## Worked examples")
    out.append("")
    if has_personas:
        out.append(
            "- [`../../examples/personas.json`](../../examples/personas.json) — "
            "hand-authored realistic scenarios with the engine's exact expected "
            "output for each one."
        )
    else:
        out.append(
            "- No `examples/personas.json` yet for this form — see "
            "`form-examples-maintainer-skill` for how personas are authored."
        )
    out.append(
        "- [`../../examples/assessment.json`](../../examples/assessment.json) — "
        "a type-defaulted example of the form's data shape (blank/typed, not a "
        "realistic scenario)."
    )
    out.append("")
    out.append("## Learn more")
    out.append("")
    out.append(f"- [`../../index.md`](../../index.md) — full form description and scoring details.")
    if has_spec:
        out.append(
            f"- [`../../spec/index.md`](../../spec/index.md) — the living domain "
            f"spec (the behavioural contract this form's code must satisfy)."
        )
    if has_doc:
        out.append(
            f"- [`../../doc/`](../../doc/) — clinical/regulatory reference "
            f"documentation this form is based on."
        )
    out.append("")
    return "\n".join(out)


def render_maintainer_skill(slug: str, form_dir: Path, index_md: str, agents_md: str) -> str:
    title = extract_title(index_md, slug)
    heading, body = scoring_reference(agents_md)
    inventory = stack_inventory(form_dir)
    verify = verify_lines(slug, form_dir, agents_md)
    has_spec = (form_dir / "spec" / "index.md").is_file()
    has_tasks = (form_dir / "tasks.md").is_file()

    description = (
        f"Implementation workflow for maintaining and extending the {title} "
        f"form (forms/{slug}/) — editing its spec, schema, or engine, "
        f"regenerating derived artefacts, and running its verify gates. Use "
        f"when implementing a change to this form's spec, SQL schema, "
        f"front-end, back-end, or personas. For the repo-wide workflow, use "
        f"form-examples-maintainer-skill instead."
    )

    out: list[str] = []
    out.append("---")
    out.append(f"name: {slug}-maintainer-skill")
    out.append(f"description: {yaml_scalar(description)}")
    out.append("---")
    out.append("")
    out.append(f"# {title} — Maintainer Skill")
    out.append("")
    out.append(
        f"Implementation-facing companion to `{slug}-skill` (this form's "
        f"end-user concepts skill) and to `form-examples-maintainer-skill` "
        f"(the repo-wide maintainer skill — read that one first for the "
        f"golden rule, generators, and the full verify-gate catalogue). This "
        f"skill is the one-form-scoped map."
    )
    out.append("")
    out.append("## Directory layout")
    out.append("")
    out.append(f"`forms/{slug}/` contains:")
    out.append("")
    out.append("| Subdirectory | Role |")
    out.append("| --- | --- |")
    for name, label in inventory:
        out.append(f"| `{name}` | {label} |")
    out.append("")
    out.append(
        "Generated artefacts (`xml`, `fhir`, `protobuf`, `openapi`, the Loco "
        "setup script, `CHANGELOG.md`, `examples/assessment.json`) are never "
        "hand-edited — regenerate them instead; see the tool catalogue in "
        "[`/AGENTS.md`](../../../../AGENTS.md)."
    )
    out.append("")
    out.append(f"## {heading or 'Scoring engine'}")
    out.append("")
    if body:
        out.append(body)
    else:
        out.append(
            f"Not yet documented in this form's own `AGENTS.md`. See "
            f"[`../../spec/index.md`](../../spec/index.md)"
            if has_spec
            else f"Not yet documented in this form's own `AGENTS.md` or a "
            f"`spec/index.md`. See [`../../index.md`](../../index.md)"
        )
        out.append(" for the scoring instrument and engine contract.")
    out.append("")
    out.append("## Verify")
    out.append("")
    out.append("```sh")
    for line in verify:
        out.append(line)
    out.append("```")
    out.append("")
    out.append("## See also")
    out.append("")
    out.append(f"- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.")
    if has_spec:
        out.append(f"- [`../../spec/index.md`](../../spec/index.md) — living domain spec.")
    if has_tasks:
        out.append(f"- [`../../tasks.md`](../../tasks.md) — task tracking.")
    out.append(
        "- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool "
        "catalogue and verify gates."
    )
    out.append("")
    return "\n".join(out)


def targets_for(slugs: list[str]) -> list[tuple[str, Path]]:
    if slugs:
        out = []
        for slug in slugs:
            d = FORMS_DIR / slug
            if not d.is_dir():
                sys.exit(f"form not found: {slug}")
            out.append((slug, d))
        return out
    return [
        (d.name, d)
        for d in sorted(FORMS_DIR.iterdir())
        if d.is_dir()
        and not d.name.startswith(".")
        and not d.name.endswith("-spec")
        and (d / "index.md").is_file()
    ]


def main() -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("slugs", nargs="*", help="Specific slugs; omit for all")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit non-zero if any skill file would change, no writes",
    )
    args = parser.parse_args()

    if not FORMS_DIR.is_dir():
        sys.exit(f"forms directory not found: {FORMS_DIR}")

    targets = targets_for(args.slugs)

    written = unchanged = drift = 0
    for slug, d in targets:
        index_md = read_text(d / "index.md")
        agents_md = read_text(d / "AGENTS.md")
        skills_dir = d / "skills"
        pairs = [
            (skills_dir / f"{slug}-skill" / "SKILL.md", render_user_skill(slug, d, index_md, agents_md)),
            (skills_dir / f"{slug}-maintainer-skill" / "SKILL.md", render_maintainer_skill(slug, d, index_md, agents_md)),
        ]
        for path, new_text in pairs:
            current = path.read_text() if path.is_file() else None
            if current == new_text:
                unchanged += 1
            elif args.check:
                drift += 1
                print(f"drift: {path.relative_to(REPO_ROOT)}")
            else:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(new_text)
                written += 1

    print(
        f"form-skills generator [{'CHECK' if args.check else 'WRITE'}]: "
        f"{len(targets)} form(s), {len(targets) * 2} skill file(s), "
        f"unchanged={unchanged}, "
        f"{'drift' if args.check else 'written'}={drift if args.check else written}"
    )
    if args.check and drift > 0:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
