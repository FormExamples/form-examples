# general-practitioner-referral-letter — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql-migrations.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — referring clinician.

## Form-specific tables

- `04_create_table_general_practitioner_referral_letter.sql` — main referral-letter header: patient and referrer identification, referral destination, urgency, reason and history, examination and investigation findings, medications and allergies, and the patient's expectations, consent, and safety-netting.
- `05_create_table_general_practitioner_referral_letter_grade.sql` — documentation-completeness grade: status (Complete/Incomplete), echoed urgency classification, and completeness percentage (1:1 with the letter).
- `06_create_table_general_practitioner_referral_letter_grade_rule.sql` — audit trail of fired completeness rules (FK CASCADE to grade).
- `07_create_table_general_practitioner_referral_letter_grade_flag.sql` — flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
