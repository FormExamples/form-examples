# Body Mass Index and Body Surface Area Calculator — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, two measured inputs (`height_cm`, `weight_kg`),
   `ancestry`, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Calculation engine** — `types.ts`, `utils.ts`, `anthropometry-rules.ts`,
   `anthropometry-calculator.ts`, `flagged-issues.ts` with Vitest tests covering
   BMI band boundaries, Asian thresholds, and BSA reference points.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form body-mass-index-and-body-surface-area-calculator`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Two measured inputs only; the wizard is deliberately short (5 steps) but must
  remain one continuous single-page wizard.
- BMI uses the standard WHO adult bands as the primary category; the Asian lower
  thresholds (23, 27.5) are recorded as flags, not as a change to the category.
- BSA defaults to Mosteller (bedside standard); Du Bois is computed and shown
  for comparison because it is the historical reference.
- Because BSA drives chemotherapy dosing (mg/m²), physiologically extreme height
  or weight raises a high-priority "verify" flag before the value is trusted.
- Both height and weight must be present and positive; otherwise BMI/BSA are
  `null` and an incomplete-data flag is raised.
