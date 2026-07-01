# Tasks: Glasgow Coma Scale

## Scaffolding
- [x] Scaffold the directory structure.
- [x] Verify the layout matches `bin/test-form` expectations.

## Documentation
- [x] Top-level `index.md` with the E/V/M component tables, severity bands,
      GCS-P note, and assessment steps.
- [x] `AGENTS.md` with the engine I/O shape, algorithm, engine files, and
      conventions.
- [x] `spec/index.md` living domain spec (data model, algorithm, flag rules,
      I/O shapes).
- [x] `plan.md` with design principles and build order.
- [x] `tasks.md` (this file).
- [ ] `doc/` — GCS structured approach, GCS-P derivation, head-injury escalation.

## Schema
- [ ] `sql/` migrations: assessment, grading result, fired rule, flag.

## Interchange representations
- [ ] XML + DTD (generated).
- [ ] FHIR R5 JSON (generated).
- [ ] Protocol Buffers (generated).
- [ ] OpenAPI 3.1 (generated).

## Scoring engine
- [ ] `types.ts`, `utils.ts`, `gcs-rules.ts`, `gcs-grader.ts`,
      `flagged-issues.ts`.
- [ ] Vitest unit tests (`gcs-grader.test.ts`, `flagged-issues.test.ts`).

## Front-ends
- [ ] `front-end-with-html/` — consolidated HTML wizard + dashboard.
- [ ] `front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard.

## Back-end
- [ ] `back-end-with-loco/` — Rust axum + Loco JSON API.

## Tests
- [ ] `bin/test-form glasgow-coma-scale` passes.

## Deferred / future
- [ ] Paediatric GCS variant.
- [ ] Serial-observation trend charting.
- [ ] Curated example fixtures per band and for NT / GCS-P cases.
- [ ] Clinical safety case (DCB0129 / DCB0160).
