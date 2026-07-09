# WHO Surgical Safety Checklist — TypeSpec agent instructions

See `./index.md` for the model index.

- The canonical schema is `../sql/`. Keep `main.tsp` in sync with
  the SQL tables: one TypeSpec model per `CREATE TABLE`, same column-to-property
  mapping (snake_case → camelCase), same `CHECK` enum → union string literal.
- `@doc(...)` decorator text should mirror the SQL `COMMENT ON COLUMN` text.
- Unanswered enum / text columns use `''` in TypeScript and SQL; mirror that
  by adding `""` as a literal to the union (e.g.
  `"yes" | "no" | ""`).
