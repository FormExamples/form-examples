# NEWS2 — SQL schema

PostgreSQL schema (source of truth) for the National Early Warning Score 2
(NEWS2). Numbered migrations run in order; foreign-key targets precede their
referencers. Foreign keys cascade within the form and restrict to `patient` /
`clinician`. Every table carries a UUID primary key and
`created_at` / `updated_at` / `deleted_at` timestamps with a `set_updated_at`
trigger.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (GIN text search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `updated_at` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Recording clinician identity. |
| 04 | `04_create_table_national_early_warning_score_2.sql` | `national_early_warning_score_2` | Observation header: raw physiological observations and recording context. |
| 05 | `05_create_table_national_early_warning_score_2_grade.sql` | `national_early_warning_score_2_grade` | Computed result: per-parameter subscores, aggregate, red score, risk band, monitoring and response (1:1). |
| 06 | `06_create_table_national_early_warning_score_2_grade_rule.sql` | `national_early_warning_score_2_grade_rule` | Audit trail of fired grading rules. |
| 07 | `07_create_table_national_early_warning_score_2_grade_flag.sql` | `national_early_warning_score_2_grade_flag` | Safety-escalation flags with priority and suggested action. |
