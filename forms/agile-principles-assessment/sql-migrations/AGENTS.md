# Agile Principles Assessment — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at TIMESTAMPTZ` with `set_updated_at()` trigger, `snake_case` columns,
`COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column. Child
tables reference `agile_principles_assessment(id) ON DELETE CASCADE` with a
UNIQUE constraint on the parent FK to enforce 1:1 where appropriate.

See root [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md) for
the full conventions.

## Tables

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_create_extensions.sql` | `pgcrypto` for `gen_random_uuid()` |
| 01 | `01_create_function_set_updated_at.sql` | `set_updated_at()` trigger function |
| 02 | `02_create_table_respondent.sql` | respondent identification |
| 03 | `03_create_table_agile_principles_assessment.sql` | one row per submission, includes the 12 Likert scores and comments |
| 04 | `04_create_table_agile_principles_assessment_grade.sql` | composite maturity, mean score, signed-off action plan (1:1 with assessment) |
| 05 | `05_create_table_agile_principles_assessment_grade_rule.sql` | fired coaching rules |
| 06 | `06_create_table_agile_principles_assessment_grade_flag.sql` | additional flags (burnout, technical debt, etc.) |
