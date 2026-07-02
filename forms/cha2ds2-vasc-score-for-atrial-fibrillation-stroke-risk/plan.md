# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus the
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup); both
consolidated front-ends (HTML + Lily and SvelteKit + Lily); and the Loco
JSON-API back-end — plus `CHANGELOG.md` and `examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, eight criterion inputs (age years + sex drive the age
   and sex-category points), timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `cha2ds2vasc-rules.ts`,
   `cha2ds2vasc-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   age boundaries, mutually-exclusive age bands, the female / male total-1 edge
   cases, and every total 0–9 against the stroke-rate lookup.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Age is a single mutually-exclusive criterion: ≥ 75 scores 2, 65–74 scores 1,
  < 65 scores 0 — never both bands. The wizard collects age in years and derives
  the band; do not offer both age tick-boxes.
- Female sex is a risk modifier, not an independent risk factor: a woman whose
  only point is sex (total 1) is managed as **low** risk, no anticoagulation.
  Encode this edge case explicitly in the risk-band logic and test it.
- `annualStrokeRatePercent` is a fixed lookup table indexed by total score; keep
  it in `cha2ds2vasc-rules.ts` so it is single-sourced.
- The score guides but does not mandate treatment: pair with **HAS-BLED** for the
  anticoagulation decision. A high-risk band raises a HAS-BLED cross-reference
  flag rather than asserting a treatment.
- Maximum total is 9 (a female aged ≥ 75 scores 2 for age, not 2 + 1).
