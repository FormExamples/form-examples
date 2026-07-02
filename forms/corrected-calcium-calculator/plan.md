# Corrected Calcium Calculator — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All layers built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup);
both consolidated front-ends (`front-end-with-html` and
`front-end-with-svelte`); the Loco JSON-API back-end; and `CHANGELOG.md` +
`examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single calculation table in `sql/`: context and
   identification fields, `total_calcium` and `albumin` inputs, `symptomatic`
   flag, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Calculation engine** — `types.ts`, `utils.ts`, `calcium-rules.ts`,
   `calcium-calculator.ts`, `flagged-issues.ts` with Vitest tests covering the
   correction formula, classification boundaries (2.20 / 2.60), severity
   thresholds (1.9 / 3.0), and the missing-input path.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form corrected-calcium-calculator`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Only two scored inputs (total calcium, albumin); the wizard is deliberately
  short (6 steps) but must remain one continuous single-page wizard.
- The corrected value requires both inputs; a missing input yields a `null`
  result, `'unknown'` classification, and an incomplete-data flag rather than a
  misleading number.
- Reference range default is 2.20–2.60 mmol/L, matching the adult SI range; both
  boundaries classify as `normal`.
- Display value is rounded to two decimal places; classification and flag
  thresholds use the unrounded value.
