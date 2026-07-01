# Nursing Care Plan — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Authoring nurse / contributing professionals |
| 04 | `04_create_table_nursing_care_plan.sql` | `nursing_care_plan` | **Parent** plan header (patient/clinician FKs, model, review date, four risk-assessment groups) |
| 05 | `05_create_table_nursing_care_plan_problem.sql` | `nursing_care_plan_problem` | **Child** of plan — identified problems (ADPIE), inline evaluation |
| 06 | `06_create_table_nursing_care_plan_goal.sql` | `nursing_care_plan_goal` | **Child** of problem — SMART goals |
| 07 | `07_create_table_nursing_care_plan_intervention.sql` | `nursing_care_plan_intervention` | **Child** of problem — planned interventions |
| 08 | `08_create_table_nursing_care_plan_grade.sql` | `nursing_care_plan_grade` | Completeness grade (status + percent), 1:1 with plan |
| 09 | `09_create_table_nursing_care_plan_grade_rule.sql` | `nursing_care_plan_grade_rule` | Fired completeness rules |
| 10 | `10_create_table_nursing_care_plan_grade_flag.sql` | `nursing_care_plan_grade_flag` | Flagged issues (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< nursing_care_plan (parent)
clinician┘        │
                  ├─< nursing_care_plan_problem (child)
                  │        ├─< nursing_care_plan_goal (grandchild)
                  │        └─< nursing_care_plan_intervention (grandchild)
                  └─1:1─ nursing_care_plan_grade
                                 ├─< nursing_care_plan_grade_rule
                                 └─< nursing_care_plan_grade_flag
```

One-to-many from plan to problems, and from each problem to its goals and
interventions; the evaluation (E of ADPIE) is stored inline on the problem row.
