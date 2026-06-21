# Nerve Conduction Study Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the nerve conduction study / EMG result
(report) schema: patient, reporting clinician, the main
`nerve_conduction_study_test_result` report, and the four-axis interpretation
grade with its rule-audit and safety-flag child tables. Run in filename order.
See [`AGENTS.md`](AGENTS.md) for conventions.
