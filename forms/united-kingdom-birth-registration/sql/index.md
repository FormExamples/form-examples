# united-kingdom-birth-registration — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — the child (demographics).
- `03_create_table_clinician.sql` — the registrar or staff member handling the application.

## Form-specific tables

- `04_create_table_united_kingdom_birth_registration.sql` — the application: the child, mother, parentage basis for a second parent, informant and identity evidence, and the certificate order.
- `05_create_table_united_kingdom_birth_registration_grade.sql` — readiness classification: readiness class (ready-to-submit/incomplete/needs-additional-evidence/out-of-scope), days since birth, late-registration indicator and missing-item count (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_united_kingdom_birth_registration_grade_rule.sql` — audit trail of fired validity rules (FK CASCADE to grade).
- `07_create_table_united_kingdom_birth_registration_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
