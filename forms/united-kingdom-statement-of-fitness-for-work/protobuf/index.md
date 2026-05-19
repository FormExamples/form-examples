# Protocol Buffers — UK Statement of Fitness for Work

Protocol Buffers schemas for high-volume RPC interop, generated from the
SQL migrations in `../sql-migrations/`.

## Files

| SQL entity | `.proto` file |
| --- | --- |
| patient | `patient.proto` |
| clinician | `clinician.proto` |
| medical_practice | `medical_practice.proto` |
| fit_note | `united_kingdom_statement_of_fitness_for_work.proto` |
| grade | `united_kingdom_statement_of_fitness_for_work_grade.proto` |
| grade_rule | `united_kingdom_statement_of_fitness_for_work_grade_rule.proto` |
| grade_flag | `united_kingdom_statement_of_fitness_for_work_grade_flag.proto` |

## Conventions

- proto3 syntax.
- `snake_case` field names mirroring the SQL columns.
- Enums are `UPPER_SNAKE_CASE` with the column name as the prefix
  (e.g. `FITNESS_FOR_WORK_NOT_FIT`, `FITNESS_FOR_WORK_MAY_BE_FIT`).
- Timestamps use `google.protobuf.Timestamp`.
- Dates use `google.type.Date`.

## Regeneration

```sh
bin/protobuf/generate-protobuf-representations.py united-kingdom-statement-of-fitness-for-work
```

Do not edit `.proto` files by hand — they are generated from the SQL
migrations.
