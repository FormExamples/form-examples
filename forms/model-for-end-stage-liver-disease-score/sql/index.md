# Model for End-Stage Liver Disease (MELD) Score — SQL schema

PostgreSQL schema (source of truth) for the MELD assessment. Numbered
migrations create the extensions and trigger function, the shared entities, the
main assessment record, and the computed grade with its rule and flag audit
tables. Foreign keys cascade within the form; references to `patient` and
`clinician` are delete restricted. Foreign-key targets are created before their
referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_model_for_end_stage_liver_disease_score.sql` | `model_for_end_stage_liver_disease_score` | main assessment record: context, identification, MELD variant, laboratory inputs |
| 05 | `05_create_table_model_for_end_stage_liver_disease_score_grade.sql` | `model_for_end_stage_liver_disease_score_grade` | computed grade (1:1): derived values, MELD score 6-40, mortality band, estimated mortality percent |
| 06 | `06_create_table_model_for_end_stage_liver_disease_score_grade_rule.sql` | `model_for_end_stage_liver_disease_score_grade_rule` | audit trail of fired calculation rules |
| 07 | `07_create_table_model_for_end_stage_liver_disease_score_grade_flag.sql` | `model_for_end_stage_liver_disease_score_grade_flag` | red-flag issues with priority and suggested action |

The MELD score is a weighted-logarithmic function of total bilirubin, INR, and
serum creatinine (`3.78·ln(bili) + 11.2·ln(inr) + 9.57·ln(creat) + 6.43`), with
a dialysis creatinine rule (creatinine set to 4.0 mg/dL when >= 2 haemodialysis
sessions in the past 7 days or >= 24 h CVVHD), value bounds (each term
lower-bounded to 1.0; creatinine capped at 4.0), an optional MELD-Na sodium
correction, the MELD 3.0 sex-and-albumin variant, a 6-40 clamp, and a mapped
3-month mortality band. The calculation lives in the front-end and back-end
engines; this schema stores its inputs and outputs.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
