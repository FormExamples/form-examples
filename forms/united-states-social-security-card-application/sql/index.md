# united-states-social-security-card-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — applicant demographics.
- `03_create_table_clinician.sql` — preparer or assisting staff member.

## Form-specific tables

- `04_create_table_ss5_application.sql` — main Form SS-5 record: request, applicant items, evidence documents, filer and signature, and the death-related Tell-SSA items. The Social Security number is never stored.
- `05_create_table_ss5_application_grade.sql` — classification: application class (ready-to-submit/incomplete/evidence-missing/not-eligible), missing-evidence count, and replacement-limit flag (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_ss5_application_grade_rule.sql` — audit trail of fired rules (FK CASCADE to grade).
- `07_create_table_ss5_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
