# medical-certificate-of-cause-of-death — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — deceased demographics.
- `03_create_table_clinician.sql` — certifying doctor.

## Form-specific tables

- `04_create_table_medical_certificate_of_cause_of_death.sql` — main MCCD header: certification context, deceased death details, the Part I direct causal sequence (I(a) -> I(b) -> I(c)) with onset-to-death intervals, the Part II contributory conditions, and the coroner / medical-examiner referral status.
- `05_create_table_medical_certificate_of_cause_of_death_grade.sql` — validity classification: validity class (valid/incomplete/refer-to-coroner), derived underlying cause, and coroner-referral-indicated flag (1:1 UNIQUE FK CASCADE to the certificate).
- `06_create_table_medical_certificate_of_cause_of_death_grade_rule.sql` — audit trail of fired validity rules (FK CASCADE to grade).
- `07_create_table_medical_certificate_of_cause_of_death_grade_flag.sql` — flagged issues with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
