# Toxicology Test Request — back-end-with-loco plan

Rust axum + Loco JSON API for the toxicology test request. Mirrors the schema in
[`../sql/`](../sql) and the four-axis scoring engine
contract in [`../AGENTS.md`](../AGENTS.md).

## Build order

- [ ] Scaffold crate from `../back-end-with-loco-setup` (generated)
- [ ] Models: patient, clinician, toxicology_test_request, grade, grade_rule, grade_flag
- [ ] Four-axis scoring engine (appropriateness, timing, completeness, triage) with stable rule IDs
- [ ] JSON API controllers + routes
- [ ] Import / export JSON, XML, CSV, TSV
- [ ] `cargo test` green (requires local Postgres)
