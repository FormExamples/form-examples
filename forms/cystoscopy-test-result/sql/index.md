# Cystoscopy Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the cystoscopy result (report) schema:
patient, operating / reporting clinician, the main `cystoscopy_test_result`
report, and the four-axis interpretation grade with its rule-audit and
safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md) for
conventions.
