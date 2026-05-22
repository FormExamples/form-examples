# united-kingdom-lasting-power-of-attorney-for-financial-decisions — TypeSpec

Single-source TypeSpec schema definitions for the LPA. One `model` per SQL
table in `../sql-migrations/` is declared in `main.tsp` inside the
`LpaFinance` service namespace.

Type mapping:
- `UUID` → `@format("uuid") string`
- `TEXT`, `VARCHAR` → `string`
- `BOOLEAN` → `boolean`
- `SMALLINT`, `INTEGER` → `int32`
- `NUMERIC` → `decimal`
- `DATE` → `plainDate`
- `TIMESTAMPTZ` → `utcDateTime`
- Enumerated `TEXT CHECK` columns → TypeSpec `enum` or `union`.

Compile with `tsp compile main.tsp`. Do not hand-edit; regenerate from
SQL via the form's generator (when available).
