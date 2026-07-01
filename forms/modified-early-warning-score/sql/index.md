# MEWS — SQL schema

PostgreSQL schema (source of truth) for the Modified Early Warning Score (MEWS).
Numbered migrations run in order; foreign-key targets precede their referencers.
Foreign keys cascade within the form and restrict to `patient` / `clinician`.
Every table carries a UUID primary key and
`created_at` / `updated_at` / `deleted_at` timestamps with a `set_updated_at`
trigger.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (GIN text search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `updated_at` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Recording clinician identity. |
| 04 | `04_create_table_modified_early_warning_score.sql` | `modified_early_warning_score` | Observation header: five raw physiological observations, recording context, and optional previous aggregate. |
| 05 | `05_create_table_modified_early_warning_score_grade.sql` | `modified_early_warning_score_grade` | Computed result: five parameter sub-scores, aggregate (0-14), single-parameter trigger, risk band, monitoring frequency (1:1). |
| 06 | `06_create_table_modified_early_warning_score_grade_rule.sql` | `modified_early_warning_score_grade_rule` | Audit trail of fired grading rules. |
| 07 | `07_create_table_modified_early_warning_score_grade_flag.sql` | `modified_early_warning_score_grade_flag` | Safety-escalation flags with priority and suggested action. |
