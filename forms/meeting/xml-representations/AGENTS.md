# Meeting — XML Representations Agent Instructions

Generated XML + DTD per SQL table. These are generated artefacts — do not
edit by hand; regenerate from `../sql-migrations/` instead.

## Tools

- `bin/xml-representations/generate-xml-representations.py` — regenerates
  every `<entity>.xml` and `<entity>.dtd` pair from the SQL migrations.
- `bin/test-form meeting` — validates the generated set.

See [`AGENTS/xml-representations.md`](../../../AGENTS/xml-representations.md)
for the per-stack generator contract.

## File naming convention

- `<sql_table>.xml` — example row using the SQL column names as elements.
- `<sql_table>.dtd` — Document Type Definition for the matching XML file.

## Contents

| Entity | XML | DTD |
| --- | --- | --- |
| `organizer` | `organizer.xml` | `organizer.dtd` |
| `meeting` | `meeting.xml` | `meeting.dtd` |
| `agenda_item` | `agenda_item.xml` | `agenda_item.dtd` |
| `participant` | `participant.xml` | `participant.dtd` |
| `resource` | `resource.xml` | `resource.dtd` |
| `recurring_rule` | `recurring_rule.xml` | `recurring_rule.dtd` |
| `action_item` | `action_item.xml` | `action_item.dtd` |
| `meeting_output` | `meeting_output.xml` | `meeting_output.dtd` |
| `meeting_outcome` | `meeting_outcome.xml` | `meeting_outcome.dtd` |
| `meeting_grade` | `meeting_grade.xml` | `meeting_grade.dtd` |
| `meeting_grade_rule` | `meeting_grade_rule.xml` | `meeting_grade_rule.dtd` |
| `meeting_grade_flag` | `meeting_grade_flag.xml` | `meeting_grade_flag.dtd` |

## Mapping rules

- Top-level element name matches the SQL table name.
- Child elements match the SQL column names verbatim (snake_case).
- The `id` column becomes both an `id` attribute and an `<id>` element.
- Empty string SQL defaults are rendered as empty elements.
- Timestamps are ISO 8601 with UTC `Z` suffix.

## Conventions

- snake_case element names matching the SQL columns.
- UTF-8 encoding, declared in the XML prologue.
- DTDs use `ELEMENT` and `ATTLIST` declarations; no XSD.

## Verify

```sh
bin/test-form meeting
```
