# Heart Failure Annual Review — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reviewing clinician (GP / practice nurse / HF nurse / pharmacist / cardiologist) |
| 04 | `04_create_table_heart_failure_review.sql` | `heart_failure_review` | **Parent** review header (patient/clinician FKs, context, diagnosis and subtype, functional status, fluid balance and observations, monitoring bloods, four medication pillars plus loop diuretic and other medications, devices, vaccinations, self-management) |
| 05 | `05_create_table_heart_failure_review_grade.sql` | `heart_failure_review_grade` | Computed grade (NYHA functional status, medication-optimization status, review status, completeness score, pillar breakdown), 1:1 with review |
| 06 | `06_create_table_heart_failure_review_grade_rule.sql` | `heart_failure_review_grade_rule` | Fired classification / completeness rules |
| 07 | `07_create_table_heart_failure_review_grade_flag.sql` | `heart_failure_review_grade_flag` | Flagged issues (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< heart_failure_review (parent)
clinician┘        │
                  └─1:1─ heart_failure_review_grade
                                 ├─< heart_failure_review_grade_rule
                                 └─< heart_failure_review_grade_flag
```

One parent review header (`heart_failure_review`) references shared `patient`
and `clinician` rows (restrict delete). The classification engine writes a
single 1:1 `heart_failure_review_grade` row — the NYHA functional status
(`stable` / `symptomatic` / `advanced` / `unknown`), the medication-optimization
status (`optimised` / `partial` / `suboptimal` / `not-applicable`) against the
indicated four-pillar set of guideline-directed medical therapy, and the
review-completeness status (`complete` / `partial` / `incomplete`) and score —
with child `..._grade_rule` rows for each fired rule and `..._grade_flag` rows
for each flagged issue (both cascade-deleted with the grade, indexed FK).

The classification is a documentation and status-classification aid, not a
numeric score, diagnosis, or prescribing instrument.
