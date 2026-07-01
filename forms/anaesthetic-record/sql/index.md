# Anaesthetic Record — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Anaesthetic-team clinicians |
| 04 | `04_create_table_anaesthetic_record.sql` | `anaesthetic_record` | **Parent** record header (patient/clinician FKs, checks, ASA/airway, technique, fluids, regional, recovery, sign-off) |
| 05 | `05_create_table_anaesthetic_record_drug_administration.sql` | `anaesthetic_record_drug_administration` | **Child** of record — drug administrations (drug, dose, route, category, time) |
| 06 | `06_create_table_anaesthetic_record_timed_observation.sql` | `anaesthetic_record_timed_observation` | **Child** of record — timed physiological observations |
| 07 | `07_create_table_anaesthetic_record_intra_operative_event.sql` | `anaesthetic_record_intra_operative_event` | **Child** of record — intra-operative events (type, time, management) |
| 08 | `08_create_table_anaesthetic_record_grade.sql` | `anaesthetic_record_grade` | Completeness grade (status + percent), 1:1 with record |
| 09 | `09_create_table_anaesthetic_record_grade_rule.sql` | `anaesthetic_record_grade_rule` | Evaluated mandatory-item rules (criticality + satisfied) |
| 10 | `10_create_table_anaesthetic_record_grade_flag.sql` | `anaesthetic_record_grade_flag` | Safety flags (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< anaesthetic_record (parent)
clinician┘        │
                  ├─< anaesthetic_record_drug_administration (child)
                  ├─< anaesthetic_record_timed_observation (child)
                  ├─< anaesthetic_record_intra_operative_event (child)
                  └─1:1─ anaesthetic_record_grade
                                 ├─< anaesthetic_record_grade_rule
                                 └─< anaesthetic_record_grade_flag
```

One-to-many from the record to its drug administrations, timed observations,
and intra-operative events; each child cascades on delete of the parent record.
The computed grade is 1:1 with the record and owns its fired-rule and safety-flag
child rows.
