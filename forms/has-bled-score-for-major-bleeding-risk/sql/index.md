# HAS-BLED Score for Major Bleeding Risk — SQL schema

PostgreSQL schema (source of truth) for the HAS-BLED assessment. Numbered
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
| 04 | `04_create_table_has_bled_score_for_major_bleeding_risk.sql` | `has_bled_score_for_major_bleeding_risk` | main assessment record: context, identification, nine criterion inputs |
| 05 | `05_create_table_has_bled_score_for_major_bleeding_risk_grade.sql` | `has_bled_score_for_major_bleeding_risk_grade` | computed grade (1:1): per-criterion 0-1 sub-scores, total 0-9, risk band, modifiable-factor summary |
| 06 | `06_create_table_has_bled_score_for_major_bleeding_risk_grade_rule.sql` | `has_bled_score_for_major_bleeding_risk_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_has_bled_score_for_major_bleeding_risk_grade_flag.sql` | `has_bled_score_for_major_bleeding_risk_grade_flag` | red-flag issues with priority and suggested action |

The nine criteria are H (uncontrolled hypertension), A (abnormal renal
function), A (abnormal liver function), S (stroke), B (bleeding history), L
(labile INR), E (elderly, > 65, derived from `age_years`), D (antiplatelets or
NSAIDs), and D (alcohol >= 8 units/week, derived from `alcohol_units_per_week`).
Each contributes 0 or 1 point for a total of 0-9; a total >= 3 bands as `high`
major-bleeding risk. The score pairs with, but does not compute, CHA2DS2-VASc,
which is recorded as an optional context input.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
