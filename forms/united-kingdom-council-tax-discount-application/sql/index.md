# united-kingdom-council-tax-discount-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.

## Form-specific tables

- `02_create_table_applicant.sql` — the liable person: name, birth date and contact details.
- `03_create_table_billing_authority.sql` — the English council that receives the application.
- `04_create_table_united_kingdom_council_tax_discount_application.sql` — main application: claim, property and band, evidence, and declaration.
- `05_create_table_occupant.sql` — the occupant roster: name, birth date, status, evidence held (FK CASCADE to the application).
- `06_create_table_united_kingdom_council_tax_discount_application_grade.sql` — eligibility classification: class (likely-eligible/incomplete/likely-ineligible), counted adults, indicative outcome (1:1 UNIQUE FK CASCADE to the application).
- `07_create_table_united_kingdom_council_tax_discount_application_grade_rule.sql` — audit trail of fired eligibility rules (FK CASCADE to grade).
- `08_create_table_united_kingdom_council_tax_discount_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
