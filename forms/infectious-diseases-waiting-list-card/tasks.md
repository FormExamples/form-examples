# Tasks: Infectious Diseases Waiting List Card

## Scaffolding
- [x] Existing scaffold under `forms/infectious-diseases-waiting-list-card/`.
- [x] Verify the directory structure matches `bin/test-form` expectations.

## Documentation
- [x] Top-level `index.md` with the 7-step wizard table and scoring overview.
- [x] `AGENTS.md` with the engine shape, stack summary, and conventions.
- [x] `plan.md` with design principles and build order.
- [x] `tasks.md` (this file).
- [x] `spec.md` — living domain spec.
- [x] `doc/index.md` — clinical / policy reference notes.

## Schema
- [x] `sql/00_create_extensions.sql`
- [x] `sql/01_create_function_set_updated_at.sql`
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_practitioner.sql`
- [x] `sql/04_create_table_waiting_list_card.sql`
- [x] `sql/05_create_table_waiting_list_card_appointment.sql`
- [x] `sql/06_create_table_waiting_list_card_grade.sql`
- [x] `sql/07_create_table_waiting_list_card_grade_rule.sql`
- [x] `sql/08_create_table_waiting_list_card_grade_flag.sql`
- [x] `sql/09_schema.sql` — combined schema (generated).

## Generated artefacts
- [ ] `xml/` — generate XML + DTD per SQL table.
- [ ] `fhir/r5/` — generate FHIR R5 JSON per SQL table.
- [ ] `protobuf/` — generate `.proto` per SQL table.
- [ ] `openapi/` — generate `.yaml` per SQL table.
- [ ] `back-end-with-loco-setup` — generate Loco scaffold script.

## SvelteKit practitioner form (`front-end-with-svelte/`)
- [ ] Engine: `types.ts`, `utils.ts`, `priority-targets.ts`,
      `waiting-time-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- [ ] Vitest tests for the composite grader and waiting-time rules.
- [ ] Step components `Step1Practitioner.svelte` through `Step7Signoff.svelte`.
- [ ] PDF rendering via `pdfmake` at `/report/pdf`.

## Static HTML practitioner form (`front-end-with-html/`)
- [ ] Single-page Alpine.js wizard mirroring the SvelteKit version.

## SvelteKit dashboard (`front-end-with-svelte/`)
- [ ] SVAR DataGrid with sortable columns and dropdown filters on
      specialty, clinical priority, and Waiting Time Status.
- [ ] Backend API client with sample-data fallback.

## Static HTML dashboard (`front-end-with-html/`)
- [ ] Sortable HTML table mirroring the SvelteKit dashboard.

## Rust full-stack (`back-end-with-loco/`)
- [ ] `cargo loco new infectious-diseases-waiting-list-card`.
- [ ] Run the generated scaffold script.
- [ ] Tera templates for the practitioner wizard and dashboard.
- [ ] HTMX 2.0.8 + Alpine.js 3.14.8 wiring.
- [ ] Pure scoring engine ported from TypeScript.

## Verify
- [ ] `bin/test-form infectious-diseases-waiting-list-card` exits cleanly.
