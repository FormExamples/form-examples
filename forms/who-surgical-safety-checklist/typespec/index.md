# WHO Surgical Safety Checklist — TypeSpec

TypeSpec models for the WHO Surgical Safety Checklist data model. The canonical
source of truth is `../sql/`; these models mirror each SQL table 1:1.

- `main.tsp` — namespace `WhoSurgicalSafetyChecklist` with one model per SQL
  table.
- TypeSpec primitives: `string`, `int32`, `float64`, `plainDate`, `utcDateTime`.
- SQL `CHECK` enums are represented as TypeSpec union string literals.
- `@doc(...)` decorators mirror the SQL `COMMENT ON COLUMN` text.
- camelCase property names (SQL is snake_case; mapped 1:1).

## Models

| Model | Source table |
| --- | --- |
| `Patient` | `patient` |
| `Clinician` | `clinician` |
| `WhoSurgicalSafetyChecklist` | `who_surgical_safety_checklist` |
| `TeamMember` | `team_member` |
