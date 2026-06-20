# Coagulation Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the coagulation test result (report)
schema: patient, reporting clinician, the main `coagulation_test_result` report
(PT/INR, APTT/ratio, fibrinogen, D-dimer, thrombin time, factor assays), and the
four-axis interpretation grade with its rule-audit and safety-flag child tables.
Run in filename order. See [`AGENTS.md`](AGENTS.md) for conventions.
