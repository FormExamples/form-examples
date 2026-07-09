# mental-state-examination — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — assessing clinician (role: psychiatrist / mental-health-nurse / gp / liaison / other).

## Form-specific tables

- `04_create_table_mental_state_examination.sql` — main MSE header: assessment context, patient / clinician identification, and the seven ASEPTIC domains (appearance and behaviour, speech, emotion, perception, thought, insight and judgement, cognition) plus the clinical formulation.
- `05_create_table_mental_state_examination_grade.sql` — completeness-and-risk grade: status (complete/partial), risk level (none/low/moderate/high), completeness percentage, per-domain documented flags (1:1 UNIQUE FK CASCADE).
- `06_create_table_mental_state_examination_grade_rule.sql` — audit trail of fired completeness-and-risk rules (FK CASCADE to grade, indexed).
- `07_create_table_mental_state_examination_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade, indexed).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
