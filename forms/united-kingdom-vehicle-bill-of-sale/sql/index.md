# united-kingdom-vehicle-bill-of-sale — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_seller.sql` — the seller's contact details.
- `03_create_table_buyer.sql` — the buyer's contact details.

## Form-specific tables

- `04_create_table_united_kingdom_vehicle_bill_of_sale.sql` — main bill of sale: the sale, the vehicle, the V5C / MOT / finance checks, price and payment, condition terms, DVLA steps, and signatures.
- `05_create_table_united_kingdom_vehicle_bill_of_sale_grade.sql` — completeness classification: complete / incomplete / risk-flagged, missing item count, and risk flag count (1:1 UNIQUE FK CASCADE to the bill of sale).
- `06_create_table_united_kingdom_vehicle_bill_of_sale_grade_rule.sql` — audit trail of fired rules (FK CASCADE to grade).
- `07_create_table_united_kingdom_vehicle_bill_of_sale_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
