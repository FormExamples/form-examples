# CURB-65 Pneumonia Severity Score — SQL schema

PostgreSQL schema (source of truth) for the CURB-65 pneumonia severity
assessment. Numbered migrations create the extensions, the trigger function,
the shared entities, the main assessment record, and the computed grade with its
rule and flag audit tables. Foreign keys cascade within the form; references to
`patient` and `clinician` are delete restricted. Foreign-key targets are created
before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_curb_65_pneumonia_severity_score.sql` | `curb_65_pneumonia_severity_score` | main assessment record: context, identification, the five criterion inputs, advisory adjuncts, disposition override |
| 05 | `05_create_table_curb_65_pneumonia_severity_score_grade.sql` | `curb_65_pneumonia_severity_score_grade` | computed grade (1:1): per-criterion sub-scores, total, score variant (curb-65/crb-65), risk band, recommended setting |
| 06 | `06_create_table_curb_65_pneumonia_severity_score_grade_rule.sql` | `curb_65_pneumonia_severity_score_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_curb_65_pneumonia_severity_score_grade_flag.sql` | `curb_65_pneumonia_severity_score_grade_flag` | advisory safety flags with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
