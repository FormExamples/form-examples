# Tasks

- [x] 2026-07-22 — Scaffold form via `bin/create-form`; author `index.md`,
      `AGENTS.md`, `spec/index.md` (50-indicator Balanced Scorecard
      catalogue across Finance / Process / Learning and Growth / Customer).
- [x] SQL migrations (parent `hospital_performance_indicators` + child
      `hospital_performance_indicator_value`).
- [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI).
- [x] `front-end-with-html/` — 6-step wizard + dashboard. Verified via
      Playwright (6 steps, 50 indicator rows, localStorage persistence,
      dashboard filters) and `bin/lily-html-refactor --check` (0 risky lines).
- [x] `front-end-with-svelte/` — 6-step wizard + dashboard. (Found and
      cleaned up leftover contamination: the directory contained a
      stray copy of hospital-daily-monitoring-checklist's Svelte code
      from an earlier stalled agent run.) Verified via `svelte-check`
      (0 errors), `vitest run` (3/3), Playwright (6 steps, 50 indicator
      rows, submit → report, 0 console errors).
- [x] `back-end-with-loco/` — Rust JSON API (parent + child SeaORM
      entities). Same Loco FK-auto-singularization bug as
      hospital-dashboard-metrics (plural parent table name), fixed
      identically via explicit-column-name override. Verified via
      `cargo check` (clean) and `cargo test` (27/27 passing).
- [x] Filled in doc-stub files + `llms.txt` that `bin/create-form`
      leaves empty.
- [x] `bin/test-form hospital-performance-indicators` — **PASS**.
