# diabetes-podiatry-assessment — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — assessing clinicians.

## Form-specific tables

- `04_create_table_diabetes_podiatry_assessment.sql` — main assessment header: assessment context, patient-wide risk factors, and the right-foot and left-foot examination blocks (neuropathy status, pulses status, deformity, callus, skin breakdown, active ulcer + severity, previous ulcer/amputation, suspected Charcot).
- `05_create_table_diabetes_podiatry_assessment_grade.sql` — per-foot and overall risk classification: right/left foot risk, overall risk, review pathway, referral, review interval, and completeness status (1:1, unique FK CASCADE).
- `06_create_table_diabetes_podiatry_assessment_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_diabetes_podiatry_assessment_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
