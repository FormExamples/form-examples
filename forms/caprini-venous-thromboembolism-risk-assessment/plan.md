# Caprini Venous Thromboembolism Risk Assessment — plan

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
   identification fields, the yes/no risk-factor columns (1-, 2-, 3-, 5-point
   groups), age band, bleeding-risk flag, timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `caprini-rules.ts`,
   `caprini-grader.ts`, `flagged-issues.ts` with Vitest tests covering band
   boundaries, age-band weights, and the bleeding-risk downgrade.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form caprini-venous-thromboembolism-risk-assessment`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Many weighted factors — group the wizard by point value (steps 3–6) so the
  weight of each item is visible, but keep it one continuous single-page wizard.
- Age is scored through a single band field, not a per-factor toggle, to avoid
  double counting.
- The bleeding-risk step gates pharmacological prophylaxis: a high bleeding risk
  downgrades the recommendation to mechanical and raises a contraindication
  flag.
- A missing factor input scores 0 for that factor and raises a
  data-completeness flag — the total can understate risk.
