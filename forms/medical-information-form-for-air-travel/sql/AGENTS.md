# SQL migrations — Medical Information Form for Air Travel

PostgreSQL 18 schema for the MEDIF form. Each migration follows the monorepo
SQL conventions (UUIDv4 primary keys, timestamps + soft-delete, `set_updated_at()`
trigger, `COMMENT ON TABLE` and `COMMENT ON COLUMN` for every table and column).

## Migrations

```
00_create_extensions.sql                                                  pgcrypto
01_create_function_set_updated_at.sql                                     reusable trigger fn
02_create_table_patient.sql                                               passenger demographics
03_create_table_clinician.sql                                             attending physician
04_create_table_medical_information_form_for_air_travel.sql               main form row
05_create_table_medical_information_form_for_air_travel_grade.sql         fitness-band result
06_create_table_medical_information_form_for_air_travel_grade_rule.sql    fired rules
07_create_table_medical_information_form_for_air_travel_grade_flag.sql    safety flags
```

## Conventions

- UUIDv4 PK via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` on every table.
- `set_updated_at()` trigger applied to every table.
- snake_case columns; no `VARCHAR(n)` unless an enum length matters.
- `CHECK ... IN (...)` constraints for enum columns (always include `''` so the
  default unanswered value is valid).
- Empty string `''` default for unanswered text/enum fields; `NULL` for
  unanswered numeric and date fields.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
psql -f sql/02_create_table_patient.sql --set ON_ERROR_STOP=1
```
