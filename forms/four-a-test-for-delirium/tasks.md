# Tasks: 4AT — Rapid Delirium and Cognitive-Impairment Screen

## Scaffolding
- [x] Directory scaffolded.
- [ ] Verify structure against `bin/test-form four-a-test-for-delirium`.

## Documentation
- [x] `index.md` — overview, four-item scoring table, 0–12 bands.
- [x] `AGENTS.md` — engine shape, algorithm, conventions, compliance.
- [x] `spec/index.md` — living domain spec (data model, algorithm, flags, I/O).
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` — this file.
- [ ] `doc/scoring-rules.md` — item-by-item predicates and point allocations.
- [ ] `doc/validation-evidence.md` — 4AT validation and diagnostic accuracy.
- [ ] `doc/nice-sign-alignment.md` — NICE CG103 / SIGN 157 cross-walk.

## Schema
- [ ] `sql/` — patient/assessment table plus grading-result table.

## Interchange representations
- [ ] XML + DTD generated.
- [ ] FHIR R5 JSON generated.
- [ ] Protobuf generated.
- [ ] OpenAPI generated.
- [ ] Loco setup script generated.

## Front-ends
- [ ] `front-end-with-html/` — Lily wizard + dashboard.
- [ ] `front-end-with-svelte/` — Lily wizard + dashboard.

## Back-end
- [ ] `back-end-with-loco/` — axum + Loco JSON API.

## Tests
- [ ] Vitest unit tests for the scoring engine.
- [ ] `bin/test-form four-a-test-for-delirium` passes.

## Deferred / future
- [ ] Collateral-history capture for item 4.
- [ ] Serial-score trend view.
- [ ] Delirium care-bundle linkage on positive screen.
- [ ] LocalStorage autosave with draft recovery.
