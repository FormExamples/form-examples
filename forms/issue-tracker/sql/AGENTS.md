# Issue Tracker — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at TIMESTAMPTZ` with `set_updated_at()` trigger, `snake_case` columns,
`COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column. Child
`issue_tracker_grade*` tables reference `issue_tracker_grade(id) ON DELETE CASCADE`.

## Tables

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_extensions.sql` | `pgcrypto`, `pg_trgm` |
| 01 | `01_create_function_set_updated_at.sql` | Reusable trigger function |
| 02 | `02_create_table_reporter.sql` | Person who reported the issue |
| 03 | `03_create_table_participant.sql` | Discoverer / assignee / stakeholder |
| 04 | `04_create_table_issue_tracker.sql` | Main issue record with the nine SOAP sections and seven raw scores |
| 05 | `05_create_table_issue_tracker_grade.sql` | Computed and signed-off grading result (1:1) |
| 06 | `06_create_table_issue_tracker_grade_rule.sql` | Audit trail of fired rules |
| 07 | `07_create_table_issue_tracker_grade_flag.sql` | Safety-critical flags |

See root [`AGENTS/sql.md`](../../../AGENTS/sql.md) for the
full conventions.
