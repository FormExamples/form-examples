# Padua Venous Thromboembolism Risk Assessment — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, the eleven risk-factor inputs, the two bleeding-risk
   fields, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `padua-rules.ts`,
   `padua-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   factor's weight, the age 69/70 and BMI 29/30 boundaries, the score 3/4 band
   boundary, and bleeding-risk gating.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form padua-venous-thromboembolism-risk-assessment`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Eleven weighted factors (four × 3, one × 2, six × 1); total 0–20; high risk at
  **≥ 4**. The wizard groups the factors into themed steps but remains one
  continuous single-page wizard (8 steps).
- Two factors derive from numeric inputs: age ≥ 70 (from `ageYears`) and obesity
  BMI ≥ 30 (from `bodyMassIndex`). A missing numeric input scores 0 for that
  factor and raises a data-completeness flag — the score can understate risk.
- The bleeding-risk check (active bleeding, high bleeding-risk factors) does not
  change the Padua score; it gates the prophylaxis recommendation so a high-risk
  patient with a contraindication is steered to mechanical prophylaxis.
