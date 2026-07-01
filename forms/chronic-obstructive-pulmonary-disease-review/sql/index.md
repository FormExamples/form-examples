# COPD Annual Review — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reviewing clinician (GP / practice nurse / respiratory nurse / pharmacist) |
| 04 | `04_create_table_chronic_obstructive_pulmonary_disease_review.sql` | `chronic_obstructive_pulmonary_disease_review` | **Parent** review header (patient/clinician FKs, context, diagnosis and exposure, spirometry, symptom burden, exacerbations, smoking and cessation, inhaler therapy and adherence, vaccinations, pulmonary rehab, oxygen, comorbidities, self-management plan) |
| 05 | `05_create_table_chronic_obstructive_pulmonary_disease_review_grade.sql` | `chronic_obstructive_pulmonary_disease_review_grade` | Computed grade (GOLD airflow grade, symptom and exacerbation axes, ABE group, review status), 1:1 with review |
| 06 | `06_create_table_chronic_obstructive_pulmonary_disease_review_grade_rule.sql` | `chronic_obstructive_pulmonary_disease_review_grade_rule` | Fired classification / completeness rules |
| 07 | `07_create_table_chronic_obstructive_pulmonary_disease_review_grade_flag.sql` | `chronic_obstructive_pulmonary_disease_review_grade_flag` | Flagged issues (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< chronic_obstructive_pulmonary_disease_review (parent)
clinician┘        │
                  └─1:1─ chronic_obstructive_pulmonary_disease_review_grade
                                 ├─< chronic_obstructive_pulmonary_disease_review_grade_rule
                                 └─< chronic_obstructive_pulmonary_disease_review_grade_flag
```

One parent review header (`chronic_obstructive_pulmonary_disease_review`)
references shared `patient` and `clinician` rows (restrict delete). The grading
engine writes a single 1:1 `chronic_obstructive_pulmonary_disease_review_grade`
row — the GOLD airflow-limitation grade (`1` / `2` / `3` / `4`), the symptom
axis (`low` / `high`), the exacerbation axis (`low` / `high`), the combined ABE
assessment group (`A` / `B` / `E`), and the review-completeness status
(`complete` / `partial` / `incomplete`) — with child `..._grade_rule` rows for
each fired rule and `..._grade_flag` rows for each flagged issue (both
cascade-deleted with the grade, indexed FK).

The grading is a documentation, completeness and severity-classification aid,
not a single numeric score, diagnosis, or prescribing instrument.
