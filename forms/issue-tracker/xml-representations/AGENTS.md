# Issue Tracker — XML representations

Generated XML + DTD pairs for the issue-tracker form, one pair per SQL
table. The merged `issue_tracker.xml` nests the nine SOAP-style sections
inside the `<issue_tracker>` root.

Regenerate with `python3 bin/xml-representations/generate-xml-representations.py`.

See [`AGENTS/xml-representations.md`](../../../AGENTS/xml-representations.md)
for the XML / DTD conventions.
