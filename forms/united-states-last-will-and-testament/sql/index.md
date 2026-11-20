# united-states-last-will-and-testament — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql`: required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql`: trigger function used by every `updated_at` column.
- `02_create_table_testator.sql`: the person making the will (contact details, state, citizenship status).
- `03_create_table_attorney.sql`: the drafting or supervising attorney (optional).

## Form-specific tables

- `04_create_table_united_states_last_will_and_testament.sql`: the main will plan: testator and state, family and spouse, estate and bequests, representative and clauses, execution plan and witnesses, and the self-proving affidavit.
- `05_create_table_united_states_last_will_and_testament_grade.sql`: validity classification: class (valid-ready-to-execute, incomplete, formality-risk), residuary total, estimated elective share, witness count, self-proved, federal estate-tax exposure, and state-rule source (1:1 UNIQUE FK CASCADE to the will).
- `06_create_table_united_states_last_will_and_testament_grade_rule.sql`: audit trail of fired validity rules (FK CASCADE to grade).
- `07_create_table_united_states_last_will_and_testament_grade_flag.sql`: flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql`: every migration concatenated (generated; do not hand-edit).
