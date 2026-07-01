# Sequential Organ Failure Assessment (SOFA) — SQL schema

PostgreSQL schema (source of truth) for the Sequential Organ Failure Assessment
(SOFA) score. Numbered migrations create the trigger function, shared entities,
the main assessment record, and the computed grade with its rule and flag audit
tables. Foreign keys cascade within the form; references to `patient` and
`clinician` are delete restricted. Foreign-key targets are created before their
referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_sequential_organ_failure_assessment.sql` | `sequential_organ_failure_assessment` | main assessment record: context, patient identification and baseline, and the raw inputs for the six organ systems |
| 05 | `05_create_table_sequential_organ_failure_assessment_grade.sql` | `sequential_organ_failure_assessment_grade` | computed grade (1:1): six 0-4 sub-scores, total 0-24, delta-SOFA, mortality band, Sepsis-3 flag |
| 06 | `06_create_table_sequential_organ_failure_assessment_grade_rule.sql` | `sequential_organ_failure_assessment_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_sequential_organ_failure_assessment_grade_flag.sql` | `sequential_organ_failure_assessment_grade_flag` | red-flag issues with priority and suggested action |

## Six organ systems and their raw inputs

| System | Raw inputs (columns on `sequential_organ_failure_assessment`) |
| --- | --- |
| Respiration | `pao2`, `fio2`, `pao2_fio2_ratio`, `respiratory_support` |
| Coagulation | `platelets` |
| Liver | `bilirubin` |
| Cardiovascular | `map`, `vasopressor`, `vasopressor_dose` |
| Central nervous system | `glasgow_coma_scale`, `sedated` |
| Renal | `creatinine`, `urine_output` |

Cardiovascular and renal sub-scores take the maximum band across their two
criteria; respiration sub-scores of 3-4 require respiratory support. Numeric
inputs are nullable (`NULL` = unanswered); enum and free-text inputs default to
`''`. A missing input yields a `NULL` sub-score and an incomplete-assessment
flag — the engine never guesses.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
