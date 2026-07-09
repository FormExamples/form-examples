# UK Lasting Power of Attorney for Financial Decisions — XML and DTD

Generated artifacts: do not edit by hand. Regenerate via
`bin/xml-representations/generate-xml-representations.py <form-slug>`.

## Conventions

- One `<table>.xml` + one `<table>.dtd` pair per SQL table in
  `../sql/02_create_table_*.sql` through `17_create_table_*.sql`.
- Element names mirror SQL column names exactly (snake_case).
- Element order in the DTD matches the SQL column declaration order
  (`id`, audit columns, then domain columns).
- All elements are `(#PCDATA)` — DTDs describe structure, not type.
- Empty text values are emitted as empty elements (`<email></email>`).
- TIMESTAMPTZ values are ISO 8601 with `Z` zone (`2026-04-09T10:00:00Z`).
- DATE values are ISO 8601 date strings (`1955-05-20`).
- UUIDs are canonical lowercase 8-4-4-4-12 strings.
- BOOLEAN values are rendered as the literal text `true` / `false`.

## SQL-to-XML mapping rules

| SQL type | XML representation |
| --- | --- |
| `UUID` | text content, 36-char canonical UUID |
| `TEXT`, `VARCHAR` | text content (possibly empty) |
| `BOOLEAN` | text `true` / `false` |
| `SMALLINT`, `INTEGER`, `NUMERIC` | text decimal |
| `DATE` | ISO 8601 date |
| `TIMESTAMPTZ` | ISO 8601 timestamp with `Z` |

See root [`AGENTS/xml-representations.md`](../../../AGENTS/xml-representations.md)
for the full SQL→XML mapping rules and the canonical reference shape.
