# Medical Information Form for Air Travel — TypeSpec

[TypeSpec](https://typespec.io) interface definitions, one `.tsp` file per
SQL table in `../sql/`. TypeSpec is the API-modelling DSL used in
this monorepo as the camelCase source of truth for OpenAPI 3 and TypeScript
client generation.

## Files

```
patient.tsp
clinician.tsp
medical_information_form_for_air_travel.tsp
medical_information_form_for_air_travel_grade.tsp
medical_information_form_for_air_travel_grade_rule.tsp
medical_information_form_for_air_travel_grade_flag.tsp
```

## SQL → TypeSpec type mapping

| SQL | TypeSpec |
| --- | --- |
| `UUID` | `string` (with `@format("uuid")`) |
| `TEXT`, `VARCHAR(n)` | `string` |
| `CHAR(n)` | `string` |
| `INTEGER` | `int32` |
| `NUMERIC(p,s)` | `float64` |
| `DATE` | `plainDate` |
| `TIMESTAMPTZ` | `utcDateTime` |

`CHECK ... IN (...)` columns are emitted as TypeSpec union literals (e.g.
`"fit" | "fit-with-conditions" | "requires-review" | "unfit-to-fly" | ""`).

## Conventions

- Filenames mirror the SQL table name (`snake_case`).
- Property names use **camelCase** (TypeSpec / TypeScript idiomatic), even
  though the SQL columns are snake_case. The OpenAPI / Rust serializers map
  via `serde(rename_all = "camelCase")` on the Rust side and
  `@encodedName("application/json", "camelCase")` on the TypeSpec side
  where field renaming is needed.
- Optional fields (`?:`) when the SQL column is nullable.
- Soft-delete `deletedAt` is always optional.
- Namespace: `MedicalInformationFormForAirTravel`.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
tsp compile typespec/
```
