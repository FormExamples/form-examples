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
- [x] `sql/00_extensions.sql`
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_medical_information_form_for_air_travel.sql`
- [x] `sql/05_create_table_medical_information_form_for_air_travel_grade.sql`
- [x] `sql/06_create_table_medical_information_form_for_air_travel_grade_rule.sql`
- [x] `sql/07_create_table_medical_information_form_for_air_travel_grade_flag.sql`

## Interchange representations
- [x] XML + DTD per top-level entity.
- [x] FHIR R5 JSON per top-level entity.
- [x] Protocol Buffers `.proto` schemas per top-level entity.
- [x] TypeSpec interface definitions per top-level entity.

## Front-ends
- [x] `front-end-with-svelte/` — SvelteKit 2 + Svelte 5 + Tailwind 4.
- [x] `front-end-with-html/` — single-page static HTML + Alpine.js.
- [x] `front-end-with-svelte/` — SVAR DataGrid review.
- [x] `front-end-with-html/` — HTML review table.

## Full-stack backend
- [x] `back-end-with-loco/` — Loco 0.16 + axum 0.8 + SeaORM
      + Loco JSON API.
- [x] `back-end-with-loco-setup` — generated scaffold script.

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
