# 4AT — Rapid Delirium and Cognitive-Impairment Screen — SQL schema

PostgreSQL schema (source of truth) for the 4AT delirium screen. Numbered
migrations create the extensions, the trigger function, the shared entities, the
main assessment record, and the computed grade with its rule and flag audit
tables. Foreign keys cascade within the form; references to `patient` and
`clinician` are delete restricted. Foreign-key targets are created before their
referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-practitioner entity |
| 04 | `04_create_table_four_a_test_for_delirium.sql` | `four_a_test_for_delirium` | main assessment record: identification, context, four scored item inputs |
| 05 | `05_create_table_four_a_test_for_delirium_grade.sql` | `four_a_test_for_delirium_grade` | computed grade (1:1): per-item sub-scores, total 0-12, interpretation band |
| 06 | `06_create_table_four_a_test_for_delirium_grade_rule.sql` | `four_a_test_for_delirium_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_four_a_test_for_delirium_grade_flag.sql` | `four_a_test_for_delirium_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
