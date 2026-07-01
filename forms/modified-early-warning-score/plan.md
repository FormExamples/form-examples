# Modified Early Warning Score (MEWS) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single observation table in `sql/`: context and
   identification fields, five parameter inputs, optional `previous_mews_score`,
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `mews-rules.ts`,
   `mews-grader.ts`, `flagged-issues.ts` with Vitest tests covering every
   allocation-band boundary, the aggregate band edges, and the
   single-parameter=3 trigger.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form modified-early-warning-score`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Five parameters, each mapped to a 0–3 sub-score by a bidirectional allocation
  table (Subbe 2001): both low and high extremes score. The `mews-rules.ts`
  module holds the per-parameter band tables so the boundaries are declarative
  and testable.
- Two independent escalation signals: aggregate ≥ 5 **and** any single parameter
  = 3. Both must surface in the summary and as flagged issues.
- The wizard is one continuous single-page wizard (8 steps) — do not split.
- A missing numeric input scores 0 for that parameter and raises a
  data-completeness flag; the aggregate can understate risk.
- MEWS is superseded by NEWS2; the summary and docs cross-reference the
  `national-early-warning-score-2` form.
