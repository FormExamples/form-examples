#!/usr/bin/env python3
"""Generate OpenAPI 3.1 (.yaml) representations from SQL migrations.

For each form's sql/ directory, parses CREATE TABLE statements
plus COMMENT ON TABLE / COMMENT ON COLUMN, and writes one .yaml file per
SQL table into openapi/.

Conventions documented in AGENTS/openapi.md:
  - One .yaml per table, because each table has its own routes.
  - openapi: 3.1.0
  - info.title = "<Form Slug Titlecased> — <Resource>"
  - info.description = COMMENT ON TABLE (or the table name if absent)
  - Five operations per resource: GET list, POST create, GET by-id,
    PATCH update, DELETE.
  - Property descriptions sourced from COMMENT ON COLUMN.
  - required = NOT NULL columns except id.
  - CHECK (... IN (...)) constraints become string enums.
"""

import re
from pathlib import Path

FORMS_DIR = Path(__file__).resolve().parent.parent.parent / "forms"



def parse_create_table(sql_text):
    """Parse CREATE TABLE statements. Mirrors bin/protobuf/."""
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
            if not col_match:
                continue
            col_name = col_match.group(1)
            col_type = col_match.group(2)
            if col_name.upper() in (
                'PRIMARY', 'UNIQUE', 'FOREIGN', 'CHECK', 'CONSTRAINT',
                'INDEX', 'EXCLUDE', 'CREATE',
            ):
                continue

            check_values = []
            check_match = re.search(
                r'CHECK\s*\([^)]*IN\s*\(([^)]+)\)',
                col_def, re.IGNORECASE,
            )
            if check_match:
                check_values = re.findall(r"'([^']*)'", check_match.group(1))

            upper_def = col_def.upper()
            not_null = ' NOT NULL' in upper_def
            references = None
            ref_match = re.search(
                r'REFERENCES\s+(\w+)\s*\(',
                col_def, re.IGNORECASE,
            )
            if ref_match:
                references = ref_match.group(1)

            parsed_cols.append({
                'name': col_name,
                'type': col_type,
                'check_values': check_values,
                'not_null': not_null,
                'references': references,
                'definition': col_def,
            })
        if parsed_cols:
            tables.append((table_name, parsed_cols))
    return tables


def parse_comments(sql_text):
    """Parse COMMENT ON TABLE / COMMENT ON COLUMN statements.

    Returns (table_comments, column_comments) where:
      table_comments[table] = "text"
      column_comments[(table, column)] = "text"

    Handles multiline comment bodies and `''` doubled-quote escapes.
    """
    table_comments = {}
    column_comments = {}

    table_re = re.compile(
        r"COMMENT\s+ON\s+TABLE\s+(\w+)\s+IS\s*'((?:[^']|'')*)'\s*;",
        re.IGNORECASE | re.DOTALL,
    )
    col_re = re.compile(
        r"COMMENT\s+ON\s+COLUMN\s+(\w+)\.(\w+)\s+IS\s*'((?:[^']|'')*)'\s*;",
        re.IGNORECASE | re.DOTALL,
    )

    for m in table_re.finditer(sql_text):
        table, body = m.group(1), m.group(2)
        body = body.replace("''", "'").strip()
        table_comments[table] = body

    for m in col_re.finditer(sql_text):
        table, col, body = m.group(1), m.group(2), m.group(3)
        body = body.replace("''", "'").strip()
        column_comments[(table, col)] = body

    return table_comments, column_comments


def snake_to_pascal(name):
    return ''.join(part.capitalize() for part in name.split('_') if part)


def slug_title(slug):
    """Cardiology-assessment → 'Cardiology Assessment'. arc42 stays 'Arc42'."""
    return ' '.join(part.capitalize() for part in slug.split('-') if part)


def pluralize_route(snake_name):
    """SQL snake_case table name → the plural a form's back-end routes it under.

    Rules (read from the crates' controllers):
      consonant + 'y' → drop 'y', add 'ies'
      ends in ss/x/z/ch/sh → add 'es'
      ends in any other s → unchanged
      otherwise → add 's'
    """
    if len(snake_name) >= 2 and snake_name[-1] == 'y' and snake_name[-2] not in 'aeiou':
        return snake_name[:-1] + 'ies'
    if snake_name.endswith(('ss', 'x', 'z', 'ch', 'sh')):
        return snake_name + 'es'
    if snake_name.endswith('s'):
        return snake_name
    return snake_name + 's'


# ---------------------------------------------------------------------------
# Type mapping
# ---------------------------------------------------------------------------

