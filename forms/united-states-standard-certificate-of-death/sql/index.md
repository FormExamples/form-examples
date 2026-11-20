# united-states-standard-certificate-of-death — sql

PostgreSQL migrations for this form (source of truth). See `AGENTS/sql.md`.

- `00_create_extensions.sql` pgcrypto and pg_trgm.
- `01_create_function_set_updated_at.sql` trigger function for `updated_at`.
- `02_create_table_patient.sql` decedent demographics.
- `03_create_table_clinician.sql` the medical certifier (physician, medical examiner, coroner).
- `04_create_table_united_states_standard_certificate_of_death.sql` the certificate: state, decedent, death, certifier, Part I lines (a) to (d) with intervals, Part II, autopsy, manner, tobacco, pregnancy, injury, referral, funeral director and disposition, certified-copy order.
- `05_..._grade.sql` class, underlying cause, referral indicator (1:1 with the certificate).
- `06_..._grade_rule.sql` fired rules; `07_..._grade_flag.sql` flags with priority and suggested action.
- `schema.sql` every migration concatenated (generated).
