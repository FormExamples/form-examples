# learning-disability-annual-health-check — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — clinician who completed the check (GP, practice nurse, healthcare assistant, LD nurse, LD team).

## Form-specific tables

- `04_create_table_learning_disability_annual_health_check.sql` — main header: context and identification, one field per required component (reasonable adjustments and communication, physical health, screening and immunization uptake, medication review including STOMP, mental health and behaviour, syndrome-specific checks, carer and social), and the Health Action Plan.
- `05_create_table_learning_disability_annual_health_check_grade.sql` — completeness grade: status (complete/incomplete), completeness percentage, Health Action Plan completeness (1:1 UNIQUE FK CASCADE to the header).
- `06_create_table_learning_disability_annual_health_check_grade_rule.sql` — audit trail of fired completeness rules, one per required component with a completed flag (FK CASCADE to grade).
- `07_create_table_learning_disability_annual_health_check_grade_flag.sql` — clinical flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
