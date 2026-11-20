# united-states-marriage-license-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_applicant.sql` — one person applying for a marriage license (the application references two).
- `03_create_table_county_clerk.sql` — the county clerk or recorder office that issues the license.

## Form-specific tables

- `04_create_table_united_states_marriage_license_application.sql` — the main application: issuing jurisdiction, both applicants, eligibility (age and consent, prior marriages, relationship, proxy), license issuance and fee, the ceremony, and the license return.
- `05_create_table_united_states_marriage_license_application_grade.sql` — eligibility classification: ready-to-apply, incomplete, or not-eligible, plus the derived earliest ceremony date and license expiry (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_united_states_marriage_license_application_grade_rule.sql` — audit trail of fired eligibility rules (FK CASCADE to grade).
- `07_create_table_united_states_marriage_license_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
