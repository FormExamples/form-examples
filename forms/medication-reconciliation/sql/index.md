# Medication Reconciliation — PostgreSQL migrations (source of truth)

Numbered Liquibase-formatted migrations. Foreign-key targets are created
before the tables that reference them. Foreign keys cascade within the form
and restrict deletion of shared `patient` / `clinician` rows.

| # | File | Table | Role |
| --- | --- | --- | --- |
| 00 | `00_create_extensions.sql` | — | `pgcrypto`, `pg_trgm` extensions |
| 01 | `01_create_function_set_updated_at.sql` | — | `set_updated_at()` trigger function |
| 02 | `02_create_table_patient.sql` | `patient` | Patient demographics |
| 03 | `03_create_table_clinician.sql` | `clinician` | Reconciling clinician (pharmacist / prescriber / nurse) |
| 04 | `04_create_table_medication_reconciliation.sql` | `medication_reconciliation` | **Parent** header (patient/clinician FKs, reconciliation type, care setting, allergy status) |
| 05 | `05_create_table_medication_reconciliation_line_item.sql` | `medication_reconciliation_line_item` | **Child** — medicine lines (BPMH / inpatient via `list_source`) |
| 06 | `06_create_table_medication_reconciliation_information_source.sql` | `medication_reconciliation_information_source` | **Child** — BPMH information sources |
| 07 | `07_create_table_medication_reconciliation_allergy.sql` | `medication_reconciliation_allergy` | **Child** — drug allergies / reactions |
| 08 | `08_create_table_medication_reconciliation_discrepancy.sql` | `medication_reconciliation_discrepancy` | **Child** — reconciliation discrepancies (type + intentional + action) |
| 09 | `09_create_table_medication_reconciliation_grade.sql` | `medication_reconciliation_grade` | Reconciliation grade (status + derived counts), 1:1 with parent |
| 10 | `10_create_table_medication_reconciliation_grade_rule.sql` | `medication_reconciliation_grade_rule` | Fired reconciliation rules |
| 11 | `11_create_table_medication_reconciliation_grade_flag.sql` | `medication_reconciliation_grade_flag` | Safety flags (priority + suggested action) |

## Relational structure

```
patient ─┐
         ├─< medication_reconciliation (parent)
clinician┘        │
                  ├─< medication_reconciliation_line_item (child: bpmh / inpatient)
                  ├─< medication_reconciliation_information_source (child)
                  ├─< medication_reconciliation_allergy (child)
                  ├─< medication_reconciliation_discrepancy (child)
                  └─1:1─ medication_reconciliation_grade
                                 ├─< medication_reconciliation_grade_rule
                                 └─< medication_reconciliation_grade_flag
```

One logical reconciliation record with child collections of medication line
items (each tagged `bpmh` or `inpatient` via `list_source`), information
sources, allergies, and classified discrepancies. The engine grades the
overall status (Complete / Discrepancies-outstanding / Incomplete), stores the
derived counts on the 1:1 grade row, and records fired rules and safety flags
in the grade's child tables.
