# Tasks: CURB-65 Pneumonia Severity Score

## Scaffolding
- [x] Directory skeleton in place.
- [ ] Verify structure matches `bin/test-form` expectations.

## Documentation
- [x] `index.md` — overview, scope, scoring system (criterion table + bands),
      assessment steps, conventions, compliance.
- [x] `spec/index.md` — living spec (data model, algorithm, flagged issues, I/O).
- [x] `AGENTS.md` — engine shape, algorithm, engine files, conventions, compliance.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` (this file).
- [ ] `doc/curb-65-rules.md` — criterion thresholds and mortality bands.
- [ ] `doc/crb-65-variant.md` — primary-care four-criterion mapping.
- [ ] `doc/bts-nice-alignment.md` — BTS 2009 / NICE NG138 cross-walk.

## Schema
- [ ] `sql/` — assessment, grading_result, grading_flag migrations.

## Interchange representations
- [ ] XML + DTD generated.
- [ ] FHIR R5 JSON generated.
- [ ] Protocol Buffers generated.
- [ ] OpenAPI generated.
- [ ] Loco setup script generated.

## Front-ends
- [ ] `front-end-with-html/` — Lily wizard + dashboard.
- [ ] `front-end-with-svelte/` — Lily wizard + RESTful dashboard.

## Back-end
- [ ] `back-end-with-loco/` — axum + Loco JSON API.

## Tests
- [ ] Vitest unit tests for `curb65-grader.ts` (all criterion boundaries + CRB-65).
- [ ] `bin/test-form curb-65-pneumonia-severity-score` passes.

## Deferred / future
- [ ] Automatic urea-unit detection.
- [ ] LocalStorage autosave with draft recovery.
- [ ] Clinical safety case (DCB0129 / DCB0160).
