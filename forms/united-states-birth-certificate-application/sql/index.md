# united-states-birth-certificate-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_applicant.sql`: the requester.
- `03_create_table_registrant.sql`: the person named on the birth certificate.

## Form-specific tables

- `04_create_table_united_states_birth_certificate_application.sql`: the request for a certified copy: relationship, purpose, apostille need, copy type, copies, delivery, fee enclosed, ID and supporting-document answers, signed declaration.
- `05_create_table_united_states_birth_certificate_application_grade.sql`: the class (ready-to-submit, incomplete, ineligible-requester), the state rule applied, and the expected fee (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_united_states_birth_certificate_application_grade_rule.sql`: audit trail of fired rules (FK CASCADE to grade).
- `07_create_table_united_states_birth_certificate_application_grade_flag.sql`: flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
