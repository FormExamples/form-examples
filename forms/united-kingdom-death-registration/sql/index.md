# united-kingdom-death-registration — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — the deceased whose death is being registered.
- `03_create_table_informant.sql` — the informant who registers the death.

## Form-specific tables

- `04_create_table_united_kingdom_death_registration.sql` — main death-registration record: deceased and death details, medical examiner confirmation, coroner status, the informant, the registration appointment, and aftercare (burial or cremation certificate, Tell Us Once, copies).
- `05_create_table_united_kingdom_death_registration_grade.sql` — completeness classification: registration class, 5-day deadline status, days since confirmation, and qualified-informant flag (1:1 UNIQUE FK CASCADE to the registration).
- `06_create_table_united_kingdom_death_registration_grade_rule.sql` — audit trail of fired blocking rules (FK CASCADE to grade).
- `07_create_table_united_kingdom_death_registration_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
