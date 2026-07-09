# SQL Migrations — UK Statement of Fitness for Work

PostgreSQL schema for the fit note (Med 3) — Liquibase-formatted ordered
migrations.

## Migration list

| Number | File | Purpose |
| --- | --- | --- |
| 00 | `00_create_extensions.sql` | enable `pgcrypto` for `gen_random_uuid()` |
| 01 | `01_create_function_set_updated_at.sql` | trigger function for `updated_at` |
| 02 | `02_create_table_patient.sql` | patient demographics |
| 03 | `03_create_table_clinician.sql` | issuing healthcare professional |
| 04 | `04_create_table_medical_practice.sql` | the practice (mandatory per DWP 3.7) |
| 05 | `05_create_table_united_kingdom_statement_of_fitness_for_work.sql` | the fit note itself |
| 06 | `06_..._grade.sql` | computed grading result (1:1 with the fit note) |
| 07 | `07_..._grade_rule.sql` | audit of every rule that fired |
| 08 | `08_..._grade_flag.sql` | safety flags |

## Conventions

- All tables carry `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`,
  `created_at`, `updated_at`, `deleted_at` columns.
- `set_updated_at()` trigger keeps `updated_at` fresh on every UPDATE.
- snake_case column names; enum columns use `VARCHAR` with a `CHECK`
  constraint; the empty string `''` is a sentinel for "unanswered".
- Numeric optional fields are nullable (use `NULL` not `''`).
- Foreign keys cascade-delete from the fit note row.

## Combined schema

Run `bin/sql/generate-sql-combined.py
united-kingdom-statement-of-fitness-for-work` to produce a single
`schema.sql` from the numbered migrations.
