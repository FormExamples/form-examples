# QRISK3 Cardiovascular Disease Risk Score — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, the QRISK3 model inputs, eligibility flags, timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `qrisk3-rules.ts` (coefficient
   tables and transforms), `qrisk3-grader.ts` (linear predictor → risk % + heart
   age), `flagged-issues.ts` with Vitest tests covering band boundaries, the
   sex-specific model split, the optional Townsend default, and eligibility
   guards.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form qrisk3-cardiovascular-disease-risk-score`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- QRISK3 is a **Cox proportional-hazards model**, not an additive point score:
  the engine weights each input by a fitted coefficient and maps the linear
  predictor through a baseline-survival function. Model the coefficient tables as
  data in `qrisk3-rules.ts` so the grader stays a thin numeric transform.
- Two coefficient sets — female and male; select by `sex`. Erectile-dysfunction
  input applies only to the male model.
- Townsend deprivation is optional; when absent, substitute the cohort mean so it
  contributes neutrally. Required inputs (age, BMI, cholesterol:HDL ratio,
  systolic BP) must be present for a valid result — otherwise raise a
  completeness flag rather than guessing.
- Eligibility guards (established CVD, familial hypercholesterolaemia, age outside
  25–84) suppress a headline result and drive the "not eligible" flag.
- The wizard remains one continuous single-page wizard (8 steps).
