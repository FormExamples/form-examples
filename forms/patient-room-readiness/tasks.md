# Tasks

- [x] 2026-07-22 — Scaffold form via `bin/create-form`; author `index.md`,
      `AGENTS.md`, `spec/index.md` (25-checkpoint catalogue).
- [x] SQL migration (single flat `patient_room_readiness_checklist` table).
- [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI).
- [x] `front-end-with-html/` — 3-step wizard + dashboard. Verified via
      Playwright (submit, localStorage persistence, dashboard filters) and
      `bin/lily-html-refactor --check` (0 risky lines).
- [x] `front-end-with-svelte/` — 3-step wizard + dashboard. Verified via
      `svelte-check` (0 errors), `vitest run` (3/3), and Playwright
      (submit → report, dashboard renders, 0 console errors).
- [x] `back-end-with-loco/` — Rust JSON API. Verified via `cargo check`
      (clean) and `cargo test` (25/25 passing against a live Postgres);
      fixed a fixture-path bug matching the established convention.
- [x] Filled in doc-stub files (`doc/`, `fhir/r5/`, `protobuf/`, `sql/`,
      `typespec/`, `xml/`, `front-end-with-html/`, `front-end-with-svelte/`)
      that `bin/create-form` leaves empty.
- [x] `bin/test-form patient-room-readiness` — **PASS**.
- [x] `bin/lily-html-refactor --check` / `bin/lily-svelte-refactor --check`
      / `bin/loco-config-refactor --check` — all clean.
