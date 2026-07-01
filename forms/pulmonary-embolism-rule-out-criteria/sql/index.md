# Pulmonary Embolism Rule-out Criteria (PERC) — SQL schema

PostgreSQL (Liquibase-formatted) migrations. This directory is the source of
truth for the schema; the XML, FHIR, protobuf, and OpenAPI representations are
generated from it. Migrations run in numeric order; foreign-key targets are
created before their referencers.

PERC is a rule-out **classification** tool, not a graded severity score: the
result table stores a binary status (`perc-negative` / `perc-positive`), which
is `perc-negative` only when the pre-test probability is `low` **and** all eight
criteria are satisfied.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | Enables `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (trigram search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `set_updated_at()` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Assessing clinician identity. |
| 04 | `04_create_table_pulmonary_embolism_rule_out_criteria.sql` | `pulmonary_embolism_rule_out_criteria` | Main assessment: context, the pre-test probability gate, and the eight objective criterion inputs. |
| 05 | `05_create_table_pulmonary_embolism_rule_out_criteria_grade.sql` | `pulmonary_embolism_rule_out_criteria_grade` | Computed result (1:1): classification, all-criteria-satisfied flag, applicability, recommended pathway. |
| 06 | `06_create_table_pulmonary_embolism_rule_out_criteria_grade_rule.sql` | `pulmonary_embolism_rule_out_criteria_grade_rule` | Audit trail of fired classification rules. |
| 07 | `07_create_table_pulmonary_embolism_rule_out_criteria_grade_flag.sql` | `pulmonary_embolism_rule_out_criteria_grade_flag` | Clinically significant flags with priority and suggested action. |

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table; a
  `set_updated_at` trigger per table.
- snake_case identifiers; `VARCHAR(n)` + `CHECK` enums default to `''`; free
  text is `TEXT`; measurements are `NUMERIC`.
- Foreign keys cascade within the form (grade, grade rules, grade flags) and
  restrict deletes to `patient` and `clinician`.
