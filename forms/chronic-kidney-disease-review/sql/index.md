# Chronic Kidney Disease Annual Review — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reviewing clinician (GP / practice nurse / pharmacist / nephrology) |
| 04 | `04_create_table_chronic_kidney_disease_review.sql` | `chronic_kidney_disease_review` | **Parent** review header (patient/clinician FKs, context, current + prior eGFR, urine ACR, blood pressure, medication review, core CKD bloods, referral decision) |
| 05 | `05_create_table_chronic_kidney_disease_review_grade.sql` | `chronic_kidney_disease_review_grade` | Computed grade (G-stage, albuminuria stage, KDIGO risk zone, review status, blood-pressure target, completeness score), 1:1 with review |
| 06 | `06_create_table_chronic_kidney_disease_review_grade_rule.sql` | `chronic_kidney_disease_review_grade_rule` | Fired classification / completeness rules |
| 07 | `07_create_table_chronic_kidney_disease_review_grade_flag.sql` | `chronic_kidney_disease_review_grade_flag` | Flagged issues (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< chronic_kidney_disease_review (parent)
clinician┘        │
                  └─1:1─ chronic_kidney_disease_review_grade
                                 ├─< chronic_kidney_disease_review_grade_rule
                                 └─< chronic_kidney_disease_review_grade_flag
```

One parent review header (`chronic_kidney_disease_review`) references shared
`patient` and `clinician` rows (restrict delete). The classification engine
writes a single 1:1 `chronic_kidney_disease_review_grade` row — the KDIGO
G-stage (`G1` / `G2` / `G3a` / `G3b` / `G4` / `G5`), the albuminuria stage
(`A1` / `A2` / `A3`), the KDIGO risk zone (`low` / `moderate` / `high` /
`very-high`), the review-completeness status (`complete` / `partial` /
`incomplete`), the derived blood-pressure target and whether it is met, and the
completeness score — with child `..._grade_rule` rows for each fired rule and
`..._grade_flag` rows for each flagged issue (both cascade-deleted with the
grade, indexed FK).

The classification is a documentation and staging aid, not a numeric score,
diagnosis, or prescribing instrument.
