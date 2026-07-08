#!/usr/bin/env python3
"""Generate setup script for subprojects from SQL migration files.

For each form's sql/ directory, parses CREATE TABLE statements and
emits a `setup.sh` script containing:

- Create application databases for development, test, production (if not exists).
- Create Cargo Loco commands to generate scaffolds.

Tables are scaffolded in the same order as the form's sql/ 
so that FK targets already exist when referencing tables are created.

Loco field-type syntax:

- Types: string, text, int, bigint, float, double, bool, date, ts, uuid,
  json, jsonb, blob, references, references:<col>
- Suffix `!` marks NOT NULL, suffix `^` marks UNIQUE, no suffix means nullable.
- `id`, `created_at`, `updated_at` are added automatically by Loco and are
  therefore skipped here.
"""

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

# --- SQL type → Loco type ----------------------------------------------------

def loco_type_for(col_type: str) -> str:
    t = col_type.upper()
    t_base = re.sub(r"\s*\(.*\)\s*", "", t).strip()
    if t_base == "UUID":
        return "uuid"
    if t_base in ("TEXT",):
        return "text"
    if t_base in ("VARCHAR", "CHAR", "CHARACTER"):
        return "string"
    if t_base in ("SMALLINT", "INT2", "INT", "INT4", "INTEGER", "SERIAL"):
        return "int"
    if t_base in ("BIGINT", "INT8", "BIGSERIAL"):
        return "big_int"
    if t_base in ("REAL", "FLOAT4"):
        return "float"
    if t_base in ("DOUBLE", "DOUBLE PRECISION", "FLOAT", "FLOAT8"):
        return "double"
    if t_base in ("NUMERIC", "DECIMAL"):
        # Loco has no native decimal in the AGENTS doc's list; use double.
        return "double"
    if t_base in ("BOOL", "BOOLEAN"):
        return "bool"
    if t_base == "DATE":
        return "date"
    if t_base in ("TIMESTAMPTZ", "TIMESTAMP", "TIMESTAMPZ"):
        return "tstz"
    if t_base == "JSONB":
        return "jsonb"
    if t_base == "JSON":
        return "json"
    if t_base in ("BYTEA", "BLOB"):
        return "blob"
    # Fallback — treat unknown as string
    return "string"

SKIP_COLUMNS = {"id", "created_at", "updated_at"}

# Columns to drop when merging an assessment_<section> child into the parent
# assessment table. `assessment_id` is the back-reference to the parent and
# becomes meaningless once the child is folded in.
CHILD_SKIP_COLUMNS = SKIP_COLUMNS | {"assessment_id"}

def merge_assessment_tables(tables: list) -> list:
    """Merge every `assessment_<section>` child into the `assessment` parent.

    Returns a new [(table_name, columns)] list where:
    - The `assessment` entry contains the parent's columns followed by every
      non-boilerplate column from each `assessment_<section>` child, in the
      children's original order.
    - On column-name collision, the child column is renamed to
      `<section>_<original_name>` so no field is silently lost.
    - Every `assessment_<section>` entry is removed.
    - Ordering of non-assessment tables (patient, grading_*, etc.) is
      preserved.
    """
    parent_idx = None
    children = []  # list[(section, [cols])]
    keep_order = []  # list of indices to keep

    for i, (name, cols) in enumerate(tables):
        if name == "assessment":
            parent_idx = i
            keep_order.append(i)
        elif name.startswith("assessment_"):
            section = name[len("assessment_"):]
            children.append((section, cols))
        else:
            keep_order.append(i)

    if parent_idx is None or not children:
        return list(tables)

    parent_name, parent_cols = tables[parent_idx]
    merged_cols = list(parent_cols)
    taken = {c["name"] for c in merged_cols}

    for section, child_cols in children:
        for col in child_cols:
            if col["name"] in CHILD_SKIP_COLUMNS:
                continue
            new_col = dict(col)
            if new_col["name"] in taken:
                new_col["name"] = f"{section}_{col['name']}"
            merged_cols.append(new_col)
            taken.add(new_col["name"])

    merged_tables = []
    for i in keep_order:
        name, cols = tables[i]
        if i == parent_idx:
            merged_tables.append((name, merged_cols))
        else:
            merged_tables.append((name, cols))
    return merged_tables

