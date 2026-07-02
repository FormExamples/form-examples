# Paediatric Early Warning Score (PEWS) — plan

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
   identification fields (including `age_band`), the seven parameter inputs, the
   two concern flags, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `pews-rules.ts` (age-band tables
   + per-parameter thresholds), `pews-grader.ts`, `flagged-issues.ts` with
   Vitest tests covering age-band boundaries, parameter thresholds, the
   single-parameter=3 override, concern triggers, and every escalation band.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form paediatric-early-warning-score`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- **Age-banding is central.** The age band is selected first (step 2) and sets
  the normal respiratory-rate and heart-rate ranges used to score those two
  parameters. Rate parameters cannot be scored without it.
- Seven parameters across three domains; the aggregate ranges 0–21. Escalation
  bands: routine (0–1), low (2–3), medium (4–5), high (≥6).
- Override triggers are independent of the total: any single parameter scoring 3,
  nurse/staff concern, and parent/carer concern each escalate on their own.
- Parent / carer concern is a first-class, recorded escalation trigger — a
  recognised predictor of deterioration, not an afterthought.
- Missing numeric input scores 0 for that parameter and raises a
  data-completeness flag — the score can understate risk.
- Must remain one continuous single-page wizard (7 steps).
