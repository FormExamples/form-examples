# Bhutani Bilirubin Nomogram — SQL schema

PostgreSQL schema (source of truth) for the Bhutani bilirubin nomogram
assessment. Numbered migrations create the trigger function, shared entities,
the main assessment record, and the computed classification with its rule and
flag audit tables. Foreign keys cascade within the form; references to
`patient` and `clinician` are delete restricted. Foreign-key targets are
created before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | newborn-infant demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_bhutani_bilirubin_nomogram.sql` | `bhutani_bilirubin_nomogram` | main assessment record: context, infant identification, measurement inputs, and risk factors |
| 05 | `05_create_table_bhutani_bilirubin_nomogram_grade.sql` | `bhutani_bilirubin_nomogram_grade` | computed classification (1:1): risk zone, percentile band, interpolated phototherapy and exchange thresholds, above-threshold signals |
| 06 | `06_create_table_bhutani_bilirubin_nomogram_grade_rule.sql` | `bhutani_bilirubin_nomogram_grade_rule` | audit trail of fired classification rules |
| 07 | `07_create_table_bhutani_bilirubin_nomogram_grade_flag.sql` | `bhutani_bilirubin_nomogram_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
