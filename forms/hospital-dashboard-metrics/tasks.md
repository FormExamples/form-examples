# Tasks

- [x] 2026-07-22 — Scaffold form via `bin/create-form`; author `index.md`,
      `AGENTS.md`, `spec/index.md` (67-metric catalogue across 14
      editorially-titled categories; category-title inference documented).
- [x] SQL migrations (parent `hospital_dashboard_metrics` + child
      `hospital_dashboard_metric_value`).
- [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI).
- [x] `front-end-with-html/` — 16-step wizard + dashboard. Verified via
      Playwright (16 step legends, 67 metric value inputs, 0 console
      errors) and `bin/lily-html-refactor --check` (0 risky lines).
- [x] `front-end-with-svelte/` — 16-step wizard + dashboard, all
      routes complete. Removed a dead leftover `ItemRow.svelte`
      (broken imports from a different form, unused). Verified via
      `svelte-check` (0 errors, 4 pre-existing a11y warnings matching
      baseline), `vitest run` (3/3), and Playwright (16 fieldsets, 67
      metric rows, submit → report, 0 console errors).
- [x] `back-end-with-loco/` — Rust JSON API (parent + child SeaORM
      entities). Fixed a real Loco FK-auto-singularization bug (the
      parent table name "hospital_dashboard_metrics" is itself plural,
      so Loco's `references()` helper derived the wrong FK column name;
      fixed via explicit-column override). Verified via `cargo check`
      (clean) and `cargo test` (27/27 passing against a live Postgres).
- [x] Filled in doc-stub files (`doc/`, `fhir/r5/`, `protobuf/`, `sql/`,
      `typespec/`, `xml/`, `front-end-with-html/`, `front-end-with-svelte/`,
      `llms.txt`) that `bin/create-form` leaves empty.
- [x] `bin/test-form hospital-dashboard-metrics` — **PASS**.
- [x] `bin/lily-html-refactor --check` / `bin/lily-svelte-refactor --check`
      / `bin/loco-config-refactor --check` — all clean.
