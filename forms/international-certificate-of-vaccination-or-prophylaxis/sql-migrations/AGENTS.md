# SQL migrations — agent instructions

Numbered Liquibase-format PostgreSQL 18 migrations. Apply in lexicographic
order; never renumber or rewrite a published migration.

Conventions documented in [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md):

- One CREATE TABLE per file.
- File name: `NN_create_table_<entity>.sql` where `NN` is the two-digit prefix.
- UUIDv4 primary keys, `created_at` / `updated_at` / `deleted_at` TIMESTAMPTZ.
- `set_updated_at()` trigger per table.
- `snake_case` column names.
- `COMMENT ON TABLE` and `COMMENT ON COLUMN` on every table and column.
- `CHECK (... IN (...))` constraints on text-valued enums.

ICVP-specific:

- Country codes use ISO 3166-1 alpha-3 (the WHO model uses the three-letter
  form). Alpha-2 is retained on the `patient` / `clinician` / `center`
  contact-address columns to match the canonical patient table.
- Image fields (signature, stamp) are stored as data URLs in TEXT columns;
  binary blobs are not used so the schema is portable to JSON/XML/FHIR exports.
- `disease` codes use the kebab-case slugs documented in `index.md`.
