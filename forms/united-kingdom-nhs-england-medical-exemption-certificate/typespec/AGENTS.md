# UK NHS England Medical Exemption Certificate (FP92A) — TypeSpec

TypeSpec models for the FP92A data model. The canonical source of truth is
`../sql-migrations/`; these models mirror each SQL table 1:1.

- `main.tsp` — namespace `Fp92a` with one model per SQL table.
- TypeSpec primitives: `string`, `int32`, `float64`, `plainDate`, `utcDateTime`.
- SQL `CHECK` enums are represented as TypeSpec union string literals.
- `@doc(...)` decorators mirror the SQL `COMMENT ON COLUMN` text.
- camelCase property names (SQL is snake_case; mapped 1:1).

## Models

| Model | Source table |
| --- | --- |
| `Patient` | `patient` |
| `Practitioner` | `practitioner` |
| `EligibleCondition` | `eligible_condition` |
| `Application` | `application` |
| `ApplicationEligibleCondition` | `application_eligible_condition` |
| `Grade` | `grade` |
| `GradeFiredRule` | `grade_fired_rule` |
| `GradeAdditionalFlag` | `grade_additional_flag` |

## Compile

```sh
npx tsp compile main.tsp --emit @typespec/openapi3
```
