# Meeting — SQL Migrations Agent Instructions

PostgreSQL schema for the meeting form, authored as numbered Liquibase
migrations. Applied in lexical order.

## Tools

- Author by hand following the [`AGENTS/sql.md`](../../../AGENTS/sql.md) guide.
- `bin/sql/generate-sql-comments.py` — append missing
  `COMMENT ON TABLE` / `COMMENT ON COLUMN` statements.
- `bin/sql/generate-sql-combined.py` — concatenate the numbered
  migrations into a single `schema.sql`.
- `bin/migrate-sql-filenames.py` — one-shot rename helper to enforce the
  canonical `NN_create_table_<name>.sql` layout.

## File naming convention

- `00_extensions.sql` — PostgreSQL extensions (`pgcrypto`, `pg_trgm`).
- `01_create_function_set_updated_at.sql` — shared `updated_at` trigger
  function reused by every table.
- `NN_create_table_<name>.sql` — one table per file, numbered from `02`.
- Each table file declares the table, indexes, the
  `set_updated_at` trigger, and `COMMENT ON` statements.

## Contents

| File | Entity | Purpose |
| --- | --- | --- |
| `00_extensions.sql` | — | Enable `pgcrypto` (UUID) and `pg_trgm` (free-text search) |
| `01_create_function_set_updated_at.sql` | — | Shared trigger function that bumps `updated_at` on row update |
| `02_create_table_organizer.sql` | `organizer` | Person who schedules and signs the record |
| `03_create_table_meeting.sql` | `meeting` | Top-level row — invitation metadata, 250-char summary, sign-off |
| `04_create_table_agenda_item.sql` | `agenda_item` | Ordered agenda topics with title, duration, presenter |
| `05_create_table_participant.sql` | `participant` | Named attendees with role, response, attendance |
| `06_create_table_resource.sql` | `resource` | Rooms, equipment, documents, links, budget |
| `07_create_table_recurring_rule.sql` | `recurring_rule` | RFC 5545 RRULE-shaped recurrence (0..1 per meeting) |
| `08_create_table_action_item.sql` | `action_item` | Tasks with owner, due date, status |
| `09_create_table_meeting_output.sql` | `meeting_output` | Tangible deliverables produced by the meeting |
| `10_create_table_meeting_outcome.sql` | `meeting_outcome` | Impact, change, or alignment achieved |
| `11_create_table_meeting_grade.sql` | `meeting_grade` | Persisted result of `validateMeeting()` |
| `12_create_table_meeting_grade_rule.sql` | `meeting_grade_rule` | Each rule fired during validation |
| `13_create_table_meeting_grade_flag.sql` | `meeting_grade_flag` | Non-blocking warnings surfaced on the dashboard |

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at` / `updated_at` / `deleted_at` timestamps on every table.
- snake_case column names.
- Empty string `''` for unanswered text and enum fields; `NULL` for
  numeric and timestamp fields.
- `CHECK` constraints inline the enum value list.
- `summary` on `meeting` is hard-capped via `CHECK (char_length(summary) <= 250)`.
- Each table file ends with `COMMENT ON TABLE` and `COMMENT ON COLUMN`
  statements describing the entity and every column.

## Verify

```sh
bin/test-form meeting
```
