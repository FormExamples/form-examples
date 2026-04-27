# Outpatient Outcome Report — SQL Migrations

PostgreSQL migrations defining the schema for the outpatient outcome report.

Numbered migrations run in order. `schema.sql` and `schema-flat.sql` are generated from these files via:

- `bin/generate-sql-combined.py` → `schema.sql`
- `bin/generate-sql-flat.py` → `schema-flat.sql`
