# Wells Score for Pulmonary Embolism (PE) — SQL schema

PostgreSQL (Liquibase-formatted) migrations. This directory is the source of
truth for the schema; the XML, FHIR, protobuf, and OpenAPI representations are
generated from it. Migrations run in numeric order; foreign-key targets are
created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | Enables `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (trigram search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `set_updated_at()` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Assessing clinician identity. |
| 04 | `04_create_table_wells_score_for_pulmonary_embolism.sql` | `wells_score_for_pulmonary_embolism` | Main assessment: context plus the seven weighted criterion inputs (+3, +1.5, +1). |
| 05 | `05_create_table_wells_score_for_pulmonary_embolism_grade.sql` | `wells_score_for_pulmonary_embolism_grade` | Computed result (1:1): total score, two-level and three-level bands, recommended pathway. |
| 06 | `06_create_table_wells_score_for_pulmonary_embolism_grade_rule.sql` | `wells_score_for_pulmonary_embolism_grade_rule` | Audit trail of fired scoring rules. |
| 07 | `07_create_table_wells_score_for_pulmonary_embolism_grade_flag.sql` | `wells_score_for_pulmonary_embolism_grade_flag` | Clinically significant flags with priority and suggested action. |

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table; a
  `set_updated_at` trigger per table.
- snake_case identifiers; `VARCHAR(n)` + `CHECK` enums default to `''`; free
  text is `TEXT`; the total Wells score is `NUMERIC` to carry the 1.5-point
  weights.
- Foreign keys cascade within the form (grade, grade rules, grade flags) and
  restrict deletes to `patient` and `clinician`.
