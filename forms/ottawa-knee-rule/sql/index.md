# Ottawa Knee Rule — SQL schema

PostgreSQL (Liquibase-formatted) migrations. This directory is the source of
truth for the schema; the XML, FHIR, protobuf, and OpenAPI representations are
generated from it. Migrations run in numeric order; foreign-key targets are
created before their referencers.

The Ottawa Knee Rule is a binary imaging **decision rule** (knee radiograph
yes/no) driven by **ANY-of** logic across five criteria — it is not a numeric
score, so the result tables record a decision and the criteria that fired
rather than a total.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | Enables `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (trigram search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `set_updated_at()` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Assessing clinician identity. |
| 04 | `04_create_table_ottawa_knee_rule.sql` | `ottawa_knee_rule` | Main assessment: context plus the five objective bedside criterion inputs. |
| 05 | `05_create_table_ottawa_knee_rule_grade.sql` | `ottawa_knee_rule_grade` | Computed result (1:1): the binary imaging decision (`xray_indicated`, `decision`). |
| 06 | `06_create_table_ottawa_knee_rule_grade_rule.sql` | `ottawa_knee_rule_grade_rule` | Audit trail of evaluated decision rules (which criteria fired). |
| 07 | `07_create_table_ottawa_knee_rule_grade_flag.sql` | `ottawa_knee_rule_grade_flag` | Clinically significant flags with priority and suggested action. |

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table; a
  `set_updated_at` trigger per table.
- snake_case identifiers; `VARCHAR(n)` + `CHECK` enums default to `''`; free
  text is `TEXT`; measurements are `NUMERIC`.
- Foreign keys cascade within the form (grade, grade rules, grade flags) and
  restrict deletes to `patient` and `clinician`.
