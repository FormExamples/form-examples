# DEXA Bone Density Test Result — PostgreSQL migrations (source of truth)

Numbered PostgreSQL migrations defining the DEXA bone-density result (report)
schema: patient, reporting clinician, the main `dexa_bone_density_test_result`
report (quantitative BMD / T-score / Z-score findings and the WHO densitometric
classification), and the four-axis interpretation grade with its rule-audit and
safety-flag child tables. Run in filename order. See [`AGENTS.md`](AGENTS.md) for
conventions.
