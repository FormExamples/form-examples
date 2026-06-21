# Genetic Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the genetic / genomic test result
(report) schema: patient, reporting clinician, the main `genetic_test_result`
report, and the four-axis interpretation grade with its rule-audit and
safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md)
for conventions.
