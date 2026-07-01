# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk — SQL schema

PostgreSQL schema (source of truth) for the CHA2DS2-VASc assessment. Numbered
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
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_cha2ds2_vasc.sql` | `cha2ds2_vasc` | main assessment record: context, identification, weighted criterion inputs |
| 05 | `05_create_table_cha2ds2_vasc_grade.sql` | `cha2ds2_vasc_grade` | computed grade (1:1): per-criterion sub-scores, total 0-9, risk band, annual stroke rate, anticoagulation recommendation |
| 06 | `06_create_table_cha2ds2_vasc_grade_rule.sql` | `cha2ds2_vasc_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_cha2ds2_vasc_grade_flag.sql` | `cha2ds2_vasc_grade_flag` | red-flag issues with priority and suggested action |

Because the form slug is long, some trigger identifiers exceed PostgreSQL's
63-byte limit and are silently truncated by the server; the canonical
`trigger_<table>_updated_at` names are used regardless and remain unique within
63 bytes.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
