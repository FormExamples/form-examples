# united-kingdom-vehicle-registration-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_applicant.sql` — the person applying to the DVLA, with the identity documents supplied.
- `03_create_table_keeper.sql` — the registered keeper, who may differ from the applicant and the owner.

## Form-specific tables

- `04_create_table_united_kingdom_vehicle_registration_application.sql` — the main application: application type (V62, V55/4, V55/5, import, V627/1), owner, vehicle identity, supporting evidence (type approval, MOT, insurance, NOVA, build evidence), fee, and declaration.
- `05_create_table_united_kingdom_vehicle_registration_application_grade.sql` — validity classification: validity class (ready-to-submit/incomplete/needs-supporting-documents), fee due, and missing-item count (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_united_kingdom_vehicle_registration_application_grade_rule.sql` — audit trail of fired validity rules (FK CASCADE to grade).
- `07_create_table_united_kingdom_vehicle_registration_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
