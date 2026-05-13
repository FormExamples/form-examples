#!/usr/bin/env python3
"""Generate Protocol Buffers (.proto) representations from SQL migrations.

For each form's sql-migrations/ directory, parses CREATE TABLE statements
and writes one .proto file per top-level SQL entity into protobuf/.

Conventions documented in AGENTS/protobuf.md:
  - syntax = "proto3";
  - package form_examples.<form_slug_in_snake_case>;
  - PascalCase message name per table, snake_case fields, sequential field
    numbers starting at 1.
  - assessment_<section> child tables fold into the assessment.proto
    message (mirrors the FHIR R5 and XML generators).
  - SQL CHECK (... IN (...)) constraints become proto enums with a
    leading _UNSPECIFIED = 0 value.
"""

import re
from pathlib import Path

FORMS_DIR = Path(__file__).resolve().parent.parent.parent / "forms"

CHILD_SKIP_COLUMNS = {"id", "assessment_id", "created_at", "updated_at"}

# proto3 reserved words and built-in types we must not collide with as
# field names. SQL columns rarely use these but we guard anyway.
PROTO_RESERVED = {
    "syntax", "import", "weak", "public", "package", "option", "message",
    "enum", "service", "rpc", "stream", "returns", "reserved", "to", "max",
    "true", "false", "default", "extensions", "extend", "oneof", "map",
    "group", "optional", "required", "repeated",
}


def parse_create_table(sql_text):
    """Parse CREATE TABLE statements from SQL text. Mirrors the parser in
    bin/fhir-r5/generate-fhir-r5-representations.py so the two stay in
    sync on how the schema is interpreted."""
    tables = []
    pattern = r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.*?)\);'
    matches = re.findall(pattern, sql_text, re.DOTALL | re.IGNORECASE)

    for table_name, body in matches:
        body = re.sub(r'--[^\n]*', '', body)
        columns = []
        depth = 0
        current = ""
        for char in body:
            if char == '(':
                depth += 1
                current += char
            elif char == ')':
                depth -= 1
                current += char
            elif char == ',' and depth == 0:
                columns.append(current.strip())
                current = ""
            else:
                current += char
        if current.strip():
            columns.append(current.strip())

        parsed_cols = []
        for col_def in columns:
            col_def = col_def.strip()
            if re.match(
                r'^(CREATE\b|CONSTRAINT\b|PRIMARY\s+KEY\b|UNIQUE\b|FOREIGN\s+KEY\b|CHECK\b|INDEX\b|EXCLUDE\b)',
                col_def, re.IGNORECASE,
            ):
                continue
            col_match = re.match(
                r'^(\w+)\s+([A-Za-z][\w]*(?:\s*\([^)]*\))?)',
                col_def,
            )
            if col_match:
                col_name = col_match.group(1)
                col_type = col_match.group(2)
                if col_name.upper() in (
                    'PRIMARY', 'UNIQUE', 'FOREIGN', 'CHECK', 'CONSTRAINT',
                    'INDEX', 'EXCLUDE', 'CREATE',
                ):
                    continue
                check_match = re.search(
                    r'CHECK\s*\([^)]*IN\s*\(([^)]+)\)',
                    col_def, re.IGNORECASE,
                )
                check_values = []
                if check_match:
                    check_values = re.findall(r"'([^']*)'", check_match.group(1))
                parsed_cols.append({
                    'name': col_name,
                    'type': col_type,
                    'check_values': check_values,
                    'definition': col_def,
                })
        if parsed_cols:
            tables.append((table_name, parsed_cols))
    return tables


def merge_assessment_tables(tables):
    """Fold every `assessment_<section>` child into the `assessment`
    parent so the protobuf generator emits a single Assessment message
    per form (the same folding rule used by fhir-r5)."""
    parent_idx = None
    children = []
    keep_indices = []

    for i, (name, cols) in enumerate(tables):
        if name == "assessment":
            parent_idx = i
            keep_indices.append(i)
        elif name.startswith("assessment_"):
            section = name[len("assessment_"):]
            children.append((section, cols))
        else:
            keep_indices.append(i)

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

    out = []
    for i in keep_indices:
        name, cols = tables[i]
        if i == parent_idx:
            out.append((name, merged_cols))
        else:
            out.append((name, cols))
    return out


