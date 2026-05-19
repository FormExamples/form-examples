# SQL Migrations — UK NHS England Medical Exemption Certificate (FP92A)

PostgreSQL Liquibase migrations defining the canonical FP92A data model.

See [`AGENTS.md`](./AGENTS.md) for table-by-table guidance and conventions.

## Entity-relationship overview

```
patient                  practitioner
   1                          1
   |                          |
   |  N                       |  N
   +----- application --------+
              |
              |  1
              |
              |  N
              +----- application_eligible_condition ----- eligible_condition
              |                                              (closed list)
              |  1
              |  1
              +----- grade
                       |
                       |  1
                       |  N
                       +----- grade_fired_rule
                       |  N
                       +----- grade_additional_flag
```

## Migrations (in apply order)

1. `00_create_extensions.sql` — `pgcrypto`, `pg_trgm`
2. `01_create_function_set_updated_at.sql`
3. `02_create_table_patient.sql`
4. `03_create_table_practitioner.sql`
5. `04_create_table_eligible_condition.sql`
6. `05_create_table_application.sql`
7. `06_create_table_application_eligible_condition.sql`
8. `07_create_table_grade.sql`
9. `08_create_table_grade_fired_rule.sql`
10. `09_create_table_grade_additional_flag.sql`
