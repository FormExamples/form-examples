# newborn-and-infant-physical-examination — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient (infant) demographics.
- `03_create_table_clinician.sql` — examining practitioner.

## Form-specific tables

- `04_create_table_newborn_and_infant_physical_examination.sql` — main NIPE screening header: context and baby identification, hip risk factors, the observation fields for the four key components (eyes, heart, hips, testes), the head-to-toe systematic-examination fields, measurements, and optional practitioner-recorded per-component results.
- `05_create_table_newborn_and_infant_physical_examination_grade.sql` — screening classification: per-component results, overall outcome (satisfactory/refer/incomplete), completeness status and percentage.
- `06_create_table_newborn_and_infant_physical_examination_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_newborn_and_infant_physical_examination_grade_flag.sql` — referral flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