def sql_to_openapi(col):
    """Map a parsed column to a list of OpenAPI schema lines (key: value)
    that follow the `type:` line. Returns ([extra_lines], type_keyword).

    The first entry of the returned list is always `type: <kind>`.
    """
    t = col['type'].upper()
    raw = col['type']

    # CHECK enum overrides the type-based mapping; the enum block is
    # added at a higher level so here we only return the base type.
    # Caller handles enum emission.

    # UUID
    if t.startswith('UUID'):
        return [('type', 'string'), ('format', 'uuid')]

    # Timestamps and dates — order matters: TIMESTAMPTZ contains TIMESTAMP.
    if t.startswith('TIMESTAMPTZ') or t.startswith('TIMESTAMP'):
        return [('type', 'string'), ('format', 'date-time')]
    if t.startswith('DATE') and not t.startswith('DATETIME'):
        return [('type', 'string'), ('format', 'date')]
    if t.startswith('TIME'):
        return [('type', 'string'), ('format', 'time')]

    # Boolean
    if t.startswith('BOOLEAN') or t == 'BOOL':
        return [('type', 'boolean')]

    # Integers (BIGINT before INT)
    if 'BIGINT' in t or 'BIGSERIAL' in t:
        return [('type', 'integer'), ('format', 'int64')]
    if t.startswith('SMALLINT') or t.startswith('SERIAL') or t.startswith('INTEGER') or t == 'INT' or t.startswith('INT('):
        return [('type', 'integer'), ('format', 'int32')]

    # Floats
    if 'DOUBLE' in t:
        return [('type', 'number'), ('format', 'double')]
    if 'REAL' in t:
        return [('type', 'number'), ('format', 'float')]
    if 'FLOAT' in t:
        return [('type', 'number'), ('format', 'float')]
    if 'NUMERIC' in t or 'DECIMAL' in t:
        return [('type', 'number'), ('format', 'double')]

    # Binary
    if 'BYTEA' in t or 'BLOB' in t:
        return [('type', 'string'), ('format', 'byte')]

    # JSON
    if 'JSON' in t:
        return [('type', 'object')]

    # CHAR(n) / VARCHAR(n) — carry maxLength
    if 'VARCHAR' in t or t.startswith('CHAR'):
        m = re.search(r'\((\d+)\)', raw)
        out = [('type', 'string')]
        if m:
            out.append(('maxLength', int(m.group(1))))
        return out

    # TEXT and everything else default to string
    return [('type', 'string')]


# ---------------------------------------------------------------------------
# YAML emission (custom, byte-for-byte matching existing files)
# ---------------------------------------------------------------------------

_YAML_RESERVED = {
    'yes', 'no', 'true', 'false', 'null', 'on', 'off', '~',
    'Yes', 'No', 'True', 'False', 'Null', 'On', 'Off',
    'YES', 'NO', 'TRUE', 'FALSE', 'NULL', 'ON', 'OFF',
}


def _looks_numeric(s):
    """True if YAML would parse this as an int/float."""
    if not s:
        return False
    try:
        int(s)
        return True
    except ValueError:
        pass
    try:
        float(s)
        return True
    except ValueError:
        return False


def yaml_quote(s):
    """Return a YAML scalar representation, quoting only when necessary.

    Matches the convention in the committed openapi/*.yaml files:
      - quote if `: ` (colon-space) appears anywhere in the value;
      - quote if the value contains a literal `"`;
      - otherwise emit as a plain (unquoted) scalar.
    """
    if s is None or s == '':
        return '""'
    if ': ' in s or '"' in s:
        body = s.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{body}"'
    return s


def yaml_enum_value(s):
    """Return a YAML scalar for an enum string value.

    Numbers, booleans, and the empty string must be quoted so YAML keeps
    them as strings rather than parsing as int/bool/null.
    """
    if s == '':
        return '""'
    if _looks_numeric(s) or s in _YAML_RESERVED:
        body = s.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{body}"'
    if ': ' in s or '"' in s:
        body = s.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{body}"'
    # A leading YAML indicator character (e.g. '>' in '>=80', or '-', '?', '*')
    # makes an unquoted scalar invalid — quote it.
    if s[0] in '-?:,[]{}#&*!|>\'"%@`' or s[0].isspace() or s[-1].isspace():
        body = s.replace('\\', '\\\\').replace('"', '\\"')
        return f'"{body}"'
    return s


def emit_property(lines, indent, col, col_description):
    """Append OpenAPI schema lines for a single property at `indent`."""
    name = col['name']
    pad = ' ' * indent
    # Quote property names that are YAML reserved literals (e.g. NULL).
    key = f'"{name}"' if name in _YAML_RESERVED else name
    lines.append(f"{pad}{key}:")

    inner = ' ' * (indent + 2)

    # CHECK enum overrides regular type mapping — but type is still emitted.
    if col['check_values']:
        lines.append(f"{inner}type: string")
        lines.append(f"{inner}enum:")
        seen = set()
        ordered = []
        for v in col['check_values']:
            if v in seen:
                continue
            seen.add(v)
            ordered.append(v)
        for v in ordered:
            lines.append(f"{inner}  - {yaml_enum_value(v)}")
    else:
        type_pairs = sql_to_openapi(col)
        for k, v in type_pairs:
            lines.append(f"{inner}{k}: {v}")

    if col_description:
        lines.append(f"{inner}description: {yaml_quote(col_description)}")


