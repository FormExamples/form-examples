# Tasks: Medical Information Form for Air Travel (MEDIF)

## Scaffolding
- [x] Run `bin/create-form medical-information-form-for-air-travel`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation
- [x] Top-level `index.md` with the 14-step wizard table and scoring overview.
- [x] `AGENTS.md` with the engine shape, stack summary, and conventions.
- [x] `plan.md` with design principles and build order.
- [x] `tasks.md` (this file).
- [x] `doc/iata-medical-manual.md` — alignment with the IATA Medical Manual.
- [x] `doc/airline-windows.md` — airline-specific recovery windows.
- [x] `doc/fitness-band-rules.md` — rule-by-rule table with predicates and priority.

## Schema
- [x] `sql-migrations/00_extensions.sql`
- [x] `sql-migrations/01_create_function_set_updated_at.sql`
- [x] `sql-migrations/02_create_table_patient.sql`
- [x] `sql-migrations/03_create_table_clinician.sql`
- [x] `sql-migrations/04_create_table_medical_information_form_for_air_travel.sql`
- [x] `sql-migrations/05_create_table_medical_information_form_for_air_travel_grade.sql`
- [x] `sql-migrations/06_create_table_medical_information_form_for_air_travel_grade_rule.sql`
- [x] `sql-migrations/07_create_table_medical_information_form_for_air_travel_grade_flag.sql`

## Interchange representations
- [x] XML + DTD per top-level entity.
- [x] FHIR R5 JSON per top-level entity.
- [x] Protocol Buffers `.proto` schemas per top-level entity.
- [x] TypeSpec interface definitions per top-level entity.

## Front-ends
- [x] `front-end-form-with-svelte/` — SvelteKit 2 + Svelte 5 + Tailwind 4.
- [x] `front-end-form-with-html/` — single-page static HTML + Alpine.js.
- [x] `front-end-dashboard-with-svelte/` — SVAR DataGrid review.
- [x] `front-end-dashboard-with-html/` — HTML review table.

## Full-stack backend
- [x] `full-stack-with-loco-tera-htmx-alpine/` — Loco 0.16 + axum 0.8 + SeaORM
      + Tera + HTMX + Alpine.
- [x] `full-stack-with-loco-tera-htmx-alpine-setup` — generated scaffold script.

## Tests
- [x] Vitest unit tests for `composite-grader.ts`.
- [x] `bin/test-form medical-information-form-for-air-travel` passes.

## Deferred / future
- [ ] Airline-specific submission profiles (Emirates, BA, LOT, KLM, QR).
- [ ] IATA SSR code generator from requested accommodations.
- [ ] Zod schemas for client-side validation.
- [ ] LocalStorage autosave with draft recovery.
- [ ] Bilingual UI (English / Cymraeg, English / Arabic).
- [ ] Airline electronic submission API (where supported).
