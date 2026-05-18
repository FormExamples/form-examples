# Agile Checklist — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at TIMESTAMPTZ` with `set_updated_at()` trigger, `snake_case` columns,
`COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column. Child
tables reference `agile_checklist(id) ON DELETE CASCADE` with a UNIQUE
constraint on the parent FK to enforce 1:1 where appropriate.

See root [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md) for
the full conventions.

## Tables

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_extensions.sql` | `pgcrypto` for `gen_random_uuid()` |
| 01 | `01_create_function_set_updated_at.sql` | `set_updated_at()` trigger function |
| 02 | `02_create_table_respondent.sql` | respondent identification |
| 03 | `03_create_table_agile_checklist.sql` | one row per submission, includes the 57 yes/no/not-applicable item columns grouped by section (`t01-t25`, `s01-s14`, `p01-p18`) |
| 04 | `04_create_table_agile_checklist_grade.sql` | composite maturity, per-section percentages and bands, signed-off action plan (1:1 with checklist) |
| 05 | `05_create_table_agile_checklist_grade_rule.sql` | fired coaching rules per section |
| 06 | `06_create_table_agile_checklist_grade_flag.sql` | additional flags (autonomy risk, trust risk, finished-work risk, etc.) |

## Custom domain

`agile_checklist_answer` is a `VARCHAR(20)` domain with a `CHECK` accepting
`'yes'`, `'no'`, `'not-applicable'`, or `''`. It is reused by all 57 item
columns to keep the schema concise and the constraint single-sourced.
