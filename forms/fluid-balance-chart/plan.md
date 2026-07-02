# Fluid Balance Chart — plan

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
2. **SQL migrations** — two tables in `sql/`: a chart header (context, weight,
   charting period) and a `fluid_balance_entry` line-item table (timestamp,
   direction, category, description, volume) with a foreign key to the header;
   UUIDv4 PKs and `created_at` / `updated_at` / `deleted_at` timestamps. Source
   of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Computation engine** — `types.ts`, `utils.ts`, `balance-rules.ts`,
   `balance-grader.ts`, `flagged-issues.ts` with Vitest tests covering net
   balance, subtotals, running-balance ordering, mL/kg/h, the oliguria/anuria
   boundaries, period scaling, and each classification outcome.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/fluid-balance-charts/` list +
   `/fluid-balance-charts/[id]` form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema (chart header + entry line items).
7. **Verify** — `bin/test-form fluid-balance-chart`, Lily drift checks, spec /
   changelog drift checks.

## Design notes

- The chart is a **header + repeating line items** model (unlike the flat
  single-record scored assessments); the wizard must still be one continuous
  single-page wizard with add/remove rows for intake and output entries.
- The engine is **arithmetic, not a validated score** — net balance plus a
  four-way status classification (Balanced / Positive / Negative / Oliguria).
- **Oliguria takes precedence** in the classification because low urine output
  (< 0.5 mL/kg/h, KDIGO) is the highest-priority monitoring signal, independent
  of the net balance sign.
- Weight in kg is required for the mL/kg/h urine-output rate; if weight is
  missing the rate is `null`, oliguria/anuria cannot be classified, and an
  incomplete-recording flag fires.
- Significant-balance thresholds default to ±1000 mL per 24 h and scale to the
  charting period so shorter or longer charts grade proportionally.
</content>
