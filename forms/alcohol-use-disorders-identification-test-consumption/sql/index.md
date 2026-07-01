# AUDIT-C — SQL schema

PostgreSQL schema (source of truth) for the Alcohol Use Disorders Identification
Test — Consumption (AUDIT-C) assessment. Numbered migrations create the
extensions and trigger function, the shared entities, the main assessment
record, and the computed grade with its rule and flag audit tables. Foreign keys
cascade within the form; references to `patient` and `clinician` are delete
restricted. Foreign-key targets are created before their referencers.

The form slug (`alcohol-use-disorders-identification-test-consumption`) would
exceed PostgreSQL's 63-byte identifier limit, so every table, column, index, and
trigger uses the short base **`audit_c`** (`audit_c`, `audit_c_grade`,
`audit_c_grade_rule`, `audit_c_grade_flag`; foreign-key columns `audit_c_id` and
`audit_c_grade_id`).

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | administering-clinician entity |
| 04 | `04_create_table_audit_c.sql` | `audit_c` | main assessment record: context, identification, three consumption item inputs (each 0-4) |
| 05 | `05_create_table_audit_c_grade.sql` | `audit_c_grade` | computed grade (1:1): total 0-12, risk band, positive-screen indicator (>= 5) |
| 06 | `06_create_table_audit_c_grade_rule.sql` | `audit_c_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_audit_c_grade_flag.sql` | `audit_c_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
