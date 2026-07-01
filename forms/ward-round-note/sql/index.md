# ward-round-note — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — reviewing clinician (ward-round roles).

## Form-specific tables

- `04_create_table_ward_round_note.sql` — main ward-round-note header: review header and patient / clinician identification plus the ten review components (overnight events, problem list, examination and NEWS2, investigations, VTE, medication, plan, escalation, estimated discharge) as free text and enum flags.
- `05_create_table_ward_round_note_grade.sql` — completeness grade: status (complete/partial/incomplete), completeness percentage over the eight required components, per-component presence flags (1:1 with the note).
- `06_create_table_ward_round_note_grade_rule.sql` — audit trail of fired completeness rules (FK CASCADE to grade, indexed).
- `07_create_table_ward_round_note_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade, indexed).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
