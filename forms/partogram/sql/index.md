# Partogram — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Recording clinician (midwife / obstetrician / nurse) |
| 04 | `04_create_table_partogram.sql` | `partogram` | **Parent** labour record header (patient/clinician FKs, active-phase start, parity, membranes, context) |
| 05 | `05_create_table_partogram_observation.sql` | `partogram_observation` | **Child** of partogram — timed intrapartum observation rows (dilatation, descent, contractions, FHR, liquor, maternal vitals, urine, drugs) |
| 06 | `06_create_table_partogram_grade.sql` | `partogram_grade` | Progress grade (classification + latest dilatation), 1:1 with partogram |
| 07 | `07_create_table_partogram_grade_rule.sql` | `partogram_grade_rule` | Fired progress rules |
| 08 | `08_create_table_partogram_grade_flag.sql` | `partogram_grade_flag` | Flagged issues (category + priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< partogram (parent)
clinician┘        │
                  ├─< partogram_observation (child, ordered timed series)
                  └─1:1─ partogram_grade
                                 ├─< partogram_grade_rule
                                 └─< partogram_grade_flag
```

One-to-many from the labour record to its timed observation rows; a single
computed grade (1:1) carries the progress classification, its fired rules, and
the flagged issues raised across the whole observation series.
