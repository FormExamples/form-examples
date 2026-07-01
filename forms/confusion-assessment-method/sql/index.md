# Confusion Assessment Method (CAM) — SQL schema

PostgreSQL schema (source of truth) for the CAM delirium screen. Numbered
migrations create the extensions, the trigger function, the shared entities, the
main assessment record, and the computed classification with its rule and flag
audit tables. This is a **status / classification** form — the result is a
boolean delirium status plus the set of positive features, not a numeric score.
Foreign keys cascade within the form; references to `patient` and `clinician`
are delete restricted. Foreign-key targets are created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_confusion_assessment_method.sql` | `confusion_assessment_method` | main assessment record: context, identification, four feature inputs, CAM-ICU support fields |
| 05 | `05_create_table_confusion_assessment_method_grade.sql` | `confusion_assessment_method_grade` | computed classification (1:1): delirium status, present/absent/unable-to-assess, positive-feature set, motoric subtype |
| 06 | `06_create_table_confusion_assessment_method_grade_rule.sql` | `confusion_assessment_method_grade_rule` | audit trail of fired classification rules |
| 07 | `07_create_table_confusion_assessment_method_grade_flag.sql` | `confusion_assessment_method_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
