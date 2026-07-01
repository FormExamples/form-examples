# Caprini Venous Thromboembolism Risk Assessment — SQL schema

PostgreSQL schema (source of truth) for the Caprini VTE risk assessment. Numbered
migrations create the extensions, the trigger function, shared entities, the main
assessment record, and the computed grade with its rule and flag audit tables.
Foreign keys cascade within the form; references to `patient` and `clinician` are
delete restricted. Foreign-key targets are created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_caprini_venous_thromboembolism_risk_assessment.sql` | `caprini_venous_thromboembolism_risk_assessment` | main assessment record: context, identification, age band, weighted 1/2/3/5-point risk-factor inputs, and bleeding risk |
| 05 | `05_create_table_caprini_venous_thromboembolism_risk_assessment_grade.sql` | `caprini_venous_thromboembolism_risk_assessment_grade` | computed grade (1:1): total score, risk band (very-low / low / moderate / high), and prophylaxis recommendation |
| 06 | `06_create_table_caprini_venous_thromboembolism_risk_assessment_grade_rule.sql` | `caprini_venous_thromboembolism_risk_assessment_grade_rule` | audit trail of fired grading rules (factor, weight group, points) |
| 07 | `07_create_table_caprini_venous_thromboembolism_risk_assessment_grade_flag.sql` | `caprini_venous_thromboembolism_risk_assessment_grade_flag` | red-flag issues with priority and suggested action |

## Scoring model

The total Caprini score is the age-band weight (`under-41` = 0, `41-60` = 1,
`61-74` = 2, `75-plus` = 3) plus the fixed weight of every fired risk factor
(1-, 2-, 3-, and 5-point groups). The total maps to a risk band — very-low
(0-1), low (2), moderate (3-4), high (>= 5) — and a prophylaxis recommendation.
When `high_bleeding_risk` is `yes`, any pharmacological recommendation is
downgraded to mechanical and a bleeding-contraindication flag is raised.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
