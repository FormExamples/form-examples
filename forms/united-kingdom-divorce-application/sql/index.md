# united-kingdom-divorce-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_applicant.sql` — the applicant (the spouse or civil partner who applies).
- `03_create_table_caseworker.sql` — the legal adviser or court officer.

## Form-specific tables

- `04_create_table_united_kingdom_divorce_application.sql` — main application record: type and stage, marriage and certificate, jurisdiction facts, parties and service address, children and financial arrangements, and the stage dates.
- `05_create_table_united_kingdom_divorce_application_grade.sql` — readiness classification: application class (ready-to-apply/incomplete/not-eligible-yet), earliest eligible date, and jurisdiction-met flag (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_united_kingdom_divorce_application_grade_rule.sql` — audit trail of fired readiness rules (FK CASCADE to grade).
- `07_create_table_united_kingdom_divorce_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
