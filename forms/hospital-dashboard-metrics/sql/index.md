# Hospital Dashboard Metrics — PostgreSQL migrations

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
| 02 | `02_create_table_hospital_dashboard_metrics.sql` | one row per reporting period: hospital/site, period month/year, prepared-by, sign-off |
| 03 | `03_create_table_hospital_dashboard_metric_value.sql` | one row per recorded metric (of 67); FK to the parent period |

## Why a normalised child table, not one wide row

67 metrics would need well over 130 flat columns (value + notes each)
on a single submission table. Instead, `hospital_dashboard_metric_value`
stores one row per recorded metric, keyed by `metric_code` (the dotted
identifier from [`../spec/index.md`](../spec/index.md)) with a
`UNIQUE (hospital_dashboard_metrics_id, metric_code)` constraint.
