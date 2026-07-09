# cervical-screening — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — sample-taker clinicians.

## Form-specific tables

- `04_create_table_cervical_screening.sql` — main screening header: encounter context, patient identification, eligibility, consent, symptoms, sample adequacy, the primary hrHPV result, and reflex cytology.
- `05_create_table_cervical_screening_grade.sql` — result classification: result class, recommended management action, and completeness status (1:1, unique FK CASCADE).
- `06_create_table_cervical_screening_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_cervical_screening_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
