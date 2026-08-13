# Dietetic Assessment — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at` + `deleted_at TIMESTAMPTZ` with a `set_updated_at()` trigger,
`snake_case` columns, `''` default for unanswered text and enum columns with a
`CHECK` constraint that admits `''`, `NULL` for unanswered numeric, date, and
time columns, and `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and
column.

`dietic_assessment_grade` references `dietic_assessment(id) ON DELETE CASCADE`
with a UNIQUE constraint on the foreign key to enforce 1:1. The
`dietic_assessment_grade_rule` and `dietic_assessment_grade_flag` children
reference the grade and are 1:many.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full conventions and the table-naming pattern.
