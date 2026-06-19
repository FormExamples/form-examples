# Mammography Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the mammography result (report) schema:
patient, reporting clinician, the main `mammography_test_result` report (which
carries the BI-RADS final assessment category), and the four-axis interpretation
grade with its rule-audit and safety-flag child tables. Run in filename order.
See [`AGENTS.md`](AGENTS.md) for conventions and the BI-RADS → axes mapping.
