# Cataract Diagnostic Evaluation — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at` + `deleted_at TIMESTAMPTZ` with a `set_updated_at()` trigger,
`snake_case` columns, `''` default for unanswered text and enum columns with a
`CHECK` constraint that admits `''`, `NULL` for unanswered numeric, date, and
time columns, and `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and
column.

Bilateral clinical findings (visual acuity, refraction, LOCS III subscores,
tonometry, fundus findings, biometry) use paired `_right` / `_left` columns on
the single `cataract_diagnostic_evaluation` table, matching the precedent in
`../../eye-vision-test-result/sql/`.

`cataract_diagnostic_evaluation_grade` references
`cataract_diagnostic_evaluation(id) ON DELETE CASCADE` with a UNIQUE
constraint on the foreign key to enforce 1:1. The
`cataract_diagnostic_evaluation_grade_flag` child references the grade and is
1:many.

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the full conventions and the table-naming pattern.
