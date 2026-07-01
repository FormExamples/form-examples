# Parkland Formula for Burns — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, calculation inputs (`weight_kg`, `tbsa_percent`,
   `tbsa_method`, `injury_at`, `injury_time_known`), injury-feature flags,
   timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Calculation engine** — `types.ts`, `utils.ts`, `parkland-rules.ts`,
   `parkland-calculator.ts`, `flagged-issues.ts` with Vitest tests covering the
   base formula, the 50/50 split, the time-offset boundaries, both phase rates,
   the urine-output band, and every flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form parkland-formula-for-burns`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- The calculation is arithmetic, not additive scoring: the engine returns
  volumes and rates, not points, so unit tests assert numeric equality (e.g.
  70 kg × 30% → 8400 mL total, 4200 mL per phase).
- The **8h / 16h split is measured from the time of injury, not arrival**. The
  time-offset (`remainingFirst8hHours`) is the subtle part: at 0 h elapsed the
  first-phase window is a full 8 h; at 3 h elapsed it is 5 h (so the rate is
  higher); at ≥ 8 h it is 0 h and the first phase is overdue (rate `null`, flag
  fires). Test these boundaries explicitly.
- Missing weight or %TBSA yields `null` volumes and a data-completeness flag —
  never invent partial arithmetic.
- Superficial (epidermal) burns are excluded from `tbsaPercent` at data entry;
  the wizard should make this explicit in the burn-extent step.
- The output is a **starting prescription**; the summary must foreground the
  urine-output titration target (0.5–1.0 mL/kg/h adults) so the formula is not
  read as a fixed dose.
- Keep it one continuous single-page wizard (7 steps).