def loco_field_for(col: dict) -> str | None:
    """Return a Loco scaffold field expression like 'name:string!' or None to skip."""
    name = col["name"]
    if name in SKIP_COLUMNS:
        return None

    if col["fk_target"]:
        # FK column. Loco's convention: `<refname>:references` creates a
        # <refname>_id column. Derive <refname> from the SQL column name by
        # stripping the trailing `_id`, so the scaffold produces the same
        # column name.
        ref = name[:-3] if name.endswith("_id") else col["fk_target"]
        return f"{ref}:references"

    base = loco_type_for(col["type"])
    suffix = ""
    if col["not_null"]:
        suffix += "!"
    if col["unique"]:
        suffix += "^"
    return f"{name}:{base}{suffix}"

# --- Output emission ---------------------------------------------------------

def format_scaffold_lines(table: str, cols: list) -> list:
    """Return the line list for one scaffold command (no trailing terminator)."""
    fields = []
    for col in cols:
        expr = loco_field_for(col)
        if expr is not None:
            fields.append(expr)

    lines = [f"cargo loco generate scaffold {table} \\"]
    for f in fields:
        lines.append(f"    {f} \\")
    lines.append("    --api")
    return lines

def render_generate_sh(form_slug: str, tables: list) -> str:
    """Render the back-end-with-loco-setup script.

    Header creates the per-form databases and the Loco project, then `cd`s
    into it; each SQL table becomes one standalone
    `cargo loco generate scaffold … --api` command (scaffolds are emitted in
    `sql/` source order so FK targets already exist when referenced). A final
    step converts the freshly-scaffolded nested crate into the canonical route
    layout (`back-end-with-loco/src/<form_snake_case>/`) via
    `bin/route-loco-layout`.
    """
    form_snake_case = form_slug.replace("-", "_")
    out = [
        "#!/bin/sh",
        "set -euf",
        "",
        f"form_kebab_case={form_slug}",
        f"form_snake_case={form_snake_case}",
        "",
        'createdb --host=localhost --port=5432 --username=loco --owner=loco "${form_snake_case}_development" || :',
        'createdb --host=localhost --port=5432 --username=loco --owner=loco "${form_snake_case}_test" || :',
        'createdb --host=localhost --port=5432 --username=loco --owner=loco "${form_snake_case}_production" || :',
        "",
        'loco new --name "${form_snake_case}" --db postgres --bg async --assets none -a',
        'cd "${form_snake_case}"',
        "",
        "# Pin time to a version compatible with cookie 0.18.1 (a fresh loco",
        "# starter otherwise resolves time 0.3.52, which fails to compile).",
        "cargo update -p time --precise 0.3.47",
        "",
    ]

    for table, cols in tables:
        out.extend(format_scaffold_lines(table, cols))
        out.append("")

    out.extend([
        "# Convert the freshly-scaffolded nested crate into the canonical route",
        "# layout: back-end-with-loco/src/${form_snake_case}/*.rs",
        'cd ..',
        '"$(git rev-parse --show-toplevel)/bin/route-loco-layout" "${form_kebab_case}"',
        "",
    ])

    return "\n".join(out).rstrip("\n") + "\n"