def problem_response(L, code, description):
    """An error response, which every form's back-end answers as RFC 9457."""
    L.append(f'        "{code}":')
    L.append(f"          description: {description}")
    L.append("          content:")
    L.append("            application/problem+json:")
    L.append("              schema:")
    L.append('                $ref: "#/components/schemas/Problem"')


def too_many_requests(L):
    """The `429` that every route can answer, past the per-client rate limit."""
    L.append('        "429":')
    L.append("          description: This client sent too many requests")
    L.append("          headers:")
    L.append("            retry-after:")
    L.append("              description: Seconds to wait before sending again")
    L.append("              schema:")
    L.append("                type: integer")
    L.append("          content:")
    L.append("            application/problem+json:")
    L.append("              schema:")
    L.append('                $ref: "#/components/schemas/Problem"')


def emit_problem_schema(L):
    """The RFC 9457 problem object, as `axa` writes it."""
    L.append("    Problem:")
    L.append("      type: object")
    L.append("      description: RFC 9457 problem details")
    L.append("      properties:")
    L.append("        type:")
    L.append("          type: string")
    L.append("          description: A URI identifying the problem type")
    L.append("        title:")
    L.append("          type: string")
    L.append("          description: A short summary of the problem type")
    L.append("        status:")
    L.append("          type: integer")
    L.append("          description: The HTTP status code")
    L.append("        detail:")
    L.append("          type: string")
    L.append("          description: An explanation of this occurrence")
    L.append("        instance:")
    L.append("          type: string")
    L.append("          description: A URI identifying this occurrence")
    L.append("        code:")
    L.append("          type: string")
    L.append("          description: A short machine-readable reason")
    L.append("        errors:")
    L.append("          type: object")
    L.append("          description: Per-field detail, when validation failed")
    L.append("      required:")
    L.append("        - type")
    L.append("        - title")
    L.append("        - status")


