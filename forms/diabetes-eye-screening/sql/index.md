# diabetes-eye-screening — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — screener / grader clinicians.

## Form-specific tables

- `04_create_table_diabetes_eye_screening.sql` — main screening header: grading context, patient identification, and the right-eye and left-eye grading blocks (retinopathy grade, maculopathy grade, photocoagulation marker, ungradable marker, visual acuity).
- `05_create_table_diabetes_eye_screening_grade.sql` — worst-eye classification and outcome: worst retinopathy and maculopathy grade, any-ungradable marker, recall / referral pathway, recall interval, and completeness status (1:1, unique FK CASCADE).
- `06_create_table_diabetes_eye_screening_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_diabetes_eye_screening_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
