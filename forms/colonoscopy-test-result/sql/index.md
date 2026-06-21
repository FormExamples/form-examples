# Colonoscopy Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the colonoscopy result (report) schema:
patient, reporting clinician (endoscopist), the main `colonoscopy_test_result`
report, and the four-axis interpretation grade with its rule-audit and
safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md) for
conventions.
