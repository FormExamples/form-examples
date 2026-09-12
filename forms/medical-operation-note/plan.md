# Medical Operation Note — Implementation Plan

## Phase 1 — Foundation (this commit)

- [x] `index.md` — form overview, 12-step wizard table, scoring system,
      safety flags, directory layout, clinical grounding.
- [x] `AGENTS.md` — agent instructions, scoring-engine shape,
      operating-team rules, conventions, stacks, clinical grounding.
- [x] `plan.md` — this file.
- [x] `tasks.md` — initial task tracking.

## Phase 2 — Schema (this commit)

- [x] `sql/00_create_extensions.sql` (pre-scaffolded).
- [x] `sql/01_create_function_set_updated_at.sql` (pre-scaffolded).
- [x] `sql/02_create_table_patient.sql`
- [x] `sql/03_create_table_clinician.sql`
- [x] `sql/04_create_table_medical_operation_note.sql`
- [x] `sql/05_create_table_medical_operation_note_team_member.sql`
- [x] `sql/06_create_table_medical_operation_note_procedure.sql`
- [x] `sql/07_create_table_medical_operation_note_step.sql`
- [x] `sql/08_create_table_medical_operation_note_implant.sql`
- [x] `sql/09_create_table_medical_operation_note_drain.sql`
- [x] `sql/10_create_table_medical_operation_note_specimen.sql`
- [x] `sql/11_create_table_medical_operation_note_complication.sql`
- [x] `sql/12_create_table_medical_operation_note_grade.sql`
- [x] `sql/13_create_table_medical_operation_note_grade_rule.sql`
- [x] `sql/14_create_table_medical_operation_note_grade_flag.sql`

## Phase 3 — Generated artefacts (this commit)

- [x] `xml/` — XML + DTD per SQL table.
- [x] `fhir/r5/` — FHIR R5 JSON per SQL entity.
- [x] `protobuf/` — `.proto` per SQL entity.
- [x] `openapi/` — OpenAPI 3.1 `.yaml` per SQL entity.
- [x] `back-end-with-loco-setup` — Loco scaffold script.

## Phase 4 — Front-ends (deferred, parallel subagents)

- [x] `front-end-with-html/` — static single-page wizard, Lily
      Design System headless.
- [x] `front-end-with-svelte/` — SvelteKit single-page wizard,
      Lily Svelte headless.
- [x] `front-end-with-html/` — HTML review table.
- [x] `front-end-with-svelte/` — SvelteKit SVAR DataGrid.

## Phase 5 — Backend (deferred)

- [x] `back-end-with-loco/` — Rust Loco backend with
      Loco JSON API.

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
