# Tasks

- [x] 2026-07-22 — Scaffold form via `bin/create-form`; author `index.md`,
      `AGENTS.md`, `spec/index.md` (97-checkpoint catalogue transcribed
      from the source proforma).
- [x] SQL migrations (parent `hospital_daily_monitoring_checklists` +
      child `hospital_daily_monitoring_checklist_items`).
- [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI).
- [x] `front-end-with-html/` — 24-step wizard + dashboard. Verified via
      Playwright (all 24 sections render, conditional/tally logic works,
      0 console errors) and `bin/lily-html-refactor --check` (0 risky lines).
- [x] `front-end-with-svelte/` — 24-step wizard + dashboard. Verified via
      `svelte-check` (0 errors), `vitest run` (4/4), and Playwright
      (24 fieldsets, 97 item rows, 0 console errors).
- [x] `back-end-with-loco/` — Rust JSON API (parent + child SeaORM
      entities). Verified via `cargo check` (clean) and `cargo test`
      (27/27 passing against a scratch Postgres); fixed a real
      fixture-path bug found while getting tests green.
- [x] Filled in doc-stub files (`doc/`, `fhir/r5/`, `protobuf/`, `sql/`,
      `typespec/`, `xml/`, `front-end-with-html/`) that `bin/create-form`
      leaves empty.
- [x] `bin/test-form hospital-daily-monitoring-checklist` — **PASS**
      (created + migrated the `hospital_daily_monitoring_checklist_{dev,test,production}`
      databases in the repo's persistent local Postgres, which the
      background agent's throwaway scratch instance hadn't populated).
- [x] `bin/lily-html-refactor --check` / `bin/lily-svelte-refactor --check`
      — both 0 risky lines.
