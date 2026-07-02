# Learning Disability Annual Health Check — plan

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
2. **SQL migrations** — single annual-health-check table in `sql/`: context and
   identification fields, one column per required component, the medication /
   STOMP fields, the Health Action Plan fields, timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Completeness engine** — `types.ts`, `utils.ts`, `review-rules.ts`,
   `review-grader.ts`, `flagged-issues.ts` with Vitest tests covering a fully
   complete check, each missing component, the Health Action Plan gate, and
   every flag including the three STOMP trigger paths.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list +
   `/<plural>/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form learning-disability-annual-health-check`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- This is a **completeness / documentation** form, not a scored risk
  calculator: the engine grades whether the check is complete and confirms the
  Health Action Plan, rather than producing a severity or risk band.
- A component counts as completed only when it carries a real recorded value;
  `not-recorded` / `not-assessed` / `not-reviewed` / `''` do not count, but
  `not-applicable` / `not-eligible` / `no-carer` do (the component was
  considered and correctly ruled out).
- The Health Action Plan is a required output — overall `status` is `complete`
  only when it was produced **and** shared, even if every component was
  completed.
- **STOMP** is a first-class flag: any recorded psychotropic without a
  documented indication, a STOMP discussion, and a last-review date raises it.
- Distinct from the sibling `learning-disability-assessment` form — do not merge
  the two; this one is the annual health check.
- The wizard is long (10 steps) but must remain one continuous single-page
  wizard.
