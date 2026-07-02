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
- [x] `sql/` migrations authored: assessment, grading result, fired rule, flag.

## Interchange representations
- [x] XML + DTD (generated).
- [x] FHIR R5 JSON (generated).
- [x] Protocol Buffers (generated).
- [x] OpenAPI 3.1 (generated).

## Scoring engine
- [x] `types.ts`, `utils.ts`, `gcs-rules.ts`, `gcs-grader.ts`,
      `flagged-issues.ts`.
- [x] Vitest unit tests (`gcs-grader.test.ts`).

## Front-ends
- [x] `front-end-with-html/` — consolidated HTML wizard + dashboard.
- [x] `front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard.

## Back-end
- [x] `back-end-with-loco/` — Rust axum + Loco JSON API.

## Tests
- [ ] `bin/test-form glasgow-coma-scale` passes (blocked by a repo-wide
      `bin/test-form` harness issue, not by this form).

## Deferred / future
- [ ] Paediatric GCS variant.
- [ ] Serial-observation trend charting.
- [ ] Curated example fixtures per band and for NT / GCS-P cases.
- [ ] Clinical safety case (DCB0129 / DCB0160).
