# Anion Gap Calculator — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single calculation table in `sql/`: context and
   identification fields, five electrolyte / albumin inputs, timestamps; UUIDv4
   PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Calculation engine** — `types.ts`, `utils.ts`, `anion-gap-rules.ts`,
   `anion-gap-calculator.ts`, `flagged-issues.ts` with Vitest tests covering
   both formulae, the albumin correction, and each classification boundary.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form anion-gap-calculator`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Five inputs, three required (sodium, chloride, bicarbonate) and two optional
  (potassium, albumin); the wizard is deliberately short (5 steps) but must
  remain one continuous single-page wizard.
- Potassium presence switches the formula and the reference upper bound (16 vs
  12). Keep both the raw and corrected gap visible in the result.
- Classification is driven by the corrected gap when albumin is available so
  hypoalbuminaemia cannot mask a raised gap; surface the masking case as its own
  flag.
- A high or very-high gap surfaces the GOLDMARK / MUDPILES differential as a
  prompt, not a selection — the calculator does not attribute a cause.
