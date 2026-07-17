# General Practice Waiting List Card — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4
primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at`,
`updated_at`, and `deleted_at` `TIMESTAMPTZ` columns with the
`set_updated_at()` trigger, `snake_case` columns, `COMMENT ON TABLE` +
`COMMENT ON COLUMN` for every table and column.

Child `gen_practice_waiting_list_card_*` tables reference
`gen_practice_waiting_list_card(id) ON DELETE CASCADE`. The grade child uses a
`UNIQUE` constraint on its FK to enforce 1:1; the appointment, grade-rule,
and grade-flag children are 1:many.

See the root [`AGENTS/sql.md`](../../../AGENTS/sql.md)
for the full conventions and the table-naming pattern.
