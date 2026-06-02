# Tasks — Full-Stack FP92A

## Done

- [x] Author `Cargo.toml` with axum / tokio / tera / serde / uuid / chrono / tracing.
- [x] Implement `src/main.rs` with the axum entry point and Tera glob.
- [x] Implement `src/engine/types.rs` (ApplicationData, QualifyingCondition, GradeResult, RulePriority, RuleCategory).
- [x] Implement `src/engine/fp92a_rules.rs` (10 eligible-condition rules + disqualifying + redirect + completeness + renewal).
- [x] Implement `src/engine/fp92a_validator.rs` (pure function returning `GradeResult`).
- [x] Implement `src/engine/flagged_issues.rs` (advisory flags).
- [x] Implement `src/controllers/application.rs` (5 routes).
- [x] Implement `src/views/application.rs` (Tera context builders).
- [x] Write `templates/base.html.tera` with HTMX 2.0.8 + Alpine 3.14.8.
- [x] Write `templates/landing.html.tera`.
- [x] Write `templates/application/index.html.tera` with all 10 wizard steps.
- [x] Write `templates/application/report.html.tera` with outcome, fired rules, flags, and a printable summary.
- [x] Add engine unit tests (empty form, pregnancy redirect, diet-only diabetes, epilepsy eligibility).

## Pending

- [ ] Switch to Postgres-backed persistence via SeaORM.
- [ ] Re-scaffold with the sibling `cargo loco generate` setup script.
- [ ] Replace the printable HTML with a generated PDF.
- [ ] Emit a FHIR R5 Bundle on submit.
- [ ] Add CSV / TSV / XML / JSON import + export endpoints.
- [ ] Add a dashboard listing applications by status.
- [ ] Confirm the sibling `back-end-with-loco-setup`
      script has mode 0755 (the agent that wrote it may not have had
      permission to `chmod` it).
