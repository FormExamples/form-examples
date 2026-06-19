# Meeting — FHIR HL7 R5 Agent Instructions

Generated FHIR HL7 R5 JSON resources for the meeting form. One JSON file
per SQL table. These are generated artefacts — do not edit by hand; regenerate
from `../sql-migrations/` instead.

## Tools

- `bin/fhir-r5/generate-fhir-r5-representations.py` — regenerates every
  `*.json` file from the SQL migrations.
- `bin/test-form meeting` — validates the generated set.

See [`AGENTS/fhir-r5.md`](../../../AGENTS/fhir-r5.md) for the per-stack
generator contract.

## File naming convention

- `<sql_table>.json` — one resource per SQL table, snake_case file names
  matching the migration's table name.

## Contents

| File | SQL table | FHIR R5 resource role |
| --- | --- | --- |
| `organizer.json` | `organizer` | *Practitioner* / *RelatedPerson* — meeting organiser |
| `meeting.json` | `meeting` | *Appointment* (or *Encounter* for clinical MDT) |
| `agenda_item.json` | `agenda_item` | Contained *PlanDefinition.action* list |
| `participant.json` | `participant` | `Appointment.participant` slice |
| `resource.json` | `resource` | `Appointment.basedOn` *DeviceRequest* / *Location* / *DocumentReference* |
| `recurring_rule.json` | `recurring_rule` | `Appointment.recurrenceTemplate` |
| `action_item.json` | `action_item` | *Task* |
| `meeting_output.json` | `meeting_output` | *DocumentReference* |
| `meeting_outcome.json` | `meeting_outcome` | *Observation* |
| `meeting_grade.json` | `meeting_grade` | *Observation* — overall validation grade |
| `meeting_grade_rule.json` | `meeting_grade_rule` | *DetectedIssue* — individual fired rule |
| `meeting_grade_flag.json` | `meeting_grade_flag` | *Flag* — non-blocking warning |

## Mapping rules

- `id` — UUID copied verbatim from the SQL row.
- `meta.lastUpdated` — sourced from `updated_at`.
- `status` — mapped from the SQL `status` enum onto the resource's
  status value-set.
- Foreign keys become `Reference` objects (`{"reference": "Meeting/<uuid>"}`).
- Empty strings in SQL are omitted from the JSON.

## Conventions

- camelCase JSON field names per the FHIR specification.
- Each file is a single resource (not a Bundle); composition into a
  *Bundle* is performed by the front-ends and the Rust backend at
  export time.
- British English spelling in any prose `text.div` field.

## Verify

```sh
bin/test-form meeting
```
