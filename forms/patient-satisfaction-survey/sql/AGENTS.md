# Patient Satisfaction Survey — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` + `updated_at TIMESTAMPTZ` with `set_updated_at()` trigger, `snake_case` columns, `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column. Child `assessment_*` tables reference `assessment(id) ON DELETE CASCADE` with a UNIQUE constraint on `assessment_id` to enforce 1:1.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full conventions and the table-naming pattern.
