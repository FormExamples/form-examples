# SQL Migrations — Architecture Decision Record

PostgreSQL migrations that define the schema for the ADR form. Apply in
numeric order.

## Files

- `00_extensions.sql` — `pgcrypto` and `pg_trgm` extensions
- `01_create_function_set_updated_at.sql` — reusable trigger function
- `02_create_table_author.sql` — the architect / decision-maker
- `03_create_table_organization.sql` — organization context
- `04_create_table_architecture_decision_record.sql` — main ADR row
- `05_create_table_architecture_decision_record_position.sql` — alternatives
- `06_create_table_architecture_decision_record_note.sql` — discussion notes

## Conventions

- UUIDv4 primary keys (`gen_random_uuid()`)
- `created_at` / `updated_at` on every table
- `deleted_at` on root entities for soft delete
- `set_updated_at()` trigger on every table
- `CHECK` constraints for enums; empty string `''` permitted
- Foreign keys with explicit `ON DELETE` semantics
