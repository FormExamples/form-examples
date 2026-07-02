# Edinburgh Postnatal Depression Scale (EPDS) — plan

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
   identification fields, ten item-score columns (0–3), timestamps; UUIDv4 PK.
   Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `epds-rules.ts`,
   `epds-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   reverse-score mapping per item, the band boundaries (9/10, 12/13), the full
   0–30 range, and the item-10 safety flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form edinburgh-postnatal-depression-scale`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- Ten scored items; the wizard groups them (1–4, 5–9, item 10 alone) but must
  remain one continuous single-page wizard.
- Items 3, 5, 6, 7, 8, 9, 10 are reverse-scored. Reverse scoring is applied at
  the option→score mapping so stored `item1..item10` are always 0–3 with higher
  = more symptomatic; the grader then simply sums them.
- **Item 10 is a safety-critical field.** Any score > 0 raises an urgent
  self-harm flag independent of the total, and the front-ends must surface it
  prominently regardless of the band.
- A missing item scores 0 and raises a data-completeness flag — the total can
  understate risk.
- Two thresholds are retained (≥ 10 sensitive, ≥ 13 specific) rather than
  collapsing to one, so services can apply their local pathway.
