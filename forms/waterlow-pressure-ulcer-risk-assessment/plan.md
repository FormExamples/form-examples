# Waterlow Pressure Ulcer Risk Assessment — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, core category enums, special-risk enums,
   `existingPressureDamage`, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `waterlow-rules.ts`,
   `waterlow-grader.ts`, `flagged-issues.ts` with Vitest tests covering band
   boundaries (9/10, 14/15, 19/20) and each category's point mapping.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form waterlow-pressure-ulcer-risk-assessment`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- Waterlow is a **summed weighted score**: higher total = higher risk — the
  inverse of the Braden Scale (integumentary assessment), where lower = worse.
  Keep the direction explicit in UI copy and tests to avoid confusion.
- Sex-and-age is one clinical category but two point contributions
  (`sexPoints + agePoints`); keep them separate in the engine, combined in the
  summary.
- Each special-risk group contributes only its **highest** applicable option, so
  each group is modelled as a single enum rather than a checklist.
- Existing pressure damage is captured separately and raises a high-priority flag
  regardless of total — prevention alone is insufficient once skin is broken.
- Missing enum inputs score 0 for that category and raise a data-completeness
  flag; the total can then understate risk.
- The wizard is longer than a simple screen (11 steps) but must remain one
  continuous single-page wizard.
