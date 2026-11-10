#!/usr/bin/env python3
"""Generate setup script for subprojects from SQL migration files.

For each form's sql/ directory, parses CREATE TABLE statements and
emits a `setup.sh` script containing:

- Create application databases for development, test, production (if not exists).
- Create Cargo Axum commands to generate scaffolds.

Tables are scaffolded in the same order as the form's sql/ 
so that FK targets already exist when referencing tables are created.

Axum field-type syntax:

- Types: string, text, int, bigint, float, double, bool, date, ts, uuid,
  json, jsonb, blob, references, references:<col>
- Suffix `!` marks NOT NULL, suffix `^` marks UNIQUE, no suffix means nullable.
- `id`, `created_at`, `updated_at` are added automatically by Axum and are
  therefore skipped here.
"""

import argparse
import os
import re
import sys
from pathlib import Path

TOP = Path(__file__).resolve().parent.parent.parent
FORMS_DIR = TOP / "forms"

# --- SQL parsing -------------------------------------------------------------

def split_top_level_commas(body: str):
    """Split a CREATE TABLE body by top-level commas (ignoring commas inside parens)."""
    # Remove line comments first
    body = re.sub(r"--[^\n]*", "", body)
    parts = []
    depth = 0
    current = ""
    for ch in body:
        if ch == "(":
            depth += 1
            current += ch
        elif ch == ")":
            depth -= 1
            current += ch
        elif ch == "," and depth == 0:
            parts.append(current.strip())
            current = ""
        else:
            current += ch
    if current.strip():
        parts.append(current.strip())
    return parts

def parse_create_tables(sql_text: str):
    """Return a list of (table_name, [column_dicts]) tuples in source order."""
    tables = []
    pattern = r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.*?)\)\s*;"
    for m in re.finditer(pattern, sql_text, re.DOTALL | re.IGNORECASE):
        table_name = m.group(1)
        body = m.group(2)
        cols = []
        for piece in split_top_level_commas(body):
            piece = piece.strip()
            if not piece:
                continue
            head = piece.split(None, 1)[0].upper()
            if head in (
                "PRIMARY", "UNIQUE", "FOREIGN", "CHECK", "CONSTRAINT",
                "INDEX", "EXCLUDE", "CREATE",
            ):
                continue
            col_match = re.match(r"^(\w+)\s+([A-Za-z]+(?:\s*\([^)]*\))?)", piece)
            if not col_match:
                continue
            col_name = col_match.group(1)
            col_type = col_match.group(2).strip()

            upper = piece.upper()
            not_null = "NOT NULL" in upper
            unique = bool(re.search(r"\bUNIQUE\b", upper))

            # Detect FK reference target: REFERENCES <table>(<col>)
            fk_target = None
            fk_match = re.search(
                r"REFERENCES\s+(\w+)\s*\(\s*(\w+)\s*\)",
                piece,
                re.IGNORECASE,
            )
            if fk_match:
                fk_target = fk_match.group(1)

            cols.append({
                "name": col_name,
                "type": col_type,
                "not_null": not_null,
                "unique": unique,
                "fk_target": fk_target,
            })
        tables.append((table_name, cols))
    return tables

# --- SQL type → Axum type ----------------------------------------------------

def render_generate_sh(form_slug: str, tables: list) -> str:
    """Render the back-end-with-axum-setup script: the per-form databases,
    then the schema from the crate's `migrations/`."""
    form_snake_case = form_slug.replace("-", "_")
    return "\n".join([
        "#!/bin/sh",
        "set -euf",
        "",
        f"form_snake_case={form_snake_case}",
        "",
        'createdb --host=localhost --port=5432 --username=postgres --owner=postgres "${form_snake_case}_development" || :',
        'createdb --host=localhost --port=5432 --username=postgres --owner=postgres "${form_snake_case}_test" || :',
        'createdb --host=localhost --port=5432 --username=postgres --owner=postgres "${form_snake_case}_production" || :',
        "",
        'cd "$(dirname "$0")/back-end-with-axum"',
        "cargo run -- db migrate",
        "",
    ])


def ensure_symlink(link: Path, target: str):
    if link.is_symlink() or link.exists():
        link.unlink()
    link.symlink_to(target)

def write_file(path: Path, content: str, executable: bool = False):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    if executable:
        mode = path.stat().st_mode
        path.chmod(mode | 0o111)

def process_form(form_dir: Path, check: bool = False):
    """Generate (or, when check=True, verify) a form's back-end-with-axum-setup.

    Returns (table_count, drifted). In check mode drifted is True when the
    on-disk script differs from freshly generated output; otherwise it is False
    and the script is (re)written.
    """
    sql_dir = form_dir / "sql"
    if not sql_dir.is_dir():
        return 0, False

    # Only process numbered migration files; skip the combined schema.sql
    # produced by bin/generate-sql-combined.py.
    sql_files = sorted(f for f in sql_dir.glob("*.sql") if f.name[:1].isdigit())
    if not sql_files:
        return 0, False

    all_tables = []
    for sf in sql_files:
        tables = parse_create_tables(sf.read_text(encoding="utf-8"))
        all_tables.extend(tables)

    # Relational per-table: keep one entry per
    # CREATE TABLE (no folding of `assessment_<section>` children into the
    # parent). Dedupe by table name, keeping the first occurrence, so forms
    # that also ship a combined `NN_schema.sql` alongside per-table files do
    # not scaffold a table twice. First-occurrence order preserves the FK
    # dependency order from the per-table migration files.
    seen = set()
    deduped = []
    for name, cols in all_tables:
        if name in seen:
            continue
        seen.add(name)
        deduped.append((name, cols))
    all_tables = deduped

    form_slug = form_dir.name
    content = render_generate_sh(form_slug, all_tables)
    out = form_dir / "back-end-with-axum-setup"

    if check:
        have = out.read_text(encoding="utf-8") if out.exists() else ""
        return len(all_tables), have != content

    write_file(out, content, executable=True)
    return len(all_tables), False

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*", help="only these form slugs (default: all)")
    parser.add_argument("--check", action="store_true",
                        help="exit non-zero if any back-end-with-axum-setup is stale")
    args = parser.parse_args()

    form_dirs = sorted(d for d in FORMS_DIR.iterdir() if d.is_dir())
    if args.slugs:
        wanted = set(args.slugs)
        form_dirs = [d for d in form_dirs if d.name in wanted]

    total_forms = 0
    total_tables = 0
    drift = []
    for form_dir in form_dirs:
        if not (form_dir / "sql").is_dir():
            continue
        n, drifted = process_form(form_dir, check=args.check)
        total_forms += 1
        total_tables += n
        if drifted:
            drift.append(form_dir.name)
        elif not args.check:
            print(f"  {form_dir.name}: {n} tables")

    if args.check:
        if drift:
            print(f"back-end-with-axum-setup stale for {len(drift)} form(s) "
                  f"(run: bin/back-end-with-axum/generate-back-end-with-axum-setup.py):",
                  file=sys.stderr)
            for s in drift[:20]:
                print(f"  {s}", file=sys.stderr)
            if len(drift) > 20:
                print(f"  … and {len(drift) - 20} more", file=sys.stderr)
            return 1
        print(f"back-end-with-axum-setup: {total_forms} forms up to date")
        return 0

    print(f"\nTotal: {total_forms} forms, {total_tables} tables scaffolded")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
