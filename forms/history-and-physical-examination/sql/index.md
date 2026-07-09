# history-and-physical-examination — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — clerking clinician (role: doctor / acp / physician-associate / other).

## Form-specific tables

- `04_create_table_history_and_physical_examination.sql` — main H&P clerking header: encounter context, patient / clinician identification, the full history, vital signs, examination by body system, investigations, impression, and management plan as free text.
- `05_create_table_history_and_physical_examination_grade.sql` — completeness grade: status (complete/partial/incomplete) and completeness percentage over the ten required components (1:1 with the clerking record, FK CASCADE).
- `06_create_table_history_and_physical_examination_grade_rule.sql` — audit trail of fired completeness rules (FK CASCADE to grade).
- `07_create_table_history_and_physical_examination_grade_flag.sql` — safety flags with priority and suggested action; the allergies-not-documented and no-impression-or-plan categories are blocking (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
