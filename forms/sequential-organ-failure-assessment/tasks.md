# Tasks: Sequential Organ Failure Assessment (SOFA)

## Documentation (foundation)
- [x] `index.md` — description, scope, six-system 0–4 threshold tables, total
      0–24, mortality bands, assessment steps, conventions, compliance.
- [x] `spec/index.md` — living spec: data model, grading algorithm, flagged
      issues, I/O shapes, acceptance criteria.
- [x] `AGENTS.md` — directory map, engine I/O shape and files, conventions,
      compliance.
- [x] `plan.md` — design principles and build order.
- [x] `tasks.md` — this file.

## Schema (not started)
- [ ] `sql/` migrations (patient, assessment, six organ-system inputs, grading result).
- [ ] `COMMENT ON TABLE` / `COMMENT ON COLUMN` on every migration.

## Generated representations (not started)
- [ ] `xml/`, `fhir/`, `protobuf/`, `openapi/`, `back-end-with-loco-setup`.

## Scoring engine (not started)
- [ ] `types.ts`, `sofa-rules.ts`, `sofa-grader.ts`, `flagged-issues.ts`, `utils.ts`.
- [ ] `sofa-grader.test.ts` — per-system boundary cases, totals, delta-SOFA.

## Front-ends (not started)
- [ ] `front-end-with-html/` — Lily wizard + dashboard.
- [ ] `front-end-with-svelte/` — Lily RESTful list + form.

## Back-end (not started)
- [ ] `back-end-with-loco/` — Rust axum + Loco JSON API.

## Verify (not started)
- [ ] `bin/test-form sequential-organ-failure-assessment` exits cleanly.
- [ ] Lily HTML and Svelte drift checks pass.
