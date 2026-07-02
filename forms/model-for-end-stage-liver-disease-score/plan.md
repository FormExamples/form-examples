# Model for End-Stage Liver Disease (MELD) Score — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`); the Loco JSON-API back-end; and `CHANGELOG.md` +
`examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, laboratory inputs (bilirubin + unit, INR, creatinine +
   unit, dialysis sessions, CVVHD flag, sodium, albumin), `meldVariant`,
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Calculation engine** — `types.ts`, `utils.ts`, `meld-rules.ts`,
   `meld-calculator.ts`, `flagged-issues.ts` with Vitest tests covering the
   bounds, dialysis rule, unit conversion, sodium correction, 6–40 clamp, and
   mortality bands.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form model-for-end-stage-liver-disease-score`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- The formula is a weighted logarithm: values < 1.0 are raised to 1.0 before
  the log so no term is negative; creatinine is capped at 4.0.
- The dialysis rule overrides the measured creatinine with 4.0 mg/dL when the
  patient has had ≥ 2 haemodialysis sessions or ≥ 24 h CVVHD in the past week.
- MELD-Na applies the sodium correction only when the base MELD > 11, with
  sodium clamped to 125–137 mEq/L.
- Units may be entered as mg/dL or µmol/L; convert before calculating
  (bilirubin ÷ 17.1, creatinine ÷ 88.4).
- A missing lab input required by the chosen variant yields no score (rather than
  a partial one) and raises an incomplete-assessment flag.
- Despite few inputs, the wizard must remain one continuous single-page wizard.
