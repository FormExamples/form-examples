# Meeting — Protocol Buffers Agent Instructions

Generated Protocol Buffers `.proto` schemas per SQL table. These are
generated artefacts — do not edit by hand; regenerate from
`../sql/` instead.

## Tools

- `bin/protobuf/generate-protobuf-representations.py` — regenerates every
  `<entity>.proto` from the SQL migrations.
- `bin/test-form meeting` — validates the generated set.

## File naming convention

- `<sql_table>.proto` — one message per SQL table, snake_case file name
  matching the migration's table name.

## Contents

| File | SQL table | proto message |
| --- | --- | --- |
| `organizer.proto` | `organizer` | `Organizer` |
| `meeting.proto` | `meeting` | `Meeting` |
| `agenda_item.proto` | `agenda_item` | `AgendaItem` |
| `participant.proto` | `participant` | `Participant` |
| `resource.proto` | `resource` | `Resource` |
| `recurring_rule.proto` | `recurring_rule` | `RecurringRule` |
| `action_item.proto` | `action_item` | `ActionItem` |
| `meeting_output.proto` | `meeting_output` | `MeetingOutput` |
| `meeting_outcome.proto` | `meeting_outcome` | `MeetingOutcome` |
| `meeting_grade.proto` | `meeting_grade` | `MeetingGrade` |
| `meeting_grade_rule.proto` | `meeting_grade_rule` | `MeetingGradeRule` |
| `meeting_grade_flag.proto` | `meeting_grade_flag` | `MeetingGradeFlag` |

## Mapping rules

- `proto3` syntax.
- `package meeting;`
- One message per SQL table, named in PascalCase.
- Field numbers assigned in column-declaration order, starting at `1`.
- SQL `UUID` columns become `string` fields.
- SQL `TIMESTAMPTZ` columns become `google.protobuf.Timestamp` fields.
- SQL enums become `enum` declarations nested inside the message.
- `created_at`, `updated_at`, `deleted_at` are always present and
  occupy fixed field numbers across every message.

## Conventions

- snake_case field names matching the SQL columns.
- PascalCase message names.
- Trailing field numbers reserved for future additive fields.

## Verify

```sh
bin/test-form meeting
```
