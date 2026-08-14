# Hospital Daily Monitoring Checklist — PostgreSQL migrations

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
| 02 | `02_create_table_hospital_daily_monitoring_checklist.sql` | one row per inspection round: hospital/site, inspecting officer, sign-off notes |
| 03 | `03_create_table_hospital_daily_monitoring_checklist_item.sql` | one row per answered checkpoint (of 97); FK to the parent round |

## Why a normalized child table, not one wide row

`agile-checklist` (57 items) stores one named column per item on the
submission table. This form has 97 checkpoints across 22 areas; a flat
table would need roughly 200 columns (status + remarks per checkpoint).
Instead, `hospital_daily_monitoring_checklist_item` stores one row per
answered checkpoint, keyed by `item_code` (the dotted identifier from
[`../spec/index.md`](../spec/index.md)) with a `UNIQUE
(hospital_daily_monitoring_checklist_id, item_code)` constraint.
