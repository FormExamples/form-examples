# Urinalysis Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the urinalysis result (report) schema:
patient, reporting clinician, the main `urinalysis_test_result` report (specimen,
dipstick reagent results, microscopy, culture and sensitivities, interpretation),
and the four-axis interpretation grade with its rule-audit and safety-flag child
tables. Run in filename order. See [`AGENTS.md`](AGENTS.md) for conventions.
