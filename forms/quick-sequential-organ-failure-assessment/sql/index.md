# Quick Sequential Organ Failure Assessment (qSOFA) — SQL schema

PostgreSQL schema (source of truth) for the qSOFA assessment. Numbered
migrations create the trigger function, shared entities, the main assessment
record, and the computed grade with its rule and flag audit tables. Foreign keys
cascade within the form; references to `patient` and `clinician` are delete
restricted. Foreign-key targets are created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_quick_sequential_organ_failure_assessment.sql` | `quick_sequential_organ_failure_assessment` | main assessment record: context, identification, three criterion inputs |
| 05 | `05_create_table_quick_sequential_organ_failure_assessment_grade.sql` | `quick_sequential_organ_failure_assessment_grade` | computed grade (1:1): per-criterion points, total 0-3, risk band lower/higher, >= 2 threshold |
| 06 | `06_create_table_quick_sequential_organ_failure_assessment_grade_rule.sql` | `quick_sequential_organ_failure_assessment_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_quick_sequential_organ_failure_assessment_grade_flag.sql` | `quick_sequential_organ_failure_assessment_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
