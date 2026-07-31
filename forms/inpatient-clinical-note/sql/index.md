# inpatient-clinical-note — sql

PostgreSQL migrations for this form (source of truth). See
`AGENTS/sql.md` for conventions.

## Canonical files

- `00_create_extensions.sql` — required extensions (pgcrypto, pg_trgm).
- `01_create_function_set_updated_at.sql` — trigger function used by every `updated_at` column.
- `02_create_table_patient.sql` — patient demographics.
- `03_create_table_clinician.sql` — note author, responsible consultant, and named senior reviewers.

## Form-specific tables

- `04_create_table_inpatient_clinical_note.sql` — main note record: note identification and type, note-type-specific context (consult question, procedure detail, transfer detail), admission context, interval history, observations and NEWS2, examination findings by system, medication context, the mandatory risk assessments, clinical impression and deterioration markers, plan and escalation, communication, and sign-off.
- `05_create_table_inpatient_clinical_note_problem.sql` — problem-list rows (FK CASCADE, indexed).
- `06_create_table_inpatient_clinical_note_medication_change.sql` — prescribing-change rows (FK CASCADE, indexed).
- `07_create_table_inpatient_clinical_note_investigation.sql` — investigations-reviewed rows, with abnormal and actioned flags (FK CASCADE, indexed).
- `08_create_table_inpatient_clinical_note_job.sql` — outstanding-job rows for handover (FK CASCADE, indexed).
- `09_create_table_inpatient_clinical_note_grade.sql` — grading result: completeness status and percentage, acuity band and computed acuity band, NEWS2 aggregate, per-component presence flags (1:1 with the note).
- `10_create_table_inpatient_clinical_note_grade_rule.sql` — audit trail of fired rules from both engines (FK CASCADE to grade, indexed).
- `11_create_table_inpatient_clinical_note_grade_flag.sql` — safety flags with priority and suggested action (FK CASCADE to grade, indexed).

## Notes

- The note table carries two table-level constraints: `note_at` may not precede
  `admission_at`, and an `author_override_acuity` requires a non-empty
  `author_override_reason`.
- Length of stay is derived in code from `admission_at` and `note_at`; it is
  never stored as a column.
- `created_at` is when the entry was written; `note_at` is when the clinical
  events occurred. The gap between them is clinically meaningful and is
  preserved.

## Derived artefacts

- `schema.sql` — every migration concatenated (generated; do not hand-edit).
