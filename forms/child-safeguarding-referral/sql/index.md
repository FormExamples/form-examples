# child-safeguarding-referral — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — child demographics (the child the referral concerns).
- `03_create_table_clinician.sql` — referrer (the professional making the referral).

## Form-specific tables

- `04_create_table_child_safeguarding_referral.sql` — main referral header: referrer context, child details, family and household, the concern or allegation, category of abuse, presenting evidence, immediate risk and safety, consent and information-sharing basis, who else is informed, and the action requested.
- `05_create_table_child_safeguarding_referral_grade.sql` — grade: completeness/validity status (complete/partial/incomplete), urgency classification (emergency/urgent/standard), and completeness percentage (1:1 FK CASCADE to the referral).
- `06_create_table_child_safeguarding_referral_grade_rule.sql` — audit trail of fired grading rules (FK CASCADE to grade).
- `07_create_table_child_safeguarding_referral_grade_flag.sql` — safeguarding flags with priority and suggested action (FK CASCADE to grade).

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
