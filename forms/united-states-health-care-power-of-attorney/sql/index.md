# united-states-health-care-power-of-attorney — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_principal.sql` — the person making the directive.
- `03_create_table_reviewer.sql` — the attorney, social worker, or facility staff member who reviews it.
- `04_create_table_united_states_health_care_power_of_attorney.sql` — the directive: principal, agent and successors, authority, treatment wishes, signing and witnesses, distribution of copies.
- `05_create_table_united_states_health_care_power_of_attorney_grade.sql` — readiness classification (ready-to-execute / incomplete / execution-risk), rule set applied, missing count (1:1 UNIQUE FK CASCADE to the directive).
- `06_create_table_united_states_health_care_power_of_attorney_grade_rule.sql` — audit trail of fired rules (FK CASCADE to grade).
- `07_create_table_united_states_health_care_power_of_attorney_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
