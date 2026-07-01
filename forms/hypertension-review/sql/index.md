# Hypertension Annual Review — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reviewing clinician (GP / practice nurse / pharmacist) |
| 04 | `04_create_table_hypertension_review.sql` | `hypertension_review` | **Parent** review header (patient/clinician FKs, context, comorbidity target drivers, clinic + home/ambulatory BP, medication + adherence, QRISK, bloods, urine ACR, lifestyle, complications) |
| 05 | `05_create_table_hypertension_review_grade.sql` | `hypertension_review_grade` | Computed grade (control status, hypertension stage, review status, primary source, selected target), 1:1 with review |
| 06 | `06_create_table_hypertension_review_grade_rule.sql` | `hypertension_review_grade_rule` | Fired classification / completeness rules |
| 07 | `07_create_table_hypertension_review_grade_flag.sql` | `hypertension_review_grade_flag` | Flagged issues (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< hypertension_review (parent)
clinician┘        │
                  └─1:1─ hypertension_review_grade
                                 ├─< hypertension_review_grade_rule
                                 └─< hypertension_review_grade_flag
```

One parent review header (`hypertension_review`) references shared `patient`
and `clinician` rows (restrict delete). The classification engine writes a
single 1:1 `hypertension_review_grade` row — the blood-pressure control status
(`controlled` / `uncontrolled` / `severe-uncontrolled`), the hypertension stage
(`none` / `stage-1` / `stage-2` / `stage-3-severe`), the review-completeness
status (`complete` / `partial` / `incomplete`), the primary reading source, and
the tightest applicable clinic and home/ambulatory blood-pressure target — with
child `..._grade_rule` rows for each fired rule and `..._grade_flag` rows for
each flagged issue (both cascade-deleted with the grade, indexed FK).

The classification is a documentation and control-classification aid, not a
numeric score, diagnosis, or prescribing instrument.
