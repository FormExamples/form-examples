"""Read a form's SQL and its Axum crate's migrations, for the fleet tools."""

import re
from dataclasses import dataclass, field
from pathlib import Path

TYPES = {
    "VARCHAR": ("varchar", "String"),
    "CHAR": ("varchar", "String"),
    "TEXT": ("text", "String"),
    "UUID": ("uuid", "Uuid"),
    "BOOLEAN": ("boolean", "bool"),
    "BOOL": ("boolean", "bool"),
    "INTEGER": ("integer", "i32"),
    "INT": ("integer", "i32"),
    "SMALLINT": ("integer", "i32"),
    "NUMERIC": ("double precision", "f64"),
    "DECIMAL": ("double precision", "f64"),
    "REAL": ("double precision", "f64"),
    "DOUBLE PRECISION": ("double precision", "f64"),
    "DATE": ("date", "Date"),
    "TIME": ("time", "Time"),
    "TIMESTAMPTZ": ("timestamp with time zone", "DateTimeWithTimeZone"),
    "JSONB": ("jsonb", "serde_json::Value"),
    "BYTEA": ("bytea", "Vec<u8>"),
    "BIGINT": ("bigint", "i64"),
}
TABLE_LEVEL = ("CONSTRAINT", "PRIMARY", "UNIQUE", "FOREIGN", "CHECK", "EXCLUDE")
STOP = r"(?=\s+(?:NOT\s+NULL|NULL|UNIQUE|REFERENCES|CHECK|PRIMARY|CONSTRAINT)\b|\s*$)"


@dataclass
class Column:
    name: str
    sql: str
    rust: str
    nullable: bool
    default: str | None = None
    unique: bool = False
    references: str | None = None
    on_delete: str = ""


@dataclass
class Table:
    name: str
    columns: list = field(default_factory=list)
    uniques: list = field(default_factory=list)

    def domain(self):
        return [c for c in self.columns
                if c.name not in ("id", "created_at", "updated_at", "deleted_at")]


def plural(name):
    """The fleet's table plural; matches pluralize_route in the OpenAPI generator."""
    if re.search(r"(ss|x|z|ch|sh)$", name):
        return name + "es"
    if name.endswith("s"):
        return name
    if re.search(r"[^aeiou]y$", name):
        return name[:-1] + "ies"
    return name + "s"


def split_top(body):
    """Split a CREATE TABLE body at top-level commas, outside quotes and parens."""
    parts, depth, quoted, current = [], 0, False, []
    for char in body:
        if char == "'":
            quoted = not quoted
        if not quoted:
            depth += char == "("
            depth -= char == ")"
            if char == "," and depth == 0:
                parts.append("".join(current))
                current = []
                continue
        current.append(char)
    parts.append("".join(current))
    return [part.strip() for part in parts if part.strip()]


def create_bodies(text):
    """Yield (table, body) for each CREATE TABLE, matching the closing paren."""
    text = re.sub(r"--[^\n]*", "", text)
    for match in re.finditer(r'CREATE TABLE(?: IF NOT EXISTS)?\s+"?(\w+)"?\s*\(', text, re.I):
        depth, quoted, start = 1, False, match.end()
        for index in range(start, len(text)):
            char = text[index]
            if char == "'":
                quoted = not quoted
            elif not quoted:
                depth += char == "("
                depth -= char == ")"
                if depth == 0:
                    yield match[1], text[start:index]
                    break


def parse_column(part):
    match = re.match(r'"?(\w+)"?\s+(.*)$', part, re.S)
    name, rest = match[1], " ".join(match[2].split())
    kind = re.match(r"(DOUBLE PRECISION|TIMESTAMP WITH TIME ZONE|[A-Za-z]+)(\([^)]*\))?", rest, re.I)
    word = kind[1].upper().replace("TIMESTAMP WITH TIME ZONE", "TIMESTAMPTZ")
    # A column of a CREATE TYPE enum is plain varchar in the crates.
    sql, rust = TYPES.get(word, ("varchar", "String"))
    tail = rest[kind.end():]
    default = re.search(r"\bDEFAULT\s+(\(.*?\)|'(?:[^']|'')*'|\S+?(?:\(\))?)" + STOP, tail, re.I)
    value = default[1] if default else None
    if value is not None and value.upper() == "NULL":
        value = None
    if value is not None:
        value = re.sub(r"::\w+$", "", value)
    if value is not None and re.fullmatch(r"now\(\)", value, re.I):
        value = "CURRENT_TIMESTAMP"
    refers = re.search(r'REFERENCES\s+"?(\w+)"?\s*\(\s*"?id"?\s*\)(?:\s+ON DELETE ((?:SET )?\w+(?: ACTION)?))?',
                       tail, re.I)
    stripped = re.sub(r"\bCHECK\s*\(.*\)", " ", tail, flags=re.I)
    return Column(
        name=name, sql=sql, rust=rust,
        nullable=not re.search(r"\bNOT\s+NULL\b|\bPRIMARY\s+KEY\b", stripped, re.I),
        default=value,
        unique=bool(re.search(r"\bUNIQUE\b", stripped, re.I)),
        references=refers[1] if refers else None,
        on_delete=(refers[2] or "NO ACTION").upper() if refers else "",
    )


