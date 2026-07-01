# Emergency Department Triage Note — SQL schema

PostgreSQL schema (source of truth) for the Emergency Department Triage Note.
Numbered migrations run in order; foreign-key targets precede their referencers.
Foreign keys cascade within the form and restrict to `patient` / `clinician`.
Every table carries a UUID primary key and `created_at` / `updated_at` /
`deleted_at` timestamps with a `set_updated_at` trigger.

This is a **classification** form: the engine selects the most urgent Manchester
Triage System (MTS) priority level justified by the discriminators and a
supporting NEWS2 aggregate; it does not sum a numeric total.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto` (`gen_random_uuid()`) and `pg_trgm` (GIN text search). |
| 01 | `01_create_function_set_updated_at.sql` | — | Reusable `updated_at` trigger function. |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics. |
| 03 | `03_create_table_clinician.sql` | `clinician` | Triaging clinician identity. |
| 04 | `04_create_table_emergency_department_triage_note.sql` | `emergency_department_triage_note` | Triage header: arrival and context, presenting complaint, vital signs (NEWS2 inputs), pain score, and MTS discriminator flags. |
| 05 | `05_create_table_emergency_department_triage_note_grade.sql` | `emergency_department_triage_note_grade` | Computed classification: NEWS2 aggregate, selected priority level, and the derived colour, name, and target time (1:1). |
| 06 | `06_create_table_emergency_department_triage_note_grade_rule.sql` | `emergency_department_triage_note_grade_rule` | Audit trail of fired classification rules. |
| 07 | `07_create_table_emergency_department_triage_note_grade_flag.sql` | `emergency_department_triage_note_grade_flag` | Red-flag issues with priority and suggested action. |
