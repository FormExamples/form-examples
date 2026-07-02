# National Early Warning Score 2 (NEWS2) — tasks

## Foundation

- [x] `index.md` — overview, scope, NEWS2 point-allocation table, aggregate
  bands, wizard steps, safety flags, compliance
- [x] `spec/index.md` — living domain spec (data model, grading algorithm,
  flags, inputs/outputs, artefacts, acceptance criteria)
- [x] `AGENTS.md` — directory map, scoring-engine contract, conventions,
  compliance
- [x] `plan.md` — implementation roadmap
- [x] `tasks.md` — this checklist

## Schema and generated artefacts

- [x] `sql/` migrations authored: `assessment_context`, `patient`,
  `observations`, `result`
- [x] Generated XML + DTD
- [x] Generated FHIR R5 JSON
- [x] Generated protobuf `.proto`
- [x] Generated OpenAPI 3.1 YAML
- [x] Generated Loco setup script
- [x] Generated `CHANGELOG.md` + `examples/`

## Scoring engine

- [x] `types.ts`, `utils.ts`
- [x] `news2-rules.ts` — per-parameter band tables + Scale 1 / Scale 2 SpO₂ logic
- [x] `news2-grader.ts` — aggregate, red-score, band, monitoring, response
- [x] `flagged-issues.ts` — safety flags
- [x] Unit tests (RCP worked examples, band boundaries, red-score escalation)

## Front-ends

- [x] `front-end-with-html/` — Lily wizard + dashboard
- [x] `front-end-with-svelte/` — SvelteKit wizard + dashboard

## Back-end

- [x] `back-end-with-loco/` — Rust axum + Loco JSON API (relational per-table)

## Verify

- [ ] `bin/test-form national-early-warning-score-2` (blocked by a repo-wide
  `bin/test-form` harness issue, not by this form)
- [x] `bin/lily-html-refactor --check national-early-warning-score-2`
- [x] `bin/generate-spec.py --check national-early-warning-score-2`
