# Padua Venous Thromboembolism Risk Assessment — SQL schema

PostgreSQL schema (source of truth) for the Padua VTE risk assessment. Numbered
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
| 04 | `04_create_table_padua_venous_thromboembolism_risk_assessment.sql` | `padua_venous_thromboembolism_risk_assessment` | main assessment record: context, identification, eleven weighted risk-factor inputs, bleeding-risk check |
| 05 | `05_create_table_padua_venous_thromboembolism_risk_assessment_grade.sql` | `padua_venous_thromboembolism_risk_assessment_grade` | computed grade (1:1): per-factor points, total 0-20, risk band low/high, prophylaxis recommendation |
| 06 | `06_create_table_padua_venous_thromboembolism_risk_assessment_grade_rule.sql` | `padua_venous_thromboembolism_risk_assessment_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_padua_venous_thromboembolism_risk_assessment_grade_flag.sql` | `padua_venous_thromboembolism_risk_assessment_grade_flag` | red-flag issues with priority and suggested action |

## Scoring summary

Eleven weighted factors sum to a Padua Prediction Score of 0-20. Factors 1-4
(active cancer, previous VTE, reduced mobility >= 3 days, known thrombophilia)
score 3 points each; factor 5 (recent trauma or surgery <= 1 month) scores 2;
factors 6-11 (age >= 70, heart/respiratory failure, acute MI or ischaemic
stroke, acute infection/rheumatological, obesity BMI >= 30, ongoing hormonal
treatment) score 1 each. A score of **>= 4** classifies the patient as **high
risk** and prompts consideration of pharmacological thromboprophylaxis, subject
to the informational bleeding-risk check (`active_bleeding`,
`high_bleeding_risk`), which gates the recommendation but never changes the
score.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
