# Tasks: Confusion Assessment Method (CAM)

## Scaffolding
- [x] Directory scaffolded.
- [ ] Verify structure matches `bin/test-form` expectations.

## Documentation
- [x] `index.md` — description, scope, scoring system (four features + the
      `1 AND 2 AND (3 OR 4)` algorithm), assessment steps, flagged issues,
      compliance.
- [x] `spec/index.md` — living domain spec (data model, boolean algorithm,
      flagged issues, I/O shapes; status/classification form).
- [x] `AGENTS.md` — engine I/O shape, algorithm, engine files, conventions,
      compliance.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [ ] `doc/cam-algorithm.md` — feature definitions and the diagnostic rule.
- [ ] `doc/cam-icu.md` — CAM-ICU variant and RASS gating.
- [ ] `doc/nice-cg103-mapping.md` — NICE CG103 delirium guidance cross-walk.
- [ ] `doc/safety-notes.md` — hypoactive delirium and safety-case placeholders.

## Schema
- [ ] `sql/` — assessment, four features, motoric subtype, result, fired flags.

## Interchange representations
- [ ] XML + DTD generated.
- [ ] FHIR R5 JSON generated.
- [ ] Protocol Buffers `.proto` generated.

## Engine
- [ ] `types.ts`, `cam-rules.ts`, `cam-grader.ts`, `flagged-issues.ts`,
      `utils.ts`.
- [ ] Vitest tests: `cam-grader.test.ts`, `cam-rules.test.ts`.

## Front-ends
- [ ] `front-end-with-html/` — HTML + Lily wizard + dashboard.
- [ ] `front-end-with-svelte/` — SvelteKit + Lily wizard + dashboard.

## Back-end
- [ ] `back-end-with-loco/` — Rust axum + Loco JSON API.

## Tests
- [ ] `bin/test-form confusion-assessment-method` passes.

## Deferred / future
- [ ] 4AT rapid-screening cross-reference.
- [ ] CAM-S severity scoring companion.
- [ ] Playwright end-to-end tests.
- [ ] Axe-core accessibility audit.
- [ ] EHR delirium care-bundle integration.
