# Meeting — TypeSpec Agent Instructions

Planned TypeSpec API surface for the meeting form. No generator script
exists yet — the files in this directory are authored by hand until
`bin/typespec/generate-typespec-representations.py` is written. The
schema mirrors the SQL migrations in `../sql/`.

## Tools

- TypeSpec compiler (`tsp compile .`) — emits OpenAPI 3 + JSON Schema.
- `bin/test-form meeting` — validates the generated set.

Future work: a `bin/typespec/generate-typespec-representations.py`
generator that mirrors the FHIR / XML / protobuf generators and reads
the SQL migrations as its source of truth.

## File naming convention

- `main.tsp` — namespace declaration, server URL, common imports.
- `<entity>.tsp` — one model + one route group per SQL table.
- `operations.tsp` — cross-entity operations (`validate`, ICS export).

## Planned API surface

| Resource | Operations |
| --- | --- |
| `meeting` | `list`, `read`, `create`, `update`, `delete` |
| `participant` | `list`, `read`, `create`, `update`, `delete` |
| `agenda_item` | `list`, `read`, `create`, `update`, `delete` |
| `resource` | `list`, `read`, `create`, `update`, `delete` |
| `action_item` | `list`, `read`, `create`, `update`, `delete` |
| `meeting_output` | `list`, `read`, `create`, `update`, `delete` |
| `meeting_outcome` | `list`, `read`, `create`, `update`, `delete` |
| `recurring_rule` | `read`, `create`, `update`, `delete` (0..1 per meeting) |
| `meeting/{id}/validate` | `POST` — run `validateMeeting()` and return the fired rules and flags |
| `meeting/{id}/ics` | `GET` — emit an RFC 5545 iCalendar payload |
| `meeting/{id}/fhir` | `GET` — emit a FHIR R5 Appointment / Encounter Bundle |

## Mapping rules

- One TypeSpec `model` per SQL table; field names in camelCase.
- SQL `UUID` becomes `string` with `@format("uuid")`.
- SQL `TIMESTAMPTZ` becomes `utcDateTime`.
- SQL enums become TypeSpec `enum` declarations.
- `validate` operation returns the same shape as `validateMeeting()`:
  `durationMinutes`, `participantCount`, `acceptedCount`,
  `completionStatus`, `firedRules[]`, `flags[]`.

## Status

Scaffolding only. The actual `.tsp` files will be authored once the
SvelteKit and Rust backends settle the endpoint shapes.

## Verify

```sh
bin/test-form meeting
```
