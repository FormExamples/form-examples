# Post-Anaesthesia Care Unit (PACU) Record — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations in `sql/`
plus the generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco
setup script); both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`); and the `back-end-with-loco` Rust JSON API.
`CHANGELOG.md` and `examples/` are in place.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single recovery-record table in `sql/`: context and
   identification fields, five Aldrete parameter inputs, airway/pain/PONV
   fields, optional PADSS criterion inputs, timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `aldrete-rules.ts`,
   `aldrete-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   discharge boundary, the SpO₂-gated discharge case, each parameter's 0/1/2
   levels, and the PADSS ≥ 9 boundary.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form post-anaesthesia-care-unit-record`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- The wizard has ten steps (one per Aldrete parameter plus context,
  identification, airway/pain/PONV, optional PADSS, and summary) but must remain
  one continuous single-page wizard.
- Discharge-readiness is gated on the oxygen-saturation parameter: a total of 9
  with `oxygenSaturationScore < 2` stays not-ready. This is the key non-additive
  rule and must be covered by a dedicated test.
- PADSS is only scored for ambulatory day-surgery cases; the step is hidden and
  `padssTotal` is `null` for inpatient cases.
- A missing Aldrete parameter scores 0 for that parameter and raises a
  data-completeness flag — the total can understate risk.
