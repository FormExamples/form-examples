# Epilepsy Annual Review — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reviewing clinician (GP / practice nurse / epilepsy nurse / neurologist) |
| 04 | `04_create_table_epilepsy_review.sql` | `epilepsy_review` | **Parent** review header (patient/clinician FKs, context and epilepsy profile, seizures + ASM + adherence + side effects + levels, triggers, SUDEP, injuries + status epilepticus, DVLA driving + bathing safety, valproate + pregnancy-prevention + folic acid + contraception, mental health, care plan, context) |
| 05 | `05_create_table_epilepsy_review_grade.sql` | `epilepsy_review_grade` | Computed grade (seizure control, review status, completeness score), 1:1 with review |
| 06 | `06_create_table_epilepsy_review_grade_rule.sql` | `epilepsy_review_grade_rule` | Fired classification / completeness rules |
| 07 | `07_create_table_epilepsy_review_grade_flag.sql` | `epilepsy_review_grade_flag` | Safety flags (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< epilepsy_review (parent)
clinician┘        │
                  └─1:1─ epilepsy_review_grade
                                 ├─< epilepsy_review_grade_rule
                                 └─< epilepsy_review_grade_flag
```

One parent review header (`epilepsy_review`) references shared `patient` and
`clinician` rows (restrict delete). The classification engine writes a single
1:1 `epilepsy_review_grade` row — the seizure-control classification
(`seizure-free` / `controlled` / `uncontrolled`), the review-completeness status
(`complete` / `partial` / `incomplete`), and the count of documented required
domains — with child `..._grade_rule` rows for each fired rule and
`..._grade_flag` rows for each safety flag (both cascade-deleted with the grade,
indexed FK).

The classification is a documentation and decision-support aid, not a numeric
score, a diagnostic test, or a prescribing instrument.
