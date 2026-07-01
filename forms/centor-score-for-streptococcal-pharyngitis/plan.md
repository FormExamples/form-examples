# Centor Score for Streptococcal Pharyngitis — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, four criterion inputs, optional measured temperature,
   patient age, red-flag inputs, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `centor-rules.ts`,
   `centor-grader.ts`, `flagged-issues.ts` with Vitest tests covering the fever
   boundary, each age-modifier boundary, every Centor total 0–4, and the full
   McIsaac range −1 to 5.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form centor-score-for-streptococcal-pharyngitis`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- Two scores are surfaced: the original Centor total (0–4) and the McIsaac
  modified score (−1 to 5). Banding uses the McIsaac score so age-related
  probability is reflected.
- The fever criterion scores from either the yes/no flag or a measured
  temperature > 38 °C, so the tool works with or without a thermometer.
- Missing age applies a modifier of 0 (adult 15–44 default) and raises a
  data-completeness flag.
- Red-flag airway/quinsy features fire independently of the score and always
  prompt urgent same-day assessment.
- NICE NG84 lists FeverPAIN as an alternative UK tool; this form implements
  Centor with the McIsaac modification only.
- Keep the wizard one continuous single-page flow (8 steps).
