# Columbia Suicide Severity Rating Scale (C-SSRS) — SQL schema

PostgreSQL schema (source of truth) for the C-SSRS suicide-risk assessment.
Numbered migrations create the extensions and trigger function, the shared
entities, the main assessment record, and the computed risk classification with
its rule and flag audit tables. Foreign keys cascade within the form; references
to `patient` and `clinician` are delete restricted. Foreign-key targets are
created before their referencers.

The C-SSRS is a validated status- and severity-classification instrument: it
records an ordinal ideation level (0–5), categorical suicidal-behaviour items,
and attempt lethality, then derives a Low / Moderate / High risk tier. It is not
a summed score and not a diagnosis; the schema stores the inputs, the derived
classification, and an audit trail of the rules and red-flag issues.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (UUIDs) and `pg_trgm` (trigram search) |
| 01 | `01_create_function_set_updated_at.sql` | — | reusable `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | patient demographic entity |
| 03 | `03_create_table_clinician.sql` | `clinician` | assessing-clinician entity |
| 04 | `04_create_table_columbia_suicide_severity_rating_scale.sql` | `columbia_suicide_severity_rating_scale` | main assessment record: context, identification, ideation items Q1–Q5, ideation intensity, behaviour items, recency, lethality, means |
| 05 | `05_create_table_columbia_suicide_severity_rating_scale_grade.sql` | `columbia_suicide_severity_rating_scale_grade` | computed classification (1:1): ideation level 0–5, behaviour-present and recent-behaviour flags, Low/Moderate/High risk tier, positive-features summary, management recommendation |
| 06 | `06_create_table_columbia_suicide_severity_rating_scale_grade_rule.sql` | `columbia_suicide_severity_rating_scale_grade_rule` | audit trail of fired classification rules |
| 07 | `07_create_table_columbia_suicide_severity_rating_scale_grade_flag.sql` | `columbia_suicide_severity_rating_scale_grade_flag` | red-flag issues with priority and suggested action |

Generated artefacts (XML, FHIR R5, protobuf, OpenAPI, `schema.sql`, and the Loco
setup script) are derived from these migrations and are never hand-edited.
