# PEWS — SQL schema

PostgreSQL schema (source of truth) for the Paediatric Early Warning Score
(PEWS). Numbered migrations run in order; foreign-key targets precede their
referencers. Foreign keys cascade within the form and restrict to `patient` /
`clinician`. Every table carries a UUID primary key and
`created_at` / `updated_at` / `deleted_at` timestamps with a `set_updated_at`
trigger.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (GIN text search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `updated_at` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient (child) demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Recording clinician identity (paediatric roles). |
| 04 | `04_create_table_paediatric_early_warning_score.sql` | `paediatric_early_warning_score` | Observation header: age band, raw physiological observations, care setting, and documented-concern override triggers. |
| 05 | `05_create_table_paediatric_early_warning_score_grade.sql` | `paediatric_early_warning_score_grade` | Computed result: per-parameter 0-3 sub-scores, aggregate (0-21), max sub-score, escalation band, override triggers, and monitoring frequency (1:1). |
| 06 | `06_create_table_paediatric_early_warning_score_grade_rule.sql` | `paediatric_early_warning_score_grade_rule` | Audit trail of fired grading rules. |
| 07 | `07_create_table_paediatric_early_warning_score_grade_flag.sql` | `paediatric_early_warning_score_grade_flag` | Safety-escalation flags with priority and suggested action. |

## Scoring model

The age band is selected first and sets the normal respiratory-rate and
heart-rate ranges. Each of the seven parameters scores 0-3; the aggregate is
their sum (0-21). The escalation band is `>=6` high, `4-5` medium, `2-3` low,
else routine. Any single parameter scoring 3 (`single_parameter_trigger`) or a
documented nurse / parent concern (`concern_trigger`) raises the effective
escalation without changing the aggregate. See [`../spec/index.md`](../spec/index.md)
for the full grading algorithm and flagged-issue rules.

## Regenerate

`sql/` is the source of truth. After editing it, regenerate the derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.
