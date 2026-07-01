# newborn-blood-spot-screening — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — newborn (infant) demographics.
- `03_create_table_clinician.sql` — sample-taker clinicians.

## Form-specific tables

- `04_create_table_newborn_blood_spot_screening.sql` — main screening header: sample-taker and setting, baby identification, eligibility and consent, the sample event and its timing, sample quality, and the per-condition result class for the nine screened conditions (SCD, CF, CHT, PKU, MCADD, MSUD, IVA, GA1, HCU).
- `05_create_table_newborn_blood_spot_screening_grade.sql` — computed classification: overall screening outcome, referral status, and derived sample-quality flags (1:1, unique FK CASCADE).
- `06_create_table_newborn_blood_spot_screening_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_newborn_blood_spot_screening_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
