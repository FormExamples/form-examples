# UK LPA for Health and Care Decisions — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions:

- UUIDv4 primary keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`)
- `created_at`, `updated_at`, `deleted_at TIMESTAMPTZ` with
  `set_updated_at()` trigger
- `snake_case` columns
- `COMMENT ON TABLE` + `COMMENT ON COLUMN` for every table and column
- Child `lpa_*` tables reference `lpa(id) ON DELETE CASCADE` with a
  UNIQUE constraint on `lpa_id` to enforce 1:1 where appropriate

Table layout follows the LP1H form sections — donor, attorneys,
replacement attorneys, certificate provider, persons to notify, signatures,
registration application — plus three validity-result tables for the
computed engine output (`lpa_validity`, `lpa_validity_fired_rule`,
`lpa_validity_additional_flag`).

Statutory rule identifiers are stored as stable text values (e.g.
`'R-MCA-S9-AGE'`) referenced from both the `lpa_validity_fired_rule` table
and from the Vitest engine tests.

See root [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md)
for the full conventions and the table-naming pattern.
