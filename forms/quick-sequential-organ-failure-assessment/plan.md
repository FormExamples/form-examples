# Quick Sequential Organ Failure Assessment (qSOFA) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, three criterion inputs, timestamps; UUIDv4 PK. Source
   of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `qsofa-rules.ts`,
   `qsofa-grader.ts`, `flagged-issues.ts` with Vitest tests covering threshold
   boundaries and every total 0–3.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form quick-sequential-organ-failure-assessment`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- Only three scored inputs; the wizard is deliberately short (6 steps) but must
  remain one continuous single-page wizard.
- Mentation criterion accepts either a GCS value (< 15 scores) or a bedside
  "altered from baseline" flag, so it works without formal GCS.
- Missing numeric input scores 0 for that criterion and raises a
  data-completeness flag — the score can understate risk.
