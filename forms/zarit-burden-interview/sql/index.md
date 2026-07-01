# Zarit Burden Interview — SQL schema

PostgreSQL schema (source of truth) for the Zarit Burden Interview. Numbered
migrations create the trigger function, shared entities, the main assessment
record, and the computed grade with its rule and flag audit tables. Foreign keys
cascade within the form; references to `patient` (the care recipient) and
`clinician` (the administering practitioner) are delete restricted. Foreign-key
targets are created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | care-recipient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | administering-practitioner entity |
| 04 | `04_create_table_zarit_burden_interview.sql` | `zarit_burden_interview` | main record: context, carer and recipient identification, 22 item ratings (0-4) |
| 05 | `05_create_table_zarit_burden_interview_grade.sql` | `zarit_burden_interview_grade` | computed grade (1:1): total, max score, burden band, 12-item short-form subtotal |
| 06 | `06_create_table_zarit_burden_interview_grade_rule.sql` | `zarit_burden_interview_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_zarit_burden_interview_grade_flag.sql` | `zarit_burden_interview_grade_flag` | red-flag issues with priority and suggested action |

Scoring: the carer rates 22 items on a 0-4 frequency scale summing to 0-88
(`zbi22`), banded little-or-none (0-21), mild-to-moderate (22-40),
moderate-to-severe (41-60), or severe (61-88). The 12-item short form (`zbi12`,
items 1,2,3,6,9,10,11,12,17,20,21,22) sums to 0-48 and bands lower (<17) or high
(>=17). A missing item contributes 0 and raises a completeness flag.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
