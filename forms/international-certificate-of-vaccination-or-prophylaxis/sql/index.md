# International Certificate of Vaccination or Prophylaxis — PostgreSQL migrations

Numbered PostgreSQL migrations, one table per file. Conventions: UUIDv4 primary
keys (`id UUID PRIMARY KEY DEFAULT gen_random_uuid()`), `created_at` +
`updated_at` + `deleted_at` `TIMESTAMPTZ` columns with the `set_updated_at()`
trigger, `snake_case` columns, `COMMENT ON TABLE` + `COMMENT ON COLUMN` on
every table and column.

Entities (one CREATE TABLE per file, numbered in dependency order):

| # | Table | Purpose |
| --- | --- | --- |
| 02 | `patient` | the vaccinee (traveller) |
| 03 | `clinician` | supervising clinician who signs each vaccination entry |
| 04 | `center` | WHO-designated administering centre with the uniform stamp |
| 05 | `international_certificate_of_vaccination_or_prophylaxis` | the certificate itself |
| 06 | `international_certificate_of_vaccination_or_prophylaxis_entry` | one row per vaccination on the certificate |

The full table-name `international_certificate_of_vaccination_or_prophylaxis`
matches the form slug and is retained in full per the project convention
(never abbreviated).

See root [`AGENTS/sql-migrations.md`](../../../AGENTS/sql-migrations.md) for
the full conventions and the table-naming pattern.