def slug_to_snake(slug):
    """Convert a kebab-case form slug to snake_case for proto packages."""
    return slug.replace('-', '_')


def snake_to_pascal(name):
    """Convert snake_case to PascalCase."""
    return ''.join(part.capitalize() for part in name.split('_') if part)


def proto_field_name(name):
    """Escape proto3 reserved words by appending a trailing underscore."""
    if name.lower() in PROTO_RESERVED:
        return name + "_"
    return name


def determine_proto_type(col_name, col_type):
    """Map a SQL column type to a proto3 scalar type."""
    t = col_type.upper()
    name = col_name.lower()

    # UUID
    if t.startswith('UUID'):
        return 'string', 'uuid'

    # Timestamps and dates
    if 'TIMESTAMPTZ' in t or 'TIMESTAMP' in t:
        return 'string', 'iso 8601'
    if t.startswith('DATE') and 'DATETIME' not in t:
        return 'string', 'iso 8601 date'
    if t.startswith('TIME'):
        return 'string', 'iso 8601 time'

    # Booleans
    if 'BOOLEAN' in t or t == 'BOOL':
        return 'bool', None

    # Integers — BIGINT must precede INT match
    if 'BIGINT' in t or 'BIGSERIAL' in t:
        return 'int64', None
    if 'SMALLINT' in t:
        return 'int32', None
    if t.startswith('INTEGER') or t == 'INT' or t.startswith('INT(') or t.startswith('SERIAL'):
        return 'int32', None
    if 'INT' in t and 'BIGINT' not in t:
        return 'int32', None

    # Floating point
    if 'DOUBLE' in t:
        return 'double', None
    if 'REAL' in t or 'FLOAT' in t:
        return 'float', None
    if 'NUMERIC' in t or 'DECIMAL' in t:
        precision = ''
        m = re.search(r'\(([^)]*)\)', col_type)
        if m:
            precision = f'numeric({m.group(1)})'
        return 'double', precision or 'numeric'

    # Binary
    if 'BYTEA' in t or 'BLOB' in t:
        return 'bytes', None

    # JSON
    if 'JSON' in t:
        return 'string', 'json'

    # Strings
    if 'TEXT' in t:
        return 'string', None
    if 'VARCHAR' in t or 'CHAR' in t:
        m = re.search(r'\((\d+)\)', col_type)
        if m:
            return 'string', f'max {m.group(1)} chars'
        return 'string', None

    return 'string', None


def enum_name(message_name, field_name):
    """Build the enum type name for a CHECK-constrained field."""
    return f"{message_name}{snake_to_pascal(field_name)}Enum"


def enum_value_name(message_name, field_name, value):
    """Build the enum value constant name."""
    field_upper = re.sub(r'[^A-Z0-9_]', '_', snake_to_pascal(field_name).upper())
    value_token = re.sub(r'[^A-Z0-9_]+', '_', value.upper()).strip('_')
    if not value_token:
        value_token = "EMPTY"
    # Leading digit guard.
    if value_token[0].isdigit():
        value_token = "V_" + value_token
    return f"{field_upper}_{value_token}"


def build_enum_block(message_name, col):
    """Emit a proto3 enum for a CHECK (... IN (...)) constraint."""
    name = enum_name(message_name, col['name'])
    lines = [f"enum {name} {{"]
    field_upper = re.sub(r'[^A-Z0-9_]', '_', snake_to_pascal(col['name']).upper())
    lines.append(f"  {field_upper}_UNSPECIFIED = 0;")
    seen = set()
    idx = 1
    for v in col['check_values']:
        if v == "" or v in seen:
            continue
        seen.add(v)
        const = enum_value_name(message_name, col['name'], v)
        lines.append(f"  {const} = {idx};  // {v}")
        idx += 1
    lines.append("}")
    return name, "\n".join(lines)


