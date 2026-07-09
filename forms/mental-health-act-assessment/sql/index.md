# mental-health-act-assessment — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — AMHP and medical practitioners.

## Form-specific tables

- `04_create_table_mental_health_act_assessment.sql` — main assessment header: context and identification, assessing professionals, statutory criteria, nearest-relative consultation, and recommendation and outcome.
- `05_create_table_mental_health_act_assessment_grade.sql` — legal-completeness and classification result: completeness status (valid/incomplete), recommended-section class, urgency class (1:1 UNIQUE FK CASCADE to the assessment).
- `06_create_table_mental_health_act_assessment_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_mental_health_act_assessment_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
