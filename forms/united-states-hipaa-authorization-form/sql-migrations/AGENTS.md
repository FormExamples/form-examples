# sql-migrations — Agent Instructions

PostgreSQL Liquibase migrations for the HIPAA authorization form. Each
file creates one table that maps 1:1 to a section of the 45 CFR
§ 164.508 authorization document.

See the monorepo conventions in
[`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md).

## Naming

- `00_extensions.sql` — required by `bin/test-form`.
- `01_create_function_set_updated_at.sql` — shared trigger function.
- `02_create_table_patient.sql` — shared patient table.
- `03_create_table_hipaa_authorization.sql` — parent entity.
- `04`..`11` — one child table per § 164.508(c)(1)/(2) section.
- `12`..`14` — validation result, fired rules, additional flags.
- `15_schema.sql` — generated concatenation; regenerate via
  `bin/sql-migrations/generate-sql-combined.py`.

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()` from `pgcrypto`.
- Every table has `created_at`, `updated_at`, `deleted_at`.
- `set_updated_at()` trigger applied per table.
- `CHECK` constraints for every enum-style column; empty string `''`
  permitted to represent "unanswered".
- `COMMENT ON TABLE` and `COMMENT ON COLUMN` for every table and
  column.
- Foreign keys to `hipaa_authorization` are `UNIQUE` for 1:1 child
  tables (one section per authorization).
- Foreign keys cascade on delete within the form's own schema.

## Regenerate downstream artefacts

```sh
bin/sql-migrations/generate-sql-combined.py
bin/xml-representations/generate-xml-representations.py
bin/fhir-r5/generate-fhir-r5-representations.py
bin/protobuf/generate-protobuf-representations.py
```
