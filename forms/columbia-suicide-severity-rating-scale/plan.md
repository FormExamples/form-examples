# Columbia Suicide Severity Rating Scale (C-SSRS) — plan

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
   identification fields, ideation items Q1–Q5, optional intensity sub-items,
   behaviour categories with recency and lethality, means and protective-factor
   fields, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `cssrs-rules.ts`,
   `cssrs-grader.ts`, `flagged-issues.ts` with Vitest tests covering every
   ideation level, behaviour category, recency window, lethality threshold, and
   risk tier.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form columbia-suicide-severity-rating-scale`, Lily
   drift checks, spec / changelog drift checks.

## Design notes

- The output is a **risk tier**, not a summed score; the engine returns the
  ordinal ideation level, categorical behaviour, and a Low / Moderate / High
  tier with a management recommendation.
- Ideation items are asked in ascending order but each is recorded
  independently; `ideationLevel` is the maximum affirmative item.
- Non-suicidal self-injury is recorded and flagged separately and never sets a
  suicidal-behaviour tier.
- Recency drives escalation: any suicidal behaviour within the past 3 months, or
  ideation level 4–5, or a high-lethality attempt, forces the High tier and an
  immediate safety / crisis referral flag.
- Access to lethal means always raises a flag; means-restriction counselling is
  part of the Moderate and High management responses.
- The wizard must remain one continuous single-page wizard. Present the
  instrument sensitively with plain-language framing and crisis-resource
  signposting.
