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

- [ ] `sql/` migrations: `assessment_context`, `patient`, `observations`,
  `result`
- [ ] Generate XML + DTD
- [ ] Generate FHIR R5 JSON
- [ ] Generate protobuf `.proto`
- [ ] Generate OpenAPI 3.1 YAML
- [ ] Generate Loco setup script
- [ ] Generate `CHANGELOG.md` + `examples/`

## Scoring engine

- [ ] `types.ts`, `utils.ts`
- [ ] `news2-rules.ts` — per-parameter band tables + Scale 1 / Scale 2 SpO₂ logic
- [ ] `news2-grader.ts` — aggregate, red-score, band, monitoring, response
- [ ] `flagged-issues.ts` — safety flags
- [ ] Unit tests (RCP worked examples, band boundaries, red-score escalation)

## Front-ends

- [ ] `front-end-with-html/` — Lily wizard + dashboard
- [ ] `front-end-with-svelte/` — SvelteKit wizard + dashboard

## Back-end

- [ ] `back-end-with-loco/` — Rust axum + Loco JSON API (relational per-table)

## Verify

- [ ] `bin/test-form national-early-warning-score-2`
- [ ] `bin/lily-html-refactor --check national-early-warning-score-2`
- [ ] `bin/generate-spec.py --check national-early-warning-score-2`
