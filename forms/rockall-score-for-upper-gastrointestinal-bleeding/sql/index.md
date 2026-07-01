# Rockall Score for Upper Gastrointestinal Bleeding — SQL schema

PostgreSQL schema (source of truth) for the Rockall assessment. Numbered
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
| 04 | `04_create_table_rockall_score_for_upper_gastrointestinal_bleeding.sql` | `rockall_score_for_upper_gastrointestinal_bleeding` | main assessment record: context, identification, three clinical parameter inputs, two endoscopic parameter inputs |
| 05 | `05_create_table_rockall_score_for_upper_gastrointestinal_bleeding_grade.sql` | `rockall_score_for_upper_gastrointestinal_bleeding_grade` | computed grade (1:1): per-parameter points, clinical score 0-7, full score 0-11 (nullable), risk band |
| 06 | `06_create_table_rockall_score_for_upper_gastrointestinal_bleeding_grade_rule.sql` | `rockall_score_for_upper_gastrointestinal_bleeding_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_rockall_score_for_upper_gastrointestinal_bleeding_grade_flag.sql` | `rockall_score_for_upper_gastrointestinal_bleeding_grade_flag` | red-flag issues with priority and suggested action |

The full post-endoscopy score in `..._grade.full_score` is nullable: it is
`null` when `endoscopy_performed` is not `yes`, in which case the pre-endoscopy
`clinical_score` (0-7) stands and the band is reported as `clinical-only`
(except a clinical score of 0, reported `low`).

Some derived table, trigger, and index identifiers exceed PostgreSQL's 63-byte
limit and are silently truncated; because they are table-scoped there is no
collision.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