def render_index_md(form_slug: str, tables: list) -> str:
    lines = [
        f"# {form_slug} — back-end-with-loco-setup",
        "",
        "Generator scripts that produce the Loco (loco.rs) scaffolding for",
        f"the `{form_slug}` form's back-end Rust JSON API.",
        "",
        "Every `assessment_<section>` child table is folded into a single",
        "flat `assessment` resource, so one `cargo loco generate scaffold",
        "assessment ... --api` call covers every questionnaire section.",
        "",
        "## Files",
        "",
        "- `back-end-with-loco-setup` — one compound shell command (scaffolds",
        "  chained with `&&`), covering the flattened schema.",
        "",
        "## Tables",
        "",
    ]
    for table, _cols in tables:
        lines.append(f"- `{table}`")
    lines += [
        "",
        "## Usage",
        "",
        "```sh",
        "cd ../back-end-with-loco",
        "sh ../back-end-with-loco-setup",
        "```",
        "",
        "## Regenerate",
        "",
        "```sh",
        "bin/back-end-with-loco/generate-back-end-with-loco-setup.py",
        "```",
        "",
        "See [`AGENTS/back-end-with-loco-setup.md`](../../../AGENTS/back-end-with-loco-setup.md)",
        "for the Loco scaffold command reference.",
        "",
    ]
    return "\n".join(lines)

def render_plan_md(form_slug: str, tables: list) -> str:
    lines = [
        "# Plan",
        "",
        f"Generate Loco (loco.rs) scaffolding for the `{form_slug}` form.",
        "",
        "## Steps",
        "",
        "1. Create a new Loco project (one-time):",
        "",
        "   ```sh",
        f"   loco new --name {form_slug} --db postgres --bg pg --assets none",
        "   ```",
        "",
        "2. Run the generator script inside the Loco project root:",
        "",
        "   ```sh",
        "   sh ../back-end-with-loco-setup",
        "   ```",
        "",
        "3. Review the generated models, controllers, views, and migrations.",
        "",
        "4. Apply migrations:",
        "",
        "   ```sh",
        "   cargo loco db migrate",
        "   ```",
        "",
        "## Scope",
        "",
        f"- {len(tables)} tables will be scaffolded.",
        "- Scaffolding order matches `sql/*.sql` so FK targets exist",
        "  before referencing tables are created.",
        "",
    ]
    return "\n".join(lines)

def render_tasks_md(form_slug: str, tables: list) -> str:
    lines = [
        "# Tasks",
        "",
        "- [ ] Create fresh Loco project",
        "- [ ] Run `generate.sh`",
    ]
    for table, _cols in tables:
        lines.append(f"- [ ] Review scaffold for `{table}`")
    lines += [
        "- [ ] `cargo loco db migrate`",
        "- [ ] `cargo build && cargo test`",
        "",
    ]
    return "\n".join(lines)

# --- Per-form processing ------------------------------------------------------

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

def process_form(form_dir: Path) -> int:
    sql_dir = form_dir / "sql"
    if not sql_dir.is_dir():
        return 0

    # Only process numbered migration files; skip the combined schema.sql
    # produced by bin/generate-sql-combined.py.
    sql_files = sorted(f for f in sql_dir.glob("*.sql") if f.name[:1].isdigit())
    if not sql_files:
        return 0

    all_tables = []
    for sf in sql_files:
        tables = parse_create_tables(sf.read_text(encoding="utf-8"))
        all_tables.extend(tables)

    # Relational per-table: emit one `cargo loco generate scaffold` per
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

    write_file(
        form_dir / "back-end-with-loco-setup",
        render_generate_sh(form_slug, all_tables),
        executable=True,
    )
    return len(all_tables)

def main():
    total_forms = 0
    total_tables = 0

    form_dirs = sorted(d for d in FORMS_DIR.iterdir() if d.is_dir())
    for form_dir in form_dirs:
        if not (form_dir / "sql").is_dir():
            continue
        n = process_form(form_dir)
        total_forms += 1
        total_tables += n
        print(f"  {form_dir.name}: {n} tables")

    print(f"\nTotal: {total_forms} forms, {total_tables} tables scaffolded")

if __name__ == "__main__":
    main()
