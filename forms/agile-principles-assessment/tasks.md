# Agile Principles Assessment — Tasks

## Done

- [x] Author `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`
- [x] Confirm 12 principles in `seed.md`
- [x] SQL migrations (`assessment`, `grading_result`, `grading_fired_rule`,
      `grading_additional_flag`)
- [x] XML + DTD representations generated from SQL
- [x] FHIR R5 JSON representations generated from SQL
- [x] SvelteKit front-end form (14-step wizard, scoring engine, PDF report)
- [x] SvelteKit dashboard (filter, sort, sample data)
- [x] Static HTML form (single-page wizard with vanilla JS engine)
- [x] Static HTML dashboard
- [x] Auto-generate the Loco scaffold setup script and full-stack docs
- [x] Comprehensive Vitest threshold tests (engine + dashboard aggregation)
- [x] Multi-respondent aggregation (mean-of-means) and CSV export on both dashboards
- [x] Validate every Svelte component via the Svelte autofixer (no issues)
- [x] Per-team trend sparkline on the Teams view (Svelte + HTML dashboards)
- [x] Weighted-principle scoring (engine, schema, UI, and tests)
- [x] Anonymous submission mode (toggle on Step 1, masked report/dashboard, schema flag)
- [x] Verified: vitest 55/55 green, svelte-check 0 errors/warnings, `pnpm build` clean for both apps
- [x] Browser smoke-test (Playwright): respondent fill, all-12 Likert scoring, progress bar to 100%, MATURE summary, anonymity toggle disables and clears name field

## Pending

- [ ] Run `cargo loco new` + the generated scaffold setup script to
      produce the actual Rust crate (requires Postgres and the loco CLI)

## Future

(All v1 future items shipped.)
