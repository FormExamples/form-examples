# united-kingdom-marriage-certificate-application — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_applicant.sql` — the applicant who submits the application, with contact details.
- `03_create_table_registrar.sql` — the registrar who receives the notice.

## Form-specific tables

- `04_create_table_united_kingdom_marriage_certificate_application.sql` — main application record: the notice, the ceremony, both parties' residence, identity, previous-relationship and immigration evidence, the witnesses, and the GRO certificate order.
- `05_create_table_united_kingdom_marriage_certificate_application_grade.sql` — application classification: class (ready-to-submit/incomplete/needs-evidence/ineligible), earliest and latest permitted ceremony dates, and the immigration-referral indication (1:1 UNIQUE FK CASCADE to the application).
- `06_create_table_united_kingdom_marriage_certificate_application_grade_rule.sql` — audit trail of fired validity rules (FK CASCADE to grade).
- `07_create_table_united_kingdom_marriage_certificate_application_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
