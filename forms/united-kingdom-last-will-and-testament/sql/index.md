# united-kingdom-last-will-and-testament — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_testator.sql` — the person making the will.

## Form-specific tables

- `03_create_table_united_kingdom_last_will_and_testament.sql` — main will record: testator, estate, executors, four beneficiary slots with percentage shares, family and funeral wishes, and the execution and witness facts.
- `04_create_table_united_kingdom_last_will_and_testament_grade.sql` — validity classification: validity class (valid/incomplete/formality-risk), shares total, witness count, and formality-risk indicator (1:1 UNIQUE FK CASCADE to the will).
- `05_create_table_united_kingdom_last_will_and_testament_grade_rule.sql` — audit trail of fired validity rules (FK CASCADE to grade).
- `06_create_table_united_kingdom_last_will_and_testament_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
