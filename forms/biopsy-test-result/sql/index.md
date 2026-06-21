# Biopsy Test Result — SQL migrations

PostgreSQL migrations for the biopsy histopathology result (report). This
directory is the **schema source of truth**; all other representations (XML,
FHIR R5, protobuf, TypeSpec, OpenAPI, Loco) are generated from it.

## Migration order

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00_create_extensions.sql` | `pgcrypto` (`gen_random_uuid()`) + `pg_trgm` (`gin_trgm_ops`). |
| 01 | `01_create_function_set_updated_at.sql` | Reusable `updated_at` trigger function. |
| 02 | `02_create_table_patient.sql` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | Reporting clinician (consultant histopathologist / cytopathologist). |
| 04 | `04_create_table_biopsy_test_result.sql` | Main result/report record (source of truth). |
| 05 | `05_create_table_biopsy_test_result_grade.sql` | Computed four-axis interpretation grade (1:1 with result). |
| 06 | `06_create_table_biopsy_test_result_grade_rule.sql` | Audit trail of fired scoring rules. |
| 07 | `07_create_table_biopsy_test_result_grade_flag.sql` | Safety-critical flags. |

## Entity-relationship summary

```
patient 1───* biopsy_test_result *───1 clinician
                     │
                     │ 1:1
                     ▼
          biopsy_test_result_grade
                     │
        ┌────────────┴────────────┐
        │ 1:*                      │ 1:*
        ▼                          ▼
  ..._grade_rule            ..._grade_flag
```

## Conventions

- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at` / `updated_at` / `deleted_at` TIMESTAMPTZ on every table; a
  per-table `BEFORE UPDATE` trigger calls `set_updated_at()`.
- Enums modelled as `VARCHAR ... CHECK (... IN (..., ''))`, always including the
  empty string `''`.
- Full `COMMENT ON TABLE` / `COMMENT ON COLUMN` coverage.
- `gin_trgm_ops` GIN index on every `name` column.
- snake_case throughout; `''` for unanswered text / enum and `NULL` for
  unanswered numeric / date / time.

See [`AGENTS.md`](AGENTS.md) for agent instructions and the form root
[`../index.md`](../index.md) for the clinical overview.
