# united-states-vehicle-title-and-registration-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_applicant.sql` — the owner named on the application (an individual or a business).
- `03_create_table_lienholder.sql` — the bank or finance company holding a security interest.

## Form-specific tables

- `04_create_table_vehicle_title_application.sql` — the main application record: state, transaction, owner identification, vehicle and VIN, federal odometer disclosure, title history and brands, lien, insurance and inspections, and fees and tax.
- `05_create_table_vehicle_title_application_grade.sql` — the classification: application class (ready-to-submit / incomplete / title-brand-or-lien-issue), VIN status, odometer-disclosure requirement, brand-or-lien issue, outstanding-item count (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_vehicle_title_application_grade_rule.sql` — audit trail of fired classification rules (FK CASCADE to grade).
- `07_create_table_vehicle_title_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

The main table is named `vehicle_title_application`, not after the full slug,
because Postgres truncates identifiers at 63 characters and
`united_states_vehicle_title_and_registration_application_grade_flag` is 67.

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
