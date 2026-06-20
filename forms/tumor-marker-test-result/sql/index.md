# Tumor Marker Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the serum tumour-marker result (report)
schema: patient, reporting clinician, the main `tumor_marker_test_result` report
(measured marker values as NUMERIC columns), and the four-axis interpretation
grade with its rule-audit and safety-flag child tables. Run in filename order.
See [`AGENTS.md`](AGENTS.md) for conventions.
