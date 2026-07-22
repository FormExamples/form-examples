# Patient-Reported Outcome Measures — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4
primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`),
`created_at` + `updated_at TIMESTAMPTZ` with `set_updated_at()` trigger,
`snake_case` columns, `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every
table and column.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full
conventions.

## Tables

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_create_extensions.sql` | `pgcrypto` for `gen_random_uuid()` |
| 01 | `01_create_function_set_updated_at.sql` | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient_reported_outcome_measures.sql` | raw responses: visit header + all 36 (SF-36v2) + 10 (NDI) + 6 (mJOA) + 6 (EQ-5D-3L) items |
| 03 | `03_create_table_patient_reported_outcome_measures_score.sql` | computed scores (1:1 with the parent), always re-derivable from raw responses per `../spec/index.md` |

## Named columns, not a generic item map

Unlike the checklist-family forms (`hospital-daily-monitoring-checklist`,
`hospital-dashboard-metrics`, `hospital-performance-indicators`), this
form uses one named column per item. Each instrument here is a small,
fixed, well-known validated questionnaire (not an open-ended or
growing list), so named columns match the `pre-anaesthesia-assessment`
convention for clinical scoring-engine forms.
