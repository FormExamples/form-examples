# Apgar Score — SQL schema

PostgreSQL schema (source of truth) for the Apgar-score assessment. Numbered
migrations create the trigger function, shared entities, the main assessment
record, the repeated per-timepoint sign scores, and the computed grade with its
rule and flag audit tables. Foreign keys cascade within the form; references to
`patient` and `clinician` are delete restricted. Foreign-key targets are created
before their referencers.

The five signs (Appearance, Pulse, Grimace, Activity, Respiration) are scored
0/1/2 at each timepoint (1, 5, and 10 minutes, and beyond); one
`apgar_score_timepoint` row holds each timepoint. The engine sums a total of
0-10 per timepoint, bands it (reassuring 7-10, moderately-low 4-6, low 0-3), and
reports the trend across timepoints.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | newborn patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | attending-clinician entity |
| 04 | `04_create_table_apgar_score.sql` | `apgar_score` | main assessment record: birth context, newborn identification, resuscitation notes |
| 05 | `05_create_table_apgar_score_timepoint.sql` | `apgar_score_timepoint` | repeated per-timepoint five-sign scores (one row per timepoint) |
| 06 | `06_create_table_apgar_score_grade.sql` | `apgar_score_grade` | computed grade (1:1): per-timepoint totals and bands, summary band, trend |
| 07 | `07_create_table_apgar_score_grade_rule.sql` | `apgar_score_grade_rule` | audit trail of fired grading rules |
| 08 | `08_create_table_apgar_score_grade_flag.sql` | `apgar_score_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
