# Return to Work — SQL Migrations

PostgreSQL schema for the Return to Work form, written as
Liquibase-formatted plain SQL migrations. Each numbered file creates
one table (or one extension / utility) and is the source of truth for
all generated XML, FHIR, Protocol Buffers, and TypeSpec
representations.

## File map

| # | File | Entity |
| --- | --- | --- |
| 00 | `00_create_extensions.sql` | `pgcrypto` for `gen_random_uuid()` |
| 01 | `01_create_function_set_updated_at.sql` | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` |
| 03 | `03_create_table_clinician.sql` | `clinician` |
| 04 | `04_create_table_employer.sql` | `employer` |
| 05 | `05_create_table_return_to_work.sql` | `return_to_work` |
| 06 | `06_create_table_return_to_work_restriction.sql` | `return_to_work_restriction` |
| 07 | `07_create_table_return_to_work_grade.sql` | `return_to_work_grade` |
| 08 | `08_create_table_return_to_work_grade_rule.sql` | `return_to_work_grade_rule` |
| 09 | `09_create_table_return_to_work_grade_flag.sql` | `return_to_work_grade_flag` |

## Entity diagram

```
employer ──────────┐
                   │
patient ────────► return_to_work ──┬─► return_to_work_restriction (*)
                   ▲               │
                   │               └─► return_to_work_grade (1)
clinician ─────────┘                       │
                                           ├─► return_to_work_grade_rule (*)
                                           └─► return_to_work_grade_flag (*)
```

- One `patient` may have many `return_to_work` records over time
  (one per absence episode or per Med 3 re-issue).
- One `clinician` may issue many statements; one `employer` may
  receive many statements.
- One `return_to_work` has many `return_to_work_restriction` rows
  (one per enumerated workplace adjustment).
- One `return_to_work` has exactly one `return_to_work_grade`
  (computed grading result).
- One grade has many `return_to_work_grade_rule` and many
  `return_to_work_grade_flag` rows.

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- `set_updated_at()` trigger keeps `updated_at` fresh.
- snake_case column names.
- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric and date fields.
- `CHECK` constraints enumerate every allowed enum value plus the
  empty string sentinel.

## Generate downstream representations

```sh
bin/xml-representations/generate-xml-representations.py return-to-work
bin/fhir-r5/generate-fhir-r5-representations.py return-to-work
bin/protobuf/generate-protobuf-representations.py return-to-work
```