def parse_tables(text):
    tables = {}
    for name, body in create_bodies(text):
        table = Table(name)
        for part in split_top(body):
            head = part.split(None, 1)[0].strip('"').upper()
            if head in TABLE_LEVEL:
                unique = re.match(r'(?:CONSTRAINT\s+\S+\s+)?UNIQUE\s*\((.*?)\)', part, re.I | re.S)
                if unique:
                    table.uniques.append([c.strip(' "\n') for c in unique[1].split(",")])
                foreign = re.search(
                    r'FOREIGN KEY\s*\(\s*"?(\w+)"?\s*\)\s*REFERENCES\s+"?(\w+)"?\s*\(\s*"?id"?\s*\)'
                    r"(?:\s+ON DELETE ((?:SET )?\w+(?: ACTION)?))?", part, re.I)
                if foreign:
                    for column in table.columns:
                        if column.name == foreign[1]:
                            column.references = foreign[2]
                            column.on_delete = (foreign[3] or "NO ACTION").upper()
                continue
            table.columns.append(parse_column(part))
        tables[name] = table
    return tables


def sql_tables(form):
    tables = {}
    for path in sorted((form / "sql").glob("*.sql")):
        if path.name != "schema.sql":
            tables.update(parse_tables(path.read_text()))
    return tables


def apply_alters(tables, text):
    """Follow the ALTER TABLE statements that change a table's columns."""
    for match in re.finditer(r'ALTER TABLE\s+"?(\w+)"?\s+(.*?);', text, re.S):
        table = tables.get(match[1])
        action = " ".join(match[2].split())
        if table is None:
            continue
        added = re.match(r"ADD COLUMN (?:IF NOT EXISTS )?(.*)", action, re.I)
        dropped = re.match(r'DROP COLUMN (?:IF EXISTS )?"?(\w+)"?', action, re.I)
        relaxed = re.match(r'ALTER COLUMN "?(\w+)"? DROP NOT NULL', action, re.I)
        renamed = re.match(r'RENAME COLUMN "?(\w+)"? TO "?(\w+)"?', action, re.I)
        required = re.match(r'ALTER COLUMN "?(\w+)"? SET NOT NULL', action, re.I)
        if renamed:
            for column in table.columns:
                if column.name == renamed[1]:
                    column.name = renamed[2]
        elif required:
            for column in table.columns:
                if column.name == required[1]:
                    column.nullable = False
        elif added:
            table.columns.append(parse_column(added[1]))
        elif dropped:
            table.columns = [c for c in table.columns if c.name != dropped[1]]
        elif relaxed:
            for column in table.columns:
                if column.name == relaxed[1]:
                    column.nullable = True


def migration_tables(crate, before=None):
    """The crate's tables after its migrations, or only those older than `before`."""
    tables = {}
    for path in sorted((crate / "migrations").glob("*.up.sql")):
        if before is not None and path.name >= before:
            break
        text = path.read_text()
        tables.update(parse_tables(text))
        apply_alters(tables, text)
    return tables


def resolve(name, table, migrated):
    """The crate table for a SQL table: its plural, its own name, or the same columns."""
    for candidate in (plural(name), name):
        if candidate in migrated:
            return candidate
    wanted = {c.name for c in table.columns}
    best, score = None, 0.0
    for other, candidate in migrated.items():
        have = {c.name for c in candidate.columns}
        overlap = len(have & wanted) / max(1, len(have | wanted))
        if overlap > score:
            best, score = other, overlap
    return best if score > 0.9 else None


def source_dir(crate):
    """The crate's module directory, src/<snake>/."""
    return next(path.parent for path in crate.glob("src/*/app.rs"))


def crates(root, slugs, every):
    base = root / "forms"
    if every or not slugs:
        return sorted(path.parent for path in base.glob("*/back-end-with-axum"))
    return [base / slug for slug in slugs]
