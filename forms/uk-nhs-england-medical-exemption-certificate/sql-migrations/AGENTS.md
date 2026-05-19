# SQL Migrations — UK NHS England Medical Exemption Certificate (FP92A)

Liquibase-formatted PostgreSQL migrations defining the canonical data model
for the FP92A medical exemption application. The schema is the source of truth
from which the XML, FHIR R5, Protocol Buffers, TypeSpec, and Rust SeaORM
entities are generated.

See [`../AGENTS.md`](../AGENTS.md) for the form overview.

## Tables

| # | File | Table | Purpose |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` + `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Applicant demographics |
| 03 | `03_create_table_practitioner.sql` | `practitioner` | Signing practitioner |
| 04 | `04_create_table_eligible_condition.sql` | `eligible_condition` | Lookup of the 10 qualifying conditions |
| 05 | `05_create_table_application.sql` | `application` | FP92A application instance |
| 06 | `06_create_table_application_eligible_condition.sql` | `application_eligible_condition` | Join with condition-specific detail |
| 07 | `07_create_table_grade.sql` | `grade` | Eligibility determination |
| 08 | `08_create_table_grade_fired_rule.sql` | `grade_fired_rule` | Rules that fired during grading |
| 09 | `09_create_table_grade_additional_flag.sql` | `grade_additional_flag` | Advisory flags raised during grading |

## Conventions

- UUIDv4 primary keys with `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` on every table.
- Soft-deletes via `deleted_at IS NULL`.
- `set_updated_at()` trigger keeps `updated_at` current.
- Empty string `''` is the canonical "no value" for text / enum fields.
- `null` is the canonical "no value" for numeric and date fields.
- snake_case column names.
- `CHECK` constraints enumerate allowed enum values, including `''`.
- FK cascade `ON DELETE CASCADE` for owned child rows.

## Applying

```sh
psql "$DATABASE_URL" -f 00_create_extensions.sql
psql "$DATABASE_URL" -f 01_create_function_set_updated_at.sql
psql "$DATABASE_URL" -f 02_create_table_patient.sql
# ... in numeric order
```

Or run via Liquibase in CI.
