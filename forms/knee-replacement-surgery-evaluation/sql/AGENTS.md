# Knee Replacement Surgery Evaluation — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at` + `deleted_at TIMESTAMPTZ` with a `set_updated_at()` trigger,
`snake_case` columns, `''` default for unanswered text and enum columns with a
`CHECK` constraint that admits `''`, `NULL` for unanswered numeric, date, and
time columns, and `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and
column.

`knee_replacement_surgery_evaluation_grade` references
`knee_replacement_surgery_evaluation(id) ON DELETE CASCADE` with a UNIQUE
constraint on the foreign key to enforce 1:1. The
`knee_replacement_surgery_evaluation_grade_flag` child references the grade
and is 1:many.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full conventions and the table-naming pattern.
