# Perioperative Optimization — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at` + `deleted_at TIMESTAMPTZ` with a `set_updated_at()` trigger,
`snake_case` columns, `''` default for unanswered text and enum columns with a
`CHECK` constraint that admits `''`, `NULL` for unanswered numeric, date, and
time columns, and `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and
column.

`perioperative_optimization_grade` references
`perioperative_optimization(id) ON DELETE CASCADE` with a UNIQUE constraint on
the foreign key to enforce 1:1. Its two children are 1:many:
`_grade_domain` holds one row per optimisation domain (the primary output of
this form, not a by-product), and `_grade_flag` holds the safety flags.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full conventions.
