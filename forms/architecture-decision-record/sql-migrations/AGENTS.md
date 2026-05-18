# sql-migrations — Agent Instructions

PostgreSQL migrations are the source of truth for this form's schema.
Both the XML and FHIR R5 representations are generated from these files.

When editing:

- Numbering is significant. Use `NN_create_table_<name>.sql` for tables and
  `NN_<verb>_<noun>.sql` for non-table migrations.
- Keep CREATE TABLE statements parseable by
  `bin/xml-representations/generate-xml-representations.py`: one column
  per line, `CHECK (...)` clauses on the same line as the column.
- Re-run the XML and FHIR generators after any schema change.
- All `IN (...)` enumerations should include `''` as a permitted value so
  the application layer can leave fields blank.
