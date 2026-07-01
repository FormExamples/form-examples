# Estimated Glomerular Filtration Rate (eGFR) Calculator — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, calculation inputs (`age_years`, `sex`,
   `serum_creatinine`, `specimen_date`, `steady_state`, `equation`), timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Calculation engine** — `types.ts`, `utils.ts`, `egfr-rules.ts`,
   `egfr-calculator.ts`, `flagged-issues.ts` with Vitest tests covering the
   µmol/L → mg/dL conversion, female/male branches, piecewise min/max, every
   G-stage boundary, and the missing-input path.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form estimated-glomerular-filtration-rate-calculator`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- The engine computes only the **CKD-EPI 2021 creatinine equation**; cystatin C
  and MDRD are documented for context and captured as an `equation` enum, but
  are not implemented in the calculator. If later required, add them as separate
  pure functions selected on `equation`.
- Creatinine is captured in **µmol/L** (UK convention) and converted internally
  to mg/dL for the equation — keep the conversion in one place (`utils.ts`).
- eGFR assumes a **steady state**; a `steadyState == 'no'` answer raises a
  possible-acute-drop flag rather than blocking the calculation.
- G-stage banding uses the **unrounded** eGFR; display rounds to a whole number
  and may show "> 90".
- The wizard is deliberately short (4 steps) but must remain one continuous
  single-page wizard.
