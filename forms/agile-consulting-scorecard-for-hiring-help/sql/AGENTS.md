# Agile Consulting Scorecard for Hiring Help — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at TIMESTAMPTZ` with `set_updated_at()` trigger, `snake_case` columns,
`COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column. Child
`agile_consulting_scorecard_for_hiring_help_grade*` tables reference
`agile_consulting_scorecard_for_hiring_help_grade(id) ON DELETE CASCADE`.

The 16 yes/no items are stored on the main table as `m1_done`..`m4_done`
(manifesto) and `p1_done`..`p12_done` (principles), each with a paired
`*_evidence` text field. `NULL` means unanswered; `TRUE` / `FALSE` are
explicit answers.

## Tables

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_extensions.sql` | `pgcrypto`, `pg_trgm` |
| 01 | `01_create_function_set_updated_at.sql` | Reusable trigger function |
| 02 | `02_create_table_organization.sql` | Organization being assessed |
| 03 | `03_create_table_respondent.sql` | Buyer-side respondent filling out the form |
| 04 | `04_create_table_agile_consulting_scorecard_for_hiring_help.sql` | Main scorecard with the 16 yes/no items and per-item evidence |
| 05 | `05_create_table_agile_consulting_scorecard_for_hiring_help_grade.sql` | Computed and signed-off grade (1:1) |
| 06 | `06_create_table_agile_consulting_scorecard_for_hiring_help_grade_rule.sql` | Audit trail of fired rules |
| 07 | `07_create_table_agile_consulting_scorecard_for_hiring_help_grade_flag.sql` | Readiness flags |

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the
full conventions.
