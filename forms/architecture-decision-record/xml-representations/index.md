# XML Representations — Architecture Decision Record

XML and DTD files generated from the SQL migrations by
`bin/xml-representations/generate-xml-representations.py`. One pair of
`.xml` and `.dtd` files per table.

The XML uses a flat column-per-element layout: each SQL column becomes an
XML element of the same name, in declaration order.

## Files

- `author.xml` / `author.dtd`
- `organization.xml` / `organization.dtd`
- `architecture_decision_record.xml` / `architecture_decision_record.dtd`
- `architecture_decision_record_position.xml` / `architecture_decision_record_position.dtd`
- `architecture_decision_record_note.xml` / `architecture_decision_record_note.dtd`
