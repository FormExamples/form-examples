# Glasgow-Blatchford Bleeding Score (GBS) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields (including `sex`), eight parameter inputs, timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `gbs-rules.ts`, `gbs-grader.ts`,
   `flagged-issues.ts` with Vitest tests covering every band boundary and the
   total endpoints 0 and 23.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form glasgow-blatchford-bleeding-score`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- Six-step wizard, but it must remain one continuous single-page wizard.
- Haemoglobin scoring is **sex-specific**: capture `sex` before the laboratory
  step so the engine selects the correct band table. When sex is unknown, fall
  back to the female table (never awards the men-only 120–129 point) and raise a
  data-completeness flag.
- Blood urea uses SI units (mmol/L); haemoglobin uses g/L. Keep units explicit
  in labels to avoid mis-scoring (e.g. Hb 130 g/L, not 13.0 g/dL).
- Missing numeric input scores 0 for that parameter and raises a
  data-completeness flag — the total can understate risk.
- The very-low-risk discharge threshold is a score of **0** (default); local
  policy may extend the band to **≤ 1**. Encode the default in the engine and
  surface the ≤ 1 option as guidance text, not a hard-coded rule.
- The GBS is a pre-endoscopy score; the post-endoscopy Rockall score is out of
  scope for this form.