def build_yaml(table_name, columns, form_slug, source_table_names,
               table_comment, column_comments):
    """Render a single OpenAPI 3.1 yaml document."""
    # deleted_at is server state: no request sets it and no response carries it.
    columns = [c for c in columns if c['name'] != 'deleted_at']
    resource = snake_to_pascal(table_name)
    title = f"{slug_title(form_slug)} — {resource}"
    plural = pluralize_route(table_name)
    if table_comment:
        info_description = table_comment
        schema_description = table_comment
    else:
        info_description = (
            f"OpenAPI specification for the {table_name} resource of the "
            f"{form_slug} form."
        )
        schema_description = None

    L = []
    L.append("# Generated from sql/. Do not edit by hand.")
    L.append(f"# SOURCE: {', '.join(source_table_names)}")
    L.append("openapi: 3.1.0")
    L.append("info:")
    L.append(f"  title: {title}")
    L.append("  version: 1.0.0")
    L.append(f"  description: {yaml_quote(info_description)}")
    L.append("paths:")
    L.append(f"  /api/{plural}:")
    L.append("    get:")
    L.append(f"      summary: List {resource} records")
    L.append(f"      operationId: list{resource}")
    L.append("      parameters:")
    L.append("        - name: limit")
    L.append("          in: query")
    L.append("          schema:")
    L.append("            type: integer")
    L.append("            minimum: 1")
    L.append("            maximum: 1000")
    L.append("            default: 100")
    L.append("          required: false")
    L.append("        - name: offset")
    L.append("          in: query")
    L.append("          schema:")
    L.append("            type: integer")
    L.append("            minimum: 0")
    L.append("            maximum: 100000")
    L.append("            default: 0")
    L.append("          required: false")
    L.append("      responses:")
    L.append('        "200":')
    L.append(f"          description: A page of {resource} records")
    L.append("          headers:")
    for header, meaning in (
        ("x-total-count", "Rows there are in all"),
        ("x-limit", "The limit applied"),
        ("x-offset", "The offset applied"),
    ):
        L.append(f"            {header}:")
        L.append(f"              description: {meaning}")
        L.append("              schema:")
        L.append("                type: integer")
    L.append("          content:")
    L.append("            application/json:")
    L.append("              schema:")
    L.append("                type: array")
    L.append("                items:")
    L.append(f'                  $ref: "#/components/schemas/{resource}"')
    problem_response(L, "400", "The offset is past the maximum")
    too_many_requests(L)
    L.append("    post:")
    L.append(f"      summary: Create a new {resource}")
    L.append(f"      operationId: create{resource}")
    L.append("      requestBody:")
    L.append("        required: true")
    L.append("        content:")
    L.append("          application/json:")
    L.append("            schema:")
    L.append(f'              $ref: "#/components/schemas/{resource}"')
    L.append("      responses:")
    L.append('        "200":')
    L.append(f"          description: The newly created {resource}")
    L.append("          content:")
    L.append("            application/json:")
    L.append("              schema:")
    L.append(f'                $ref: "#/components/schemas/{resource}"')
    problem_response(L, "400", "The request was refused")
    problem_response(L, "409", "It duplicates a row, or refers to a missing one")
    problem_response(L, "422", "The body does not match the schema")
    too_many_requests(L)
    L.append(f"  /api/{plural}/{{id}}:")
    L.append("    parameters:")
    L.append("      - name: id")
    L.append("        in: path")
    L.append("        required: true")
    L.append("        schema:")
    L.append("          type: string")
    L.append("          format: uuid")
    L.append("    get:")
    L.append(f"      summary: Fetch one {resource} by id")
    L.append(f"      operationId: get{resource}")
    L.append("      responses:")
    L.append('        "200":')
    L.append(f"          description: The requested {resource}")
    L.append("          content:")
    L.append("            application/json:")
    L.append("              schema:")
    L.append(f'                $ref: "#/components/schemas/{resource}"')
    problem_response(L, "404", f"{resource} not found")
    too_many_requests(L)
    L.append("    patch:")
    L.append(f"      summary: Update an existing {resource}")
    L.append(f"      operationId: update{resource}")
    L.append("      requestBody:")
    L.append("        required: true")
    L.append("        content:")
    L.append("          application/json:")
    L.append("            schema:")
    L.append(f'              $ref: "#/components/schemas/{resource}"')
    L.append("      responses:")
    L.append('        "200":')
    L.append(f"          description: The updated {resource}")
    L.append("          content:")
    L.append("            application/json:")
    L.append("              schema:")
    L.append(f'                $ref: "#/components/schemas/{resource}"')
    problem_response(L, "404", f"{resource} not found")
    problem_response(L, "409", "It duplicates a row, or refers to a missing one")
    problem_response(L, "422", "The body does not match the schema")
    too_many_requests(L)
    L.append("    delete:")
    L.append(f"      summary: Delete a {resource}")
    L.append(f"      operationId: delete{resource}")
    L.append("      responses:")
    L.append('        "200":')
    L.append(f"          description: {resource} deleted")
    problem_response(L, "404", f"{resource} not found")
    too_many_requests(L)
    L.append("components:")
    L.append("  schemas:")
    emit_problem_schema(L)
    L.append(f"    {resource}:")
    L.append("      type: object")
    L.append("      properties:")
    for col in columns:
        desc = column_comments.get((table_name, col['name']), '')
        emit_property(L, 8, col, desc)
    # required = NOT NULL except id
    required = [c['name'] for c in columns if c['not_null'] and c['name'] != 'id']
    L.append("      required:")
    for r in required:
        L.append(f"        - {r}")
    if schema_description is not None:
        L.append(f"      description: {yaml_quote(schema_description)}")
    return "\n".join(L) + "\n"


def process_form(form_dir):
    sql_dir = form_dir / "sql"
    if not sql_dir.is_dir():
        return 0

    openapi_dir = form_dir / "openapi"
    form_slug = form_dir.name

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

    # Dedupe by table name, last wins.
    deduped = {}
    for name, cols in all_tables:
        deduped[name] = cols
    all_tables = list(deduped.items())

    table_comments, column_comments = parse_comments(all_sql)

    source_for = {name: [name] for name, _ in all_tables}
    expected_files = {f"{t[0]}.yaml" for t in all_tables}

    openapi_dir.mkdir(exist_ok=True)

    count = 0
    for table_name, columns in all_tables:
        text = build_yaml(
            table_name, columns, form_slug,
            source_for.get(table_name, [table_name]),
            table_comments.get(table_name, ''),
            column_comments,
        )
        (openapi_dir / f"{table_name}.yaml").write_text(text, encoding="utf-8")
        count += 1

    for f in openapi_dir.glob("*.yaml"):
        if f.name not in expected_files:
            f.unlink()

    return count


def main():
    total_forms = 0
    total_files = 0

    form_dirs = sorted(
        d for d in FORMS_DIR.iterdir()
        if d.is_dir() and (d / "sql").is_dir()
    )

    for form_dir in form_dirs:
        count = process_form(form_dir)
        if count > 0:
            total_forms += 1
            total_files += count
            print(f"  {form_dir.name}: {count} .yaml files")

    print(f"\nTotal: {total_forms} forms, {total_files} .yaml files generated")


if __name__ == "__main__":
    main()
