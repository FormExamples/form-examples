# Medical Operation Note — Implementation Plan

## Phase 1 — Foundation (this commit)

- [x] `index.md` — form overview, 12-step wizard table, scoring system,
      safety flags, directory layout, clinical grounding.
- [x] `AGENTS.md` — agent instructions, scoring-engine shape,
      operating-team rules, conventions, stacks, clinical grounding.
- [x] `plan.md` — this file.
- [x] `tasks.md` — initial task tracking.

## Phase 2 — Schema (this commit)

- [x] `sql-migrations/00_create_extensions.sql` (pre-scaffolded).
- [x] `sql-migrations/01_create_function_set_updated_at.sql` (pre-scaffolded).
- [ ] `sql-migrations/02_create_table_patient.sql`
- [ ] `sql-migrations/03_create_table_clinician.sql`
- [ ] `sql-migrations/04_create_table_medical_operation_note.sql`
- [ ] `sql-migrations/05_create_table_medical_operation_note_team_member.sql`
- [ ] `sql-migrations/06_create_table_medical_operation_note_procedure.sql`
- [ ] `sql-migrations/07_create_table_medical_operation_note_step.sql`
- [ ] `sql-migrations/08_create_table_medical_operation_note_implant.sql`
- [ ] `sql-migrations/09_create_table_medical_operation_note_drain.sql`
- [ ] `sql-migrations/10_create_table_medical_operation_note_specimen.sql`
- [ ] `sql-migrations/11_create_table_medical_operation_note_complication.sql`
- [ ] `sql-migrations/12_create_table_medical_operation_note_grade.sql`
- [ ] `sql-migrations/13_create_table_medical_operation_note_grade_rule.sql`
- [ ] `sql-migrations/14_create_table_medical_operation_note_grade_flag.sql`

## Phase 3 — Generated artefacts (this commit)

- [ ] `xml-representations/` — XML + DTD per SQL table.
- [ ] `fhir-r5/` — FHIR R5 JSON per SQL entity.
- [ ] `protobuf/` — `.proto` per SQL entity.
- [ ] `openapi/` — OpenAPI 3.1 `.yaml` per SQL entity.
- [ ] `back-end-with-loco-setup` — Loco scaffold script.

## Phase 4 — Front-ends (deferred, parallel subagents)

- [ ] `front-end-form-with-html/` — static single-page wizard, Lily
      Design System headless.
- [ ] `front-end-form-with-svelte/` — SvelteKit single-page wizard,
      Lily Svelte headless.
- [ ] `front-end-dashboard-with-html/` — HTML review table.
- [ ] `front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid.

## Phase 5 — Backend (deferred)

- [ ] `back-end-with-loco/` — Rust Loco backend with
      Tera + HTMX + Alpine.js.

## Phase 6 — Verification

- [ ] `bin/test-form medical-operation-note` passes.
- [ ] `bin/lily-html-refactor --check medical-operation-note` clean.
- [ ] `bin/lily-svelte-refactor --check medical-operation-note` clean.
- [ ] `bin/generate-spec.py --check medical-operation-note` clean.

## Open questions

- Do we include intra-operative imaging fields (fluoroscopy minutes, US
  exam summary)? Default: yes, optional.
- Robotic console fields (Da Vinci docking time, console time)?
  Default: optional add-on.
- Tissue banking / biobank consent capture? Default: out of scope —
  separate form.
