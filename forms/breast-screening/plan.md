# Breast Screening Record — plan

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
2. **SQL migrations** — single screening-record table in `sql/`: context and
   identification, eligibility and consent, mammogram and reading-outcome
   fields, assessment-result fields, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `screening-rules.ts`,
   `screening-grader.ts`, `flagged-issues.ts` with Vitest tests covering every
   reading outcome, every imaging classification 1–5, the symptomatic override,
   the age boundaries, and recalled-but-not-yet-assessed.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form breast-screening`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- Documentation + result-classification form: the engine maps recorded inputs to
  an outcome; it does not compute a numeric score.
- Eligibility is evaluated first and can short-circuit the outcome — a
  symptomatic woman is routed to the symptomatic pathway, and a higher-risk woman
  to the surveillance pathway, regardless of imaging.
- A *recall for assessment* is a two-stage outcome: the initial recall, then a
  refined outcome once the breast imaging classification (1–5) is recorded.
- The wizard must remain one continuous single-page wizard (7 steps); the
  assessment-result step is only clinically relevant when the reading outcome was
  *recall for assessment*, but is always present in the record.
