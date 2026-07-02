# Glasgow Coma Scale — plan

## Current status

All four layers are built as of 2026-07-02: foundation documentation
(`index.md`, `AGENTS.md`, `spec/index.md`, `plan.md`, `tasks.md`); the SQL
schema plus generated derivatives (XML, FHIR R5, protobuf, OpenAPI, Loco
setup); both consolidated front-ends (HTML + Lily and SvelteKit + Lily); and
the Loco JSON-API back-end crate — plus `CHANGELOG.md` and `examples/`.

## Why this form exists

The Glasgow Coma Scale is the most widely used measure of impaired consciousness
worldwide, used from the roadside to the intensive-care unit. Its value depends
on being applied consistently: the three components must be scored separately,
untestable components must be reported honestly rather than guessed, and trends
matter as much as absolute values. This form encodes the 2014 Glasgow structured
approach so scoring is reproducible, the E/V/M breakdown is preserved, and
escalation triggers (GCS ≤ 8, deterioration, abnormal pupils) fire consistently.

## Design principles

- **Three independent components.** E, V, and M are scored and stored
  separately; the total is derived, never entered directly.
- **Honest untestability.** A "not testable" component leaves the total
  undefined rather than substituting an assumed value.
- **Trends escalate.** A falling total or motor score is a first-class flag.
- **GCS-P as a secondary.** Pupil reactivity augments, but never replaces, the
  standard GCS.
- **Pure scoring engine.** Deterministic function with stable rule IDs shared
  across every front-end and the back-end.
- **Schema is the source of truth.** Everything downstream is generated.
- **Single-page wizard.** One continuous form, no multi-page navigation.
- **Consolidated front-ends.** One `front-end-with-html/` and one
  `front-end-with-svelte/`, each combining the wizard and a review dashboard.

## Build order

1. [x] Foundation docs (`index.md`, `AGENTS.md`, `spec/index.md`, `plan.md`,
   `tasks.md`).
2. [x] SQL migrations (assessment + grading result / fired rule / flag).
3. [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI).
4. [x] Loco setup script, examples, `CHANGELOG.md`.
5. [x] `front-end-with-html` (consolidated HTML wizard + dashboard + JS engine).
6. [x] `front-end-with-svelte` (consolidated SvelteKit wizard + dashboard + TS
   engine).
7. [x] `back-end-with-loco` (Rust JSON API crate; `cargo check` + engine tests).

## Future enhancements

- Paediatric GCS variant for pre-verbal children.
- Serial-observation charting to visualise the trend over time.
- Curated example fixtures for each severity band and the NT / GCS-P cases.
