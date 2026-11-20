# US Standard Certificate of Death: plan

## Status

All layers built on 2026-11-20: SQL (six tables), generated representations,
HTML and SvelteKit front-ends, the Axum crate, and ten personas.

## Phases

- [x] Spec first: `spec/index.md`, `index.md`, `AGENTS.md`, `doc/index.md`.
- [x] SQL migrations: `patient`, `clinician`, the certificate, and the `_grade`, `_grade_rule`, `_grade_flag` triad.
- [x] Generated representations: XML, FHIR R5, protobuf, OpenAPI, Axum setup script, CHANGELOG and examples.
- [x] HTML front-end: eleven-step wizard, dashboard, engine in `js/`.
- [x] SvelteKit front-end: engine port in `src/lib/engine/` with vitest tests, eleven step components, dashboard, report.
- [x] Axum back-end: relational per-table JSON API, fleet tools clean.
- [x] Personas: ten, covering every class and all 24 flags.

## Open items

- Verify the filing and certification deadlines marked `verified: false` in `STATE_RULES` against each state statute (see `doc/index.md`).
- Extend `STATE_RULES` beyond eight states.
- Add the remaining NCHS items not modelled here (education, race, Hispanic origin, occupation, parents' names, informant, SSN) if a registrar integration needs them.
