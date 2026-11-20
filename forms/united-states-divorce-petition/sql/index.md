# united-states-divorce-petition — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_petitioner.sql` — the filing spouse.
- `03_create_table_attorney.sql` — the preparing attorney or self-help facilitator (optional).

## Form-specific tables

- `04_create_table_united_states_divorce_petition.sql` — the petition record: filing, spouses and residency, children and support, property, service of process, and the decree.
- `05_create_table_united_states_divorce_petition_grade.sql` — computed readiness class (ready-to-file, incomplete, not-yet-eligible), property regime and earliest decree date.
- `06_create_table_united_states_divorce_petition_grade_rule.sql` — audit trail of rules that fired.
- `07_create_table_united_states_divorce_petition_grade_flag.sql` — flagged issues with priority and suggested action.

`schema.sql` is the combined, generated schema.
