# GRACE Score for Acute Coronary Syndrome — plan

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
   identification fields, the eight GRACE variable inputs (with creatinine
   unit), timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `grace-rules.ts`,
   `grace-grader.ts`, `flagged-issues.ts` with Vitest tests covering band
   boundaries, mortality-band thresholds, creatinine unit normalization, and the
   max-band rule.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list +
   `/<plural>/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form grace-score-for-acute-coronary-syndrome`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- GRACE is a **weighted regression point model**, not a simple additive
  checklist: age, heart rate, systolic BP, creatinine, and Killip class each map
  through a banded point lookup with differing weights (systolic BP is
  inverse — lower pressure adds more points). Encode the bands as named lookup
  tables in `grace-rules.ts`, boundaries covered by tests.
- Serum creatinine may be entered in mg/dL or µmol/L; normalize to mg/dL
  (µmol/L ÷ 88.4) before banding and store the entered unit alongside the raw
  value.
- Two mortality horizons (in-hospital, 6-month) have different thresholds; the
  overall risk category is the worse of the two (max-band rule).
- The `invasiveStrategy` recommendation is derived from the risk category (Low →
  selective; Intermediate → angiography within 72 h; High → early angiography
  within 24 h) and is advisory — final timing is a clinical decision.
- A missing numeric input scores 0 for that variable and raises a
  data-completeness flag — the score can understate risk.
