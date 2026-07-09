# Return to Work — TypeSpec

Generated TypeSpec (`.tsp`) schemas for the Return to Work form.
TypeSpec is the source for an OpenAPI spec of the REST API exposed
by the Rust full-stack backend, and for a TypeScript client used by
the SvelteKit front-ends.

## File map (after generation)

| SQL table | TypeSpec file | Model |
| --- | --- | --- |
| `patient` | `patient.tsp` | `Patient` |
| `clinician` | `clinician.tsp` | `Clinician` |
| `employer` | `employer.tsp` | `Employer` |
| `return_to_work` | `return-to-work.tsp` | `ReturnToWork` |
| `return_to_work_restriction` | `return-to-work-restriction.tsp` | `ReturnToWorkRestriction` |
| `return_to_work_grade` | `return-to-work-grade.tsp` | `ReturnToWorkGrade` |
| `return_to_work_grade_rule` | `return-to-work-grade-rule.tsp` | `ReturnToWorkGradeRule` |
| `return_to_work_grade_flag` | `return-to-work-grade-flag.tsp` | `ReturnToWorkGradeFlag` |

## Conventions

- TypeSpec model and property names are camelCase, matching the
  TypeScript front-end convention.
- Enums become `union` types with literal string members.
- UUID columns become `string` with `@format("uuid")`.
- TIMESTAMPTZ becomes `utcDateTime`.
- DATE becomes `plainDate`.
- TIME becomes `plainTime`.
- NUMERIC becomes `decimal`.

## Outputs

A future enhancement will emit:

- `openapi.yaml` (API documentation).
- `types.ts` (TypeScript client types, dropped into
  `front-end-with-svelte/src/lib/api/`).

## Verify

```sh
tsp compile typespec/
```
