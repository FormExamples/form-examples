#!/usr/bin/env python3
"""bin/back-end-with-loco/generate-loco-agents.py — back-end AGENTS.md docs.

Regenerate a form's back-end-with-loco/AGENTS.md to describe the crate as it
actually is: a Loco JSON API with a RESTful scaffold controller per domain
table (the relational per-table design), nested under src/<snake>/.

Historically many of these docs described an obsolete design — a single
`assessments` table with a JSONB `data` column and an `/api/assessments`
controller. That design no longer exists; this generator replaces such stale
docs with an accurate description derived from the crate's real controllers.

Usage:
  bin/back-end-with-loco/generate-loco-agents.py <slug> ...   # named forms
  bin/back-end-with-loco/generate-loco-agents.py --stale       # every crate
                                                               # with stale docs
  bin/back-end-with-loco/generate-loco-agents.py --list-stale  # just list them
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
FORMS_DIR = REPO_ROOT / "forms"

# Markers of the obsolete single-table JSONB design.
STALE_RE = re.compile(r"/api/assessments|Single `?assessments`? table|`data` JSONB")


def title_of(slug: str) -> str:
    index = FORMS_DIR / slug / "index.md"
    if index.is_file():
        m = re.search(r"^#\s+(.+?)\s*$", index.read_text(), re.MULTILINE)
        if m:
            return m.group(1)
    return slug.replace("-", " ").title()


def snake_of(slug: str) -> str:
    return slug.replace("-", "_")


def crate_dir(slug: str) -> Path:
    return FORMS_DIR / slug / "back-end-with-loco"


def entities(slug: str) -> list[str]:
    """Domain controller entity names (excluding auth), sorted for stability."""
    controllers = crate_dir(slug) / "src" / snake_of(slug) / "controllers"
    if not controllers.is_dir():
        return []
    names = [
        p.stem
        for p in controllers.glob("*.rs")
        if p.stem not in ("auth", "mod")
    ]
    return sorted(names)


def render(slug: str) -> str:
    title = title_of(slug)
    snake = snake_of(slug)
    ents = entities(slug)
    ent_lines = "\n".join(f"  - `{e}`" for e in ents)
    out = f"""# {title} — Back-end with Rust Axum Loco (JSON API)

Pure JSON API back-end for the {title} form, built with axum + Loco +
SeaORM + PostgreSQL. **No HTML rendering, no Tera templates, no HTMX, no
Alpine.js, no CSS, no Lily Design System.**

@../../../AGENTS/back-end-with-loco.md

## Layout

- [`{snake}/`](./{snake}/) — the Loco crate: `src/{snake}/` holds `app.rs`
  (route registration), `controllers/`, `models/`, `bin/main.rs`; alongside
  `migration/`, `config/` (dev / test / production YAML), and `tests/`.
- **Relational per-table schema** mirroring [`../sql/`](../sql/): one SeaORM
  model and one RESTful scaffold controller per SQL table — patients,
  clinicians, the form's own tables, and (where the form is scored) the
  grade / grade_rule / grade_flag tables. There is no single JSONB blob table.

## JSON API

A RESTful JSON resource is served per domain table under `/api/…`, each
supporting list (`GET`), create (`POST`), and `GET` / `PUT` / `PATCH` /
`DELETE` by id. All bodies are `application/json` with camelCase keys via
`serde(rename_all = "camelCase")`. Prometheus metrics are exposed at
`/metrics`. The registered domain controllers are:

{ent_lines}

## Engine

`src/{snake}/` also carries the form-specific scoring engine (types + a grader
/ calculator + rules + flagged-issues), exercised by `cargo test` and matching
the front-end engine and the form's `spec/`.

## Verify

```sh
cd {snake} && cargo check --all-targets && cargo test
```
"""
    return out


def stale_slugs() -> list[str]:
    found = []
    for agents in sorted(FORMS_DIR.glob("*/back-end-with-loco/AGENTS.md")):
        if STALE_RE.search(agents.read_text(errors="ignore")):
            found.append(agents.parent.parent.name)
    return found


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--stale", action="store_true", help="regenerate every crate with stale docs")
    parser.add_argument("--list-stale", action="store_true", help="list crates with stale docs and exit")
    args = parser.parse_args()

    if args.list_stale:
        for s in stale_slugs():
            print(s)
        return 0

    slugs = args.slugs
    if args.stale:
        slugs = stale_slugs()
    if not slugs:
        print("no slugs given (use <slug>... or --stale)", file=sys.stderr)
        return 2

    for slug in slugs:
        agents = crate_dir(slug) / "AGENTS.md"
        if not agents.parent.is_dir():
            print(f"skip {slug}: no back-end-with-loco crate", file=sys.stderr)
            continue
        agents.write_text(render(slug))
    print(f"Wrote {len(slugs)} back-end AGENTS.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
