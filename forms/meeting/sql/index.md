# Meeting — SQL Migrations

PostgreSQL schema for the meeting form, authored as Liquibase-formatted
SQL migrations and applied in numeric order. Each `NN_create_table_<name>.sql`
file creates one table, attaches its `set_updated_at` trigger, and adds
indexes. Two leading files (`00_extensions.sql`, `01_create_function_set_updated_at.sql`)
seed the extensions and the shared trigger function used by every table.

The schema models one parent entity (`meeting`) with eight child collections
plus a single recurrence row, mirroring the entity table in the top-level
[`AGENTS.md`](../AGENTS.md). All tables share the monorepo conventions:
UUIDv4 primary key, `created_at` / `updated_at` / `deleted_at` timestamps,
and snake_case column names.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions.
