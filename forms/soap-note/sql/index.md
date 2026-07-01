# soap-note — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — authoring / co-signing clinicians.

## Form-specific tables

- `04_create_table_soap_note.sql` — main SOAP-note header: encounter context, patient / clinician identification, and the four SOAP sections (Subjective, Objective, Assessment, Plan) as free text.
- `05_create_table_soap_note_grade.sql` — completeness grade: status (complete/partial/incomplete), completeness percentage, per-section presence flags.
- `06_create_table_soap_note_grade_rule.sql` — audit trail of fired completeness rules (FK CASCADE to grade).
- `07_create_table_soap_note_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
