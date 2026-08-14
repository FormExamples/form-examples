# Plan: Confusion Assessment Method (CAM)

## Current status

All four layers are built as of 2026-07-02: foundation docs (`index.md`,
`AGENTS.md`, `spec/index.md`, `plan.md`, `tasks.md`); SQL migrations plus the
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup); both
consolidated front-ends (HTML + Lily and SvelteKit + Lily); and the Loco
JSON-API back-end — plus `CHANGELOG.md` and `examples/`. The `doc/` clinical
reference notes remain outstanding.

## Why this form exists

Delirium is common, dangerous, and under-recognized in older and critically ill
inpatients — especially the quiet **hypoactive** subtype. The Confusion
Assessment Method gives non-psychiatric clinicians a fast, validated, bedside
way to detect it. This form captures the four CAM features and applies the
diagnostic algorithm so the result is consistent, auditable, and exportable to
the medical record.

## Design principles

- **Classification, not a score** — the output is a boolean status
  (delirium present / absent), not a numeric sum. There is no total and no
  cut-off band table.
- **Feature transparency** — the engine returns the set of positive features so
  the reasoning behind each classification is visible and auditable.
- **One algorithm, two variants** — CAM and CAM-ICU share the identical
  `1 AND 2 AND (3 OR 4)` boolean rule; only the evidence-gathering tasks differ.
- **Safety flags fire independently** — hypoactive delirium and depressed
  consciousness are flagged regardless of the classification result.
- **Single-page wizard** — 8 steps on one continuous page (monorepo rule; no
  multi-page forms).
- **Pure engine** — `gradeCam()` is a pure function with no side effects, fully
  unit-tested with Vitest.

## Scoring engine

The classification engine evaluates four present / absent features:

1. Acute onset and fluctuating course.
2. Inattention.
3. Disorganized thinking.
4. Altered level of consciousness.

and computes `deliriumPresent = 1 AND 2 AND (3 OR 4)`. It returns the
classification, the positive-feature set, the motoric subtype, and a prioritized
flagged-issue list. For CAM-ICU, an unrousable patient (RASS −4/−5) short-circuits
to `unableToAssess`.

## Build order

1. [x] Scaffold directory.
2. [x] Author foundation docs: `index.md`, `AGENTS.md`, `spec/index.md`,
       `plan.md`, `tasks.md`.
3. [ ] Author clinical reference docs in `doc/`.
4. [x] Author SQL Liquibase migrations (assessment, features, result, fired
       flags).
5. [x] Generate XML + DTD representations.
6. [x] Generate FHIR HL7 R5 JSON.
7. [x] Generate Protocol Buffers `.proto` schemas.
8. [x] Build the TypeScript classification engine + Vitest tests.
9. [x] Build the HTML front-end (wizard + dashboard, Lily).
10. [x] Build the SvelteKit front-end (wizard + dashboard, Lily).
11. [x] Build the Rust axum + Loco JSON API.
12. [ ] Run `bin/test-form confusion-assessment-method`.

## Future enhancements

- 4AT rapid-screening cross-reference and comparison.
- CAM-S severity scoring as an optional companion output.
- LocalStorage autosave with draft recovery.
- Playwright end-to-end tests and axe-core accessibility audit.
- Integration with an EHR delirium care bundle.
