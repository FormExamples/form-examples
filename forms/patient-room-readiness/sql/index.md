# Patient Room Readiness — PostgreSQL migrations

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
| 02 | `02_create_table_patient_room_readiness_checklist.sql` | single flat table: location, 25 boolean checkpoints, inspector, inspection date/time |

25 fixed checkpoints is small enough for one wide row per submission
(matching the `agile-checklist` convention), unlike
`hospital-daily-monitoring-checklist`'s 97-item normalized child table.
