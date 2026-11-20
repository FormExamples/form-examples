# united-states-durable-financial-power-of-attorney — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_principal.sql` — the person who signs the instrument.
- `03_create_table_agent.sql` — the primary agent (attorney-in-fact).

## Form-specific tables

- `04_create_table_united_states_durable_financial_power_of_attorney.sql` — main instrument: principal and governing state, durability and effectiveness, agent and successor, general grants and hot powers, gifting, notary and witness plan, and acceptance and use.
- `05_create_table_united_states_durable_financial_power_of_attorney_grade.sql` — readiness classification: validity class (ready-to-execute/incomplete/execution-risk), governing state rule, and execution-risk-indicated flag (1:1 UNIQUE FK CASCADE).
- `06_create_table_united_states_durable_financial_power_of_attorney_grade_rule.sql` — audit trail of fired rules (FK CASCADE to grade).
- `07_create_table_united_states_durable_financial_power_of_attorney_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
