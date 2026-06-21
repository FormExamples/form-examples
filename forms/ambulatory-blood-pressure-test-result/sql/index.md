# Ambulatory Blood Pressure Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the ABPM result (report) schema:
patient, reporting clinician, the main `ambulatory_blood_pressure_test_result`
report, and the four-axis interpretation grade with its rule-audit and
safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md)
for conventions.
