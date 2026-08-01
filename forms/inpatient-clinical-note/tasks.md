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

- Added server-side grading: `POST`/`GET`
  `/api/inpatient_clinical_notes/{id}/grade`, the `grading` module that projects
  the relational record onto the engine's input shape, and persistence of the
  grade with its rule and flag children in one transaction. 57/57 tests green.

## Notes

- The completeness status is deliberately **not** overridable; only the acuity
  band is, and only with a recorded reason. See `spec/index.md` §4.3 and §5.3.
- The required-component set varies by `note_type`. Three implementations now
  encode this (`rules.js`, `note-rules.ts`, `completeness.rs`) — none may
  hard-code a single list, and all three must change together.
- The NEWS2 aggregate is entered-wins-over-derived, and both are always
  reported, so a chart/parameter discrepancy is visible rather than resolved
  silently.
- Enum spellings crossing a boundary (database column, JSON body, either
  front-end) go through `as_str()`, never `{:?}`. The `Debug` form is
  `PascalCase` and everything outside Rust is kebab-case; the two engines and
  the `CHECK` constraints all assume kebab-case.
  `as_str_matches_the_serde_representation` guards this.
- Server-side grading is append-only: each run inserts a new grade row, and
  readers take the most recent. Grades are never updated in place, so
  `graded_at` means what it says and the grading history stays auditable.
- The Loco migration now carries the same column defaults as `sql/`: 160
  columns across the ten tables, `''` for text, `0` for `sort_order`, plus
  `status` = `draft` and `spo2_scale` = `scale-1`. Before this the migration
  declared them `NOT NULL` with no default, so the Loco schema silently
  disagreed with its own source of truth and any insert that omitted a column
  failed. `cargo loco generate scaffold` cannot express defaults, so
  regenerating the crate from `back-end-with-loco-setup` would reintroduce the
  divergence — re-apply the defaults if that ever happens.

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
