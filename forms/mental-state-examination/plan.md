# Mental State Examination (MSE) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built (2026-07-02): foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`, Lily-clean); and the `back-end-with-loco` Rust
JSON-API crate. `CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — assessment schema in `sql/`: context and identification
   fields plus the seven domain finding groups, timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Grading engine** — `types.ts`, `utils.ts`, `mse-rules.ts`, `mse-grader.ts`,
   `flagged-issues.ts` with Vitest tests covering each flag threshold, every risk
   level, and the completeness boundary.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list +
   `/<plural>/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form mental-state-examination`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- The MSE is a documentation instrument, not a numeric score: the engine grades
  completeness (Complete / Partial + percentage) and derives a risk indicator
  from flags — it never sums points.
- Ten wizard steps (context, identification, seven domains, summary), but it must
  remain one continuous single-page wizard.
- A domain counts as documented when any of its finding fields is non-blank, so
  clinicians can record a normal domain briefly without leaving it blank.
- Risk flags are the safety-critical output: suicidal / homicidal ideation,
  command hallucinations, psychosis with risk, and self-harm drive a High
  indicator that prompts a full risk assessment and escalation.
- The risk indicator is a documentation prompt, not a validated predictive tool,
  and does not replace a full risk assessment.
