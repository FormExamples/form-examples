# Mammography Test Result — PostgreSQL migrations (source of truth)

Agent instructions for this directory. See the form root [`../index.md`](../index.md) and [`../AGENTS.md`](../AGENTS.md).

These numbered migrations are the schema source of truth. Order:

1. `00_create_extensions.sql` — `pgcrypto` (UUIDs) + `pg_trgm` (trigram GIN indexes).
2. `01_create_function_set_updated_at.sql` — shared `updated_at` trigger function.
3. `02_create_table_patient.sql` — patient demographics.
4. `03_create_table_clinician.sql` — reporting clinician (radiologist / consultant / reporting radiographer).
5. `04_create_table_mammography_test_result.sql` — main result/report record (carries the BI-RADS final assessment category).
6. `05_create_table_mammography_test_result_grade.sql` — four-axis interpretation grade.
7. `06_create_table_mammography_test_result_grade_rule.sql` — fired-rule audit trail.
8. `07_create_table_mammography_test_result_grade_flag.sql` — safety-critical flags.

The BI-RADS final assessment category (`bi_rads_category` on the main table) is
the key structured score. The grade engine carries it in `reporting_category`
and maps it to Axis A (classification) and Axis D (follow-up urgency):
BI-RADS 1-2 = normal / routine; 3 = abnormal / recommended short-interval
follow-up; 4-5 = abnormal or critical / urgent biopsy referral; 0 = inconclusive
/ further imaging; 6 = known malignancy. BI-RADS 4/5 raises
`abnormal-requiring-action` and `urgent-referral` flags.

Conventions: UUIDv4 PKs via `gen_random_uuid()`; `created_at` / `updated_at` /
`deleted_at` TIMESTAMPTZ on every table; a per-table `BEFORE UPDATE` trigger
calling `set_updated_at()`; enums as `VARCHAR ... CHECK (... IN (..., ''))`
always including the empty string; full `COMMENT ON TABLE` / `COMMENT ON COLUMN`
coverage; `gin_trgm_ops` GIN index on every name column; snake_case throughout.
Empty string `''` for unanswered text / enum; `NULL` for unanswered numeric /
date / time.
