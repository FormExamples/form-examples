# HAS-BLED Score for Major Bleeding Risk — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus the
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup); both
consolidated front-ends (HTML + Lily and SvelteKit + Lily); and the Loco
JSON-API back-end — plus `CHANGELOG.md` and `examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, nine criterion inputs, timestamps; UUIDv4 PK. Source
   of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `hasbled-rules.ts`,
   `hasbled-grader.ts`, `flagged-issues.ts` with Vitest tests covering the age
   boundary (65/66), the alcohol boundary (7/8 units), the risk-band boundaries
   (0, 2/3), and the minimum and maximum totals (0 and 9).
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form has-bled-score-for-major-bleeding-risk`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- Nine scored items across seven letters (A and D each cover two items); the
  wizard groups them into 10 steps but must remain one continuous single-page
  wizard.
- The **elderly** and **alcohol** criteria are derived from numeric inputs (`age`
  and `alcoholUnitsPerWeek`) rather than separate booleans, so the boundaries
  (> 65; ≥ 8 units/week) live in one place.
- HAS-BLED is a **decision-support** score, not a gate: a score ≥ 3 must be
  presented as a prompt for caution and review, never as a reason to withhold
  anticoagulation. The four modifiable-factor flags carry the score's clinical
  value.
- The optional `chaDsVascScore` context field lets the summary present bleeding
  risk alongside stroke risk, mirroring how the score is used in practice.
- A missing numeric input scores 0 for its criterion and raises a
  data-completeness flag — the score can understate risk.
