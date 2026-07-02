# Bhutani Bilirubin Nomogram — plan

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
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, gestational age, the measurement inputs (`age_hours`,
   `total_serum_bilirubin`, `measurement_method`), the six risk-factor flags, and
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `bhutani-rules.ts` (the
   tabulated percentile + threshold curves and interpolation), `bhutani-grader.ts`,
   `flagged-issues.ts` with Vitest tests covering zone and threshold boundaries,
   gestation-curve selection, out-of-range age, and missing inputs.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form bhutani-bilirubin-nomogram`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Output is a **classification** (named zone + threshold comparisons), not an
  additive sum — mirror the grading-object contract, not a score total.
- `bhutani-rules.ts` holds the numeric curve data: the 40th/75th/95th percentile
  TSB tracks and the gestation-banded phototherapy / exchange-threshold curves,
  each as age-in-hours → µmol/L, with linear interpolation between tabulated
  points.
- `ageHours` may be entered directly or derived from `bornAt` and `assessedAt`;
  the engine treats it as the x-axis and clamps to the nomogram domain (~0–168 h).
- The zone (prediction) and the threshold comparison (treatment signal) are
  independent; a low zone can still sit below the phototherapy line and vice
  versa. Keep the two lookups separate.
- Gestational age selects the threshold curve; never score a lower-gestation
  infant against a term curve. Below the supported gestational range, decline to
  classify and raise a flag.
- Bilirubin is in **µmol/L** throughout (UK SI convention); do not mix mg/dL.
