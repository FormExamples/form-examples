# Heart Failure Annual Review — plan

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
2. **SQL migrations** — review table(s) in `sql/`: context and identification,
   diagnosis, functional status, fluid status, investigations, four medication
   pillars, devices, vaccinations, self-management; timestamps; UUIDv4 PK.
   Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `review-rules.ts`,
   `review-grader.ts`, `flagged-issues.ts` with Vitest tests covering each NYHA
   class, each heart-failure type, optimization-status transitions, the
   potassium/eGFR thresholds, and each completeness band.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form heart-failure-review`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- One continuous single-page wizard (nine sections); no multi-page forms.
- This is a documentation / status-classification form, not a diagnostic
  calculator — it assumes a prior confirmed diagnosis and subtype.
- The medication-optimization model is driven by `heartFailureType`: the four
  pillars are indicated for HFrEF; the SGLT2 inhibitor is the principal pillar
  for HFmrEF/HFpEF. A pillar marked `contraindicated` / `not-tolerated` counts
  as addressed so the optimization grade is not penalised for documented reasons.
- Monitoring bloods (U&E, eGFR, potassium) gate both the safety flags and the
  completeness grade because they underpin safe RAAS-inhibitor and MRA use.
- Missing numeric inputs never fabricate a positive finding; they raise
  completeness or monitoring flags instead.
