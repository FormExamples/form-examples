# abdominal-aortic-aneurysm-screening — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — screening technicians / scanners.

## Form-specific tables

- `04_create_table_abdominal_aortic_aneurysm_screening.sql` — main screening header: scan context, patient identification and eligibility, consent, the ultrasound measurement (maximum antero-posterior aortic diameter), and clinical observations.
- `05_create_table_abdominal_aortic_aneurysm_screening_grade.sql` — diameter classification: category, surveillance/referral band, recommended action, and interval growth (1:1, unique FK CASCADE).
- `06_create_table_abdominal_aortic_aneurysm_screening_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_abdominal_aortic_aneurysm_screening_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
