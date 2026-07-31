# Inpatient Clinical Note — Tasks

Task tracking. See [`plan.md`](plan.md) for the phased roadmap.

## Done

- Scaffolded the form and positioned it against its neighbours
  (`ward-round-note`, `soap-note`, `medical-operation-note`,
  `hospital-discharge`) in `index.md` and `AGENTS.md`.
- Wrote `spec/index.md`: entities, the eight note types, the twelve
  completeness components with their predicates, the per-note-type required
  sets, the NEWS2 derivation tables, the acuity band rules, the twelve flag
  conditions, field conventions, validation rules, and open questions.
- Wrote `doc/`: record standards (AoMRC, GMC), NEWS2, the acuity rules with
  worked examples, the mandatory risk assessments, and the reference list.
- Authored ten SQL migrations and proved they apply on a fresh database.
- Ran the whole generator pipeline; every derived artefact is in place.
- Built the HTML front-end: 12-step wizard, dashboard, and both engines in
  plain ES modules. Drove it end-to-end in a real browser.
- Built the SvelteKit front-end: 12 step components, the report with both
  gradings and the acuity rule trace, the SVAR dashboard, and the engines in
  TypeScript with 29 Vitest cases.
- Built the Loco crate: ten migrations, entities, models, and controllers, plus
  both engines in Rust with 16 tests. Whole crate green against Postgres.

## Notes

- The completeness status is deliberately **not** overridable; only the acuity
  band is, and only with a recorded reason. See `spec/index.md` §4.3 and §5.3.
- The required-component set varies by `note_type`. Three implementations now
  encode this (`rules.js`, `note-rules.ts`, `completeness.rs`) — none may
  hard-code a single list, and all three must change together.
- The NEWS2 aggregate is entered-wins-over-derived, and both are always
  reported, so a chart/parameter discrepancy is visible rather than resolved
  silently.

## Pre-existing issues surfaced while building this form

Not fixed here, because they belong to other forms or to the fleet:

- `bin/back-end-with-loco/generate-back-end-with-loco-setup.py --check` reports
  three unrelated forms as stale: `pre-anaesthesia-assessment`,
  `pre-operative-assessment-by-clinician`, `pre-operative-assessment-by-patient`.
  Their setup scripts do not match their own SQL.
- `forms/ward-round-note` and one other form carry
  `THEME_STORAGE_KEY = 'soap-note.theme.v1'` — a copy-paste bug that makes them
  share a theme setting with `soap-note`. Fixed in this form only.
- Several Lily and theme-sync drift detectors fail fleet-wide; see `plan.md`.
