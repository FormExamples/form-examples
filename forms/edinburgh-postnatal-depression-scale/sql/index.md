# Edinburgh Postnatal Depression Scale (EPDS) — SQL schema

PostgreSQL schema (source of truth) for the EPDS assessment. Numbered
migrations create the trigger function, shared entities, the main assessment
record, and the computed grade with its rule and flag audit tables. Foreign keys
cascade within the form; references to `patient` and `clinician` are delete
restricted. Foreign-key targets are created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | administering-clinician entity |
| 04 | `04_create_table_edinburgh_postnatal_depression_scale.sql` | `edinburgh_postnatal_depression_scale` | main assessment record: context, respondent identification, ten item responses (0-3 each) |
| 05 | `05_create_table_edinburgh_postnatal_depression_scale_grade.sql` | `edinburgh_postnatal_depression_scale_grade` | computed grade (1:1): total 0-30, interpretation band, item-10 self-harm score and mandatory flag |
| 06 | `06_create_table_edinburgh_postnatal_depression_scale_grade_rule.sql` | `edinburgh_postnatal_depression_scale_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_edinburgh_postnatal_depression_scale_grade_flag.sql` | `edinburgh_postnatal_depression_scale_grade_flag` | red-flag issues with priority and suggested action |

The ten item responses (`item_1`..`item_10`) store the already-reverse-corrected
0-3 scores (higher = more symptomatic); items 3, 5, 6, 7, 8, 9 and 10 are
reverse-scored at option→score mapping. A total of `>= 10` bands `possible` and
`>= 13` bands `likely`; item 10 `> 0` raises the mandatory urgent self-harm flag
regardless of the total.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
