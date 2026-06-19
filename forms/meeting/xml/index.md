# Meeting — XML Representations

Generated XML + DTD representations of the meeting schema, one pair of
files per SQL table. Produced by
`bin/xml-representations/generate-xml-representations.py` from the
migrations in [`../sql-migrations/`](../sql-migrations/).

Each `<entity>.xml` carries a single example row with the same column
names as the SQL table, and the sibling `<entity>.dtd` declares the
permitted element structure. The set serves as an archival exchange
format for systems that cannot consume JSON or FHIR.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions.
