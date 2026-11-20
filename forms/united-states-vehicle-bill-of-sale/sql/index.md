# united-states-vehicle-bill-of-sale — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_seller.sql` — seller (transferor) contact record.
- `03_create_table_buyer.sql` — buyer (transferee) contact record.

## Form-specific tables

- `04_create_table_united_states_vehicle_bill_of_sale.sql` — main bill of sale record: sale transaction, parties, vehicle, the federal odometer disclosure (49 CFR 580), as-is clause, title and lien status, notarization, and post-sale release of liability.
- `05_create_table_united_states_vehicle_bill_of_sale_grade.sql` — completeness classification: complete / incomplete / risk-flagged, odometer-exemption and known-state indicators (1:1 UNIQUE FK CASCADE to the bill of sale).
- `06_create_table_united_states_vehicle_bill_of_sale_grade_rule.sql` — audit trail of fired rules (FK CASCADE to grade).
- `07_create_table_united_states_vehicle_bill_of_sale_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
