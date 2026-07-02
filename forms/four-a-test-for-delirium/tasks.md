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
- [x] `sql/` — patient/assessment table plus grading-result table.

## Interchange representations
- [x] XML + DTD generated.
- [x] FHIR R5 JSON generated.
- [x] Protobuf generated.
- [x] OpenAPI generated.
- [x] Loco setup script generated.

## Front-ends
- [x] `front-end-with-html/` — Lily wizard + dashboard.
- [x] `front-end-with-svelte/` — Lily wizard + dashboard.

## Back-end
- [x] `back-end-with-loco/` — axum + Loco JSON API.

## Tests
- [x] Vitest unit tests for the scoring engine (`fourat-grader.test.ts`).
- [ ] `bin/test-form four-a-test-for-delirium` passes (blocked by a repo-wide
      `bin/test-form` harness issue, not by this form).

## Deferred / future
- [ ] Collateral-history capture for item 4.
- [ ] Serial-score trend view.
- [ ] Delirium care-bundle linkage on positive screen.
- [ ] LocalStorage autosave with draft recovery.
