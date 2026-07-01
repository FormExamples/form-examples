# breast-screening — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — reporting clinicians (mammographer, advanced practitioner, breast radiologist, screening-office).

## Form-specific tables

- `04_create_table_breast_screening.sql` — main screening header: context and identification, eligibility, consent, mammogram views, double-read opinions and arbitration, the reading outcome, and the five-point breast imaging classification when assessed.
- `05_create_table_breast_screening_grade.sql` — result classification: eligibility status, outcome band (result class), recommended screening outcome / next action, and completeness status (1:1, unique FK CASCADE).
- `06_create_table_breast_screening_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_breast_screening_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
