# Ottawa Ankle Rules — SQL schema

PostgreSQL (Liquibase-formatted) migrations. This directory is the source of
truth for the schema; the XML, FHIR, protobuf, and OpenAPI representations are
generated from it. Migrations run in numeric order; foreign-key targets are
created before their referencers.

This instrument is a boolean **decision rule**, not a numeric score: the result
table stores two independent imaging decisions (ankle X-ray indicated, foot
X-ray indicated) plus the derived unable-to-bear-weight finding — there is no
total and no risk band.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | Enables `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (trigram search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `set_updated_at()` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Assessing clinician identity (doctor, nurse-practitioner, paramedic, physiotherapist, other). |
| 04 | `04_create_table_ottawa_ankle_rules.sql` | `ottawa_ankle_rules` | Main assessment: context, applicability flag, and the eight bedside criterion inputs. |
| 05 | `05_create_table_ottawa_ankle_rules_grade.sql` | `ottawa_ankle_rules_grade` | Computed decision (1:1): unable-to-bear-weight plus ankle and foot X-ray decisions. |
| 06 | `06_create_table_ottawa_ankle_rules_grade_rule.sql` | `ottawa_ankle_rules_grade_rule` | Audit trail of fired decision-rule criteria. |
| 07 | `07_create_table_ottawa_ankle_rules_grade_flag.sql` | `ottawa_ankle_rules_grade_flag` | Clinically significant flags with priority and suggested action. |

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table; a
  `set_updated_at` trigger per table.
- snake_case identifiers; `VARCHAR(n)` + `CHECK` enums default to `''`; free
  text is `TEXT`; measurements are `NUMERIC`.
- Bedside findings are captured as `yes` / `no` / `''` enums so an unanswered
  finding is distinguishable from a negative one.
- Foreign keys cascade within the form (grade, grade rules, grade flags) and
  restrict deletes to `patient` and `clinician`.
