# Medical Operation Note — Tasks

## Done

- Draft `index.md` with 12-step wizard and composite risk grading.
- Draft `AGENTS.md` with scoring-engine shape, operating-team rules,
  conventions, and stack notes.
- Draft `plan.md` and `tasks.md`.

## In progress

- Author SQL migrations 02–14 for the operation-note schema.

## To do

### Schema

- patient, clinician — shared lookup tables (mirror canonical reference).
- medical_operation_note — main table; identification, team summary,
  diagnoses, anaesthesia, approach, counts, EBL, complications, plan.
- medical_operation_note_team_member — join: clinician × op note + role.
- medical_operation_note_procedure — primary / secondary procedures with
  OPCS-4 codes.
- medical_operation_note_step — numbered free-text operative steps.
- medical_operation_note_implant — implants / prostheses with lot, serial,
  expiry, manufacturer, registry submitted.
- medical_operation_note_drain — drains, packs, catheters with site,
  output target, removal plan.
- medical_operation_note_specimen — pathology samples with container,
  fixative, destination, urgency.
- medical_operation_note_complication — Clavien–Dindo grade + description.
- medical_operation_note_grade — computed composite risk + surgeon
  override.
- medical_operation_note_grade_rule — which rules fired and at what
  band.
- medical_operation_note_grade_flag — safety flags with priority.

### Generated artefacts

- Run `bin/xml-representations/generate-xml-representations.py`.
- Run `bin/fhir-r5/generate-fhir-r5-representations.py`.
- Run `bin/protobuf/generate-protobuf-representations.py`.
- Run `bin/openapi/generate-openapi-representations.py`.
- Run `bin/back-end-with-loco/generate-back-end-with-loco-setup.py`.

### Front-ends

- `front-end-form-with-html/` — single-page op-note wizard with Lily
  Design System.
- `front-end-form-with-svelte/` — SvelteKit op-note wizard with Lily
  Svelte components.
- `front-end-dashboard-with-html/` — review table.
- `front-end-dashboard-with-svelte/` — SVAR DataGrid review dashboard.

### Backend

- `back-end-with-loco/` — Loco / Tera / HTMX / Alpine
  full-stack implementation.

### Verification

- `bin/test-form medical-operation-note`.
- Lily HTML & Svelte refactor checks.
- Per-form spec generator check.
