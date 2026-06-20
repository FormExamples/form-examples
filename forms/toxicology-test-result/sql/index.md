# Toxicology Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the toxicology result (report) schema:
patient, reporting clinician, the main `toxicology_test_result` report with its
assay result values, and the four-axis interpretation grade with its rule-audit
and safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md)
for conventions.
