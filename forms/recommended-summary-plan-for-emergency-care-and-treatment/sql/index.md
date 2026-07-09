# recommended-summary-plan-for-emergency-care-and-treatment — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Short table base: `respect`

The full slug — `recommended_summary_plan_for_emergency_care_and_treatment`
— is 55 characters, so the derived names PostgreSQL builds for this form's
child tables, indexes, and triggers (e.g. a `_grade_flag_grade_id_idx` index
or a `trigger_..._updated_at` trigger) would exceed the 63-byte identifier
limit and be silently truncated, causing collisions. To stay well inside the
limit, every table, column, index, and trigger for this form uses the short
base name **`respect`** (the established acronym for the Recommended Summary
Plan for Emergency Care and Treatment):

- `respect` — the main plan header (not `recommended_summary_plan_...`).
- `respect_grade` — the completeness grade.
- `respect_grade_rule` — the fired mandatory rules.
- `respect_grade_flag` — the safety / governance flags.

Foreign-key columns follow the same base: `respect_id` on the grade table and
`respect_grade_id` on the rule and flag tables.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics for the person the plan is about.
- `03_create_table_clinician.sql` — completing / endorsing clinician identity.

## Form-specific tables

- `04_create_table_respect.sql` — main ReSPECT header: personal details, summary of health, preferences, clinical recommendations, CPR recommendation, ceilings of treatment, capacity and involvement, and clinician sign-off, as free text and enums.
- `05_create_table_respect_grade.sql` — completeness grade: status (complete/incomplete), completeness percentage (1:1 UNIQUE FK to `respect`, CASCADE).
- `06_create_table_respect_grade_rule.sql` — audit trail of the eight mandatory rules, each with a satisfied flag (FK CASCADE to grade).
- `07_create_table_respect_grade_flag.sql` — safety and governance flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
