# Implementation Plan

1. Spec — `spec/index.md` (4-instrument battery: SF-36v2, NDI, mJOA,
   EQ-5D-3L, with exact scoring algorithms). Done.
2. SQL — `sql/` Liquibase migrations: `patient_reported_outcome_measures`
   (raw responses, 61 fields) + `patient_reported_outcome_measures_score`
   (1:1 computed outputs, 19 fields).
3. Generated representations — XML, FHIR R5, protobuf, OpenAPI.
4. Front-end-with-html — vanilla JS wizard (9 steps) + dashboard.
   Scoring engine (sf36/ndi/mjoa/eq5d-rules.js) ported EXACTLY from
   spec/index.md — no invented coefficients.
5. Front-end-with-svelte — SvelteKit wizard mirroring the HTML
   front-end + dashboard; scoring engine as TypeScript with unit tests
   per instrument.
6. Back-end-with-loco — Rust axum + Loco JSON API, 1:1 raw + score
   entities.
7. Verify — `bin/test-form patient-reported-outcome-measures`,
   `bin/lily-html-refactor --check`, `bin/lily-svelte-refactor --check`,
   scoring-engine unit tests (per-instrument, both stacks).

## Status

- [x] Spec
- [x] SQL
- [x] Generated representations
- [x] Scoring engine (hand-written + verified)
- [x] Front-end-with-html
- [x] Front-end-with-svelte
- [x] Back-end-with-loco
- [x] Verify
