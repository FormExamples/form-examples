# Structured Medication Review — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reviewing clinician (clinical pharmacist / GP / pharmacy technician) |
| 04 | `04_create_table_structured_medication_review.sql` | `structured_medication_review` | **Parent** review header (patient/clinician FKs, context, problems, goals, monitoring, plan, completion flag) |
| 05 | `05_create_table_structured_medication_review_medicine.sql` | `structured_medication_review_medicine` | **Child** of review — one row per reviewed medicine (indication, high-risk, ACB points, monitoring, STOPP/START) |
| 06 | `06_create_table_structured_medication_review_grade.sql` | `structured_medication_review_grade` | Computed grade (review status, ACB score + band, polypharmacy band, burden band, counts), 1:1 with review |
| 07 | `07_create_table_structured_medication_review_grade_rule.sql` | `structured_medication_review_grade_rule` | Fired scoring rules |
| 08 | `08_create_table_structured_medication_review_grade_flag.sql` | `structured_medication_review_grade_flag` | Flagged issues (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< structured_medication_review (parent)
clinician┘        │
                  ├─< structured_medication_review_medicine (child, one-to-many)
                  └─1:1─ structured_medication_review_grade
                                 ├─< structured_medication_review_grade_rule
                                 └─< structured_medication_review_grade_flag
```

One parent review header owns a one-to-many list of medicine rows
(`structured_medication_review_medicine`, cascade delete, indexed FK). The
scoring engine writes a single 1:1 `structured_medication_review_grade` row
(review status, anticholinergic burden score and band, polypharmacy band,
composite burden band, medicine counts), with child `..._grade_rule` rows for
each fired rule and `..._grade_flag` rows for each flagged issue.
