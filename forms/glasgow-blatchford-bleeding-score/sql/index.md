# Glasgow-Blatchford Bleeding Score — SQL schema

PostgreSQL schema (source of truth) for the Glasgow-Blatchford Bleeding Score
(GBS) assessment. Numbered migrations create the extensions, trigger function,
shared entities, the main assessment record, and the computed grade with its
rule and flag audit tables. Foreign keys cascade within the form; references to
`patient` and `clinician` are delete restricted. Foreign-key targets are created
before their referencers.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_glasgow_blatchford_bleeding_score.sql` | `glasgow_blatchford_bleeding_score` | main assessment record: context, identification, nine weighted parameter inputs |
| 05 | `05_create_table_glasgow_blatchford_bleeding_score_grade.sql` | `glasgow_blatchford_bleeding_score_grade` | computed grade (1:1): per-parameter points, total 0-23, risk band, recommended management |
| 06 | `06_create_table_glasgow_blatchford_bleeding_score_grade_rule.sql` | `glasgow_blatchford_bleeding_score_grade_rule` | audit trail of fired grading rules |
| 07 | `07_create_table_glasgow_blatchford_bleeding_score_grade_flag.sql` | `glasgow_blatchford_bleeding_score_grade_flag` | red-flag issues with priority and suggested action |

The score sums eight weighted admission parameters (blood urea, haemoglobin with
sex-specific bands, systolic blood pressure, pulse, melaena, syncope, hepatic
disease, cardiac failure) into a total of 0-23. A total of 0 is `very-low`
(consider outpatient management or discharge), 1-5 is `low-moderate`, and >= 6 is
`high` (admit and arrange urgent endoscopy). See [`../spec/index.md`](../spec/index.md)
for the grading algorithm and flag definitions.

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
