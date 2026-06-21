# Allergy Skin Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the allergy skin test result (report)
schema: patient, reporting clinician, the main `allergy_skin_test_result`
report, and the four-axis interpretation grade with its rule-audit and
safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md)
for conventions.
