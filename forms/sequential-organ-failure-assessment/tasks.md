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

## Schema (done)
- [x] `sql/` migrations authored (patient, assessment, six organ-system inputs, grading result).
- [x] `COMMENT ON TABLE` / `COMMENT ON COLUMN` on every table migration.

## Generated representations (done)
- [x] `xml/`, `fhir/`, `protobuf/`, `openapi/`, `back-end-with-loco-setup`
      generated, plus `CHANGELOG.md` and `examples/`.

## Scoring engine (done)
- [x] `types.ts`, `sofa-rules.ts`, `sofa-grader.ts`, `flagged-issues.ts`, `utils.ts`.
- [x] `sofa-grader.test.ts` — per-system boundary cases, totals, delta-SOFA.

## Front-ends (done)
- [x] `front-end-with-html/` — Lily wizard + dashboard.
- [x] `front-end-with-svelte/` — Lily RESTful list + form.

## Back-end (done)
- [x] `back-end-with-loco/` — Rust axum + Loco JSON API.

## Verify
- [ ] `bin/test-form sequential-organ-failure-assessment` exits cleanly
      (blocked by a repo-wide `bin/test-form` harness issue, not by this form).
- [x] Lily HTML and Svelte drift checks pass.
