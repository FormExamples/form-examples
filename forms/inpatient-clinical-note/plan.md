# Inpatient Clinical Note — Plan

Development roadmap and status. See [`index.md`](index.md) for the design and
[`spec/index.md`](spec/index.md) for the living domain spec.

## Phase 1 — Foundation

- [x] Scaffold the form directory (`bin/create-form inpatient-clinical-note`)
- [x] Write `index.md` — design, note types, completeness model, acuity model,
      safety flags, 12-step wizard
- [x] Write `AGENTS.md` — agent instructions and engine contracts
- [x] Write `spec/index.md` — living domain spec
- [x] Write `doc/` — clinical reference documentation (record standards, NEWS2,
      acuity rules, risk assessments, references)
- [x] Author `sql/` migrations — 10 tables, source of truth

## Phase 2 — Derived representations

- [x] `xml/` — XML + DTD per SQL table
- [x] `fhir/r5/` — FHIR HL7 R5 JSON per SQL entity
- [x] `protobuf/` — Protocol Buffers `.proto` per SQL entity
- [x] `openapi/` — OpenAPI 3.1 `.yaml` per SQL entity
- [x] `back-end-with-loco-setup` — Loco scaffold script
- [x] `CHANGELOG.md` + `examples/` — fixtures and FHIR Bundle sample
- [x] `llms.txt`

## Phase 3 — Front ends

- [x] `front-end-with-html/` — 12-step single-page wizard (`index.html`)
- [x] `front-end-with-html/` — dashboard (`dashboard.html`)
- [x] Completeness + acuity engines in `js/`, with repeating-row editors for the
      four child collections
- [x] Lily Design System classes, theme / locale / text-size / share pickers
- [x] `front-end-with-svelte/` — SvelteKit wizard, report, and dashboard routes
- [x] Svelte engine ported to TypeScript with 29 Vitest cases
- [x] `pnpm check` clean, production build green

## Phase 4 — Back end

- [x] `back-end-with-loco/` — Rust axum + Loco JSON API
- [x] One SeaORM migration and one entity per SQL table
- [x] REST controllers per entity, registered in `app.rs`
- [x] Both engines ported to Rust, with 16 engine tests
- [x] `cargo build` + `cargo clippy --all-targets` clean; `cargo test` 49/49
      against a real Postgres database
- [x] `cargo deny --all-features check` passes
- [x] Server-side grading endpoints — `POST`/`GET`
      `/api/inpatient_clinical_notes/{id}/grade`, persisting the grade with its
      rule and flag children in one transaction; append-only, 57/57 tests green

## Phase 5 — Verification

- [x] `bin/test-form inpatient-clinical-note`
- [x] `bin/test-sql-apply inpatient-clinical-note`
- [x] `bin/test-examples-conformance inpatient-clinical-note`
- [x] `bin/lily-html-refactor --check --all`, `bin/lily-svelte-refactor --check --all`
- [x] `bin/page-header-layout-refactor --check`,
      `bin/html-helpers-picker-rename --check`,
      `bin/html-date-time-picker-vendor --check`,
      `bin/svelte-locale-select-refactor --check`
- [x] `bin/test-e2e --html inpatient-clinical-note` — Playwright smoke +
      axe-core, both passing
- [x] Wizard driven end-to-end in a real browser: 12 steps, note-type-driven
      required set, repeating rows, NEWS2 derivation, both gradings, flags

## Known pre-existing gate failures (not caused by this form)

These fail identically with this form removed from the tree — they are
fleet-wide and predate it:

- `bin/lily-sync --check` — `forms/lily-version.md` does not pin the current
  upstream commit.
- `bin/lily-svelte-sync --check` — one snapshot out of 1963 differs upstream.
- `bin/es-modules-refactor --check --all` — 36 of 348 forms flagged
  "no namespace (html-only)", including the reference form this one was
  modelled on.
- `bin/html-theme-locale-select-refactor --check`,
  `bin/svelte-theme-css-sync --check`,
  `bin/svelte-date-time-picker-vendor --check`,
  `bin/svelte-helpers-picker-rename --check` — all report the whole fleet.

## Deferred

- Amendment chain (`amends_note_id`) — see spec §9.
- Full 4AT item-level delirium scoring — see spec §9.
- Wiring the vendored `DateTimePicker` in place of the native
  `datetime-local` input. Note that fleet convention is for this helper to stay
  vendored-but-unwired in **every** form, so doing it here alone would be the
  deviation, not the fix.
- Neither front-end calls the grading endpoints yet; both still grade in the
  browser. The server is now the authority when asked, but nothing asks it.
