# Blood Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the blood / pathology test result
(report) schema: patient, reporting clinician, the main `blood_test_result`
report with its quantitative analyte result values, and the four-axis
interpretation grade with its rule-audit and safety-flag child tables. Run in
filename order. See [`AGENTS.md`](AGENTS.md) for conventions.
