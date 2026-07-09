# bowel-cancer-screening-with-faecal-immunochemical-test — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

Because the form slug is long, every table, column, index, and trigger uses the
short base **`bowel_cancer_screening_fit`** to stay within PostgreSQL's 63-byte
identifier limit.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics (the screening participant).
- `03_create_table_clinician.sql` — reviewing clinician / screening administrator.

## Form-specific tables

- `04_create_table_bowel_cancer_screening_fit.sql` — main FIT record header: review context, participant identification, eligibility and invitation, kit return and sample adequacy, the measured faecal haemoglobin concentration and programme threshold, and red-flag symptoms.
- `05_create_table_bowel_cancer_screening_fit_grade.sql` — result classification: result class, recommended management action, symptomatic-pathway indicator, and completeness status (1:1, unique FK CASCADE).
- `06_create_table_bowel_cancer_screening_fit_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_bowel_cancer_screening_fit_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
