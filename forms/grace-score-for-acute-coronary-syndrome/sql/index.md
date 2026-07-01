# GRACE Score for Acute Coronary Syndrome — SQL schema

PostgreSQL schema (source of truth) for the GRACE assessment. Numbered
migrations create the extensions, trigger function, shared entities, the main
assessment record, and the computed grade with its rule and flag audit tables.
Foreign keys cascade within the form; references to `patient` and `clinician`
are delete restricted. Foreign-key targets are created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_grace_score_for_acute_coronary_syndrome.sql` | `grace_score_for_acute_coronary_syndrome` | main assessment record: context, identification, eight GRACE variable inputs |
| 05 | `05_create_table_grace_score_for_acute_coronary_syndrome_grade.sql` | `grace_score_for_acute_coronary_syndrome_grade` | computed grade (1:1): weighted point total, in-hospital and 6-month mortality bands, overall risk category, invasive-strategy recommendation |
| 06 | `06_create_table_grace_score_for_acute_coronary_syndrome_grade_rule.sql` | `grace_score_for_acute_coronary_syndrome_grade_rule` | audit trail of fired per-variable point contributors |
| 07 | `07_create_table_grace_score_for_acute_coronary_syndrome_grade_flag.sql` | `grace_score_for_acute_coronary_syndrome_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
