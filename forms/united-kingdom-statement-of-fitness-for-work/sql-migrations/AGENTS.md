# sql-migrations/ — Agent Instructions

PostgreSQL Liquibase migrations for the UK fit note. Migrations run in
numerical order; each file creates exactly one extension, function, or
table.

See [`./index.md`](./index.md) for the migration list and conventions.

## When to add a migration

- Add a new numbered file (`NN_create_table_<name>.sql`) for any new
  table.
- Never rewrite or rename an existing migration once it has been merged.
- Add a follow-up migration to alter or backfill an existing table.

## Conventions

- snake_case column names.
- UUIDv4 primary keys with `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- `set_updated_at()` trigger on every table.
- Enum columns use `VARCHAR` + `CHECK (col IN (...))`; the empty string
  `''` is the sentinel for "unanswered text/enum".
- `NULL` is the sentinel for "unanswered numeric / date".
- Every column carries a `COMMENT ON COLUMN`.
- Every table carries a `COMMENT ON TABLE`.
- Add GIN trigram indexes on free-text search columns.

## Downstream generators

These migrations drive:

- `../xml-representations/` (via `bin/xml-representations/generate-xml-representations.py`)
- `../fhir-r5/` (via `bin/fhir-r5/generate-fhir-r5-representations.py`)
- `../protobuf/` (via `bin/protobuf/generate-protobuf-representations.py`)
- `../full-stack-with-loco-tera-htmx-alpine-setup` (via
  `bin/generate-full-stack-with-loco.py`)

When you change a migration, re-run the generators to keep representations
in sync.

## Verify

```sh
bin/test-form united-kingdom-statement-of-fitness-for-work
```