def build_proto_file(table_name, columns, form_slug, source_table_names):
    """Render a single .proto file from a parsed table."""
    package = f"form_examples.{slug_to_snake(form_slug)}"
    message_name = snake_to_pascal(table_name)

    enum_blocks = []
    enum_names_by_col = {}
    for col in columns:
        if col['check_values']:
            non_empty = [v for v in col['check_values'] if v]
            if non_empty:
                enum_type, block = build_enum_block(message_name, col)
                enum_blocks.append(block)
                enum_names_by_col[col['name']] = enum_type

    field_lines = []
    field_number = 1
    for col in columns:
        proto_name = proto_field_name(col['name'])
        if col['name'] in enum_names_by_col:
            proto_type = enum_names_by_col[col['name']]
            type_note = None
        else:
            proto_type, type_note = determine_proto_type(col['name'], col['type'])
        comment = f"  // {col['type']}"
        if type_note:
            comment += f" — {type_note}"
        field_lines.append(
            f"  {proto_type} {proto_name} = {field_number};{comment}"
        )
        field_number += 1

    header = [
        "// Generated from sql-migrations/. Do not edit by hand.",
        f"// SOURCE: {', '.join(source_table_names)}",
        "",
        'syntax = "proto3";',
        "",
        f"package {package};",
        "",
    ]

    body = []
    for block in enum_blocks:
        body.append(block)
        body.append("")
    body.append(f"message {message_name} {{")
    body.extend(field_lines)
    body.append("}")

    return "\n".join(header + body) + "\n"


def process_form(form_dir):
    """Process a single form: parse its SQL migrations and write .proto
    files into protobuf/. Returns the number of files written."""
    sql_dir = form_dir / "sql-migrations"
    if not sql_dir.is_dir():
        return 0

    proto_dir = form_dir / "protobuf"
    form_slug = form_dir.name

    # Only numbered migration files; skip the combined NN_schema.sql
    # produced by bin/sql-migrations/generate-sql-combined.py — it
    # restates every CREATE TABLE and would yield duplicate messages.
    sql_files = sorted(
        f for f in sql_dir.glob("*.sql")
        if f.name[:1].isdigit() and not f.name.endswith("schema.sql")
    )
    if not sql_files:
        return 0

    all_sql = ""
    for sf in sql_files:
        all_sql += sf.read_text(encoding="utf-8") + "\n"

    all_tables = parse_create_table(all_sql)
    if not all_tables:
        return 0

    # A handful of forms have duplicate CREATE TABLE statements across
    # numbered migrations (e.g. an earlier migration creating `grade`
    # followed by a later migration recreating it). Keep the last
    # definition wins, mirroring SQL migration playback order.
    deduped = {}
    for name, cols in all_tables:
        deduped[name] = cols
    all_tables = list(deduped.items())

    # Track the original table names that contributed to each output
    # message — useful when assessment_<section> children fold into the
    # parent. We record the parent + every section name as the source.
    source_for = {name: [name] for name, _ in all_tables}
    parent = next((n for n, _ in all_tables if n == "assessment"), None)
    if parent:
        for n, _ in all_tables:
            if n.startswith("assessment_"):
                source_for[parent].append(n)

    all_tables = merge_assessment_tables(all_tables)
    expected_files = {f"{t[0]}.proto" for t in all_tables}

    proto_dir.mkdir(exist_ok=True)

    count = 0
    for table_name, columns in all_tables:
        proto_text = build_proto_file(
            table_name, columns, form_slug,
            source_for.get(table_name, [table_name]),
        )
        (proto_dir / f"{table_name}.proto").write_text(
            proto_text, encoding="utf-8",
        )
        count += 1

    # Drop every .proto file in the dir that this run did not produce.
    # Catches stale assessment_<section>.proto from before sections were
    # folded, and stale tables that lived only in the combined schema.sql
    # before schema.sql was excluded from the input set.
    for f in proto_dir.glob("*.proto"):
        if f.name not in expected_files:
            f.unlink()

    return count


def main():
    total_forms = 0
    total_files = 0

    form_dirs = sorted(
        d for d in FORMS_DIR.iterdir()
        if d.is_dir() and (d / "sql-migrations").is_dir()
    )

    for form_dir in form_dirs:
        count = process_form(form_dir)
        if count > 0:
            total_forms += 1
            total_files += count
            print(f"  {form_dir.name}: {count} .proto files")

    print(f"\nTotal: {total_forms} forms, {total_files} .proto files generated")


if __name__ == "__main__":
    main()
