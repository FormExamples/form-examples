# Recognition Of Stroke In the Emergency Room (ROSIER) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, blood-glucose precondition, two mimic criteria, five
   neurological-sign inputs, timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `rosier-rules.ts`,
   `rosier-grader.ts`, `flagged-issues.ts` with Vitest tests covering the `> 0`
   threshold boundary, the −2 and +5 extremes, and the hypoglycaemia flag.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form recognition-of-stroke-in-the-emergency-room`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- The score is a **signed** total (−2..+5), unlike the additive 0-based screens;
  the two mimic criteria subtract and the five signs add.
- The positive-screen threshold is **strict `> 0`**: a total of exactly 0 is
  stroke-unlikely. Guard the boundary in tests.
- Blood glucose is a precondition, not a scored item: a low glucose (< 3.5) is a
  treatable mimic that invalidates the score until corrected — it raises a flag
  regardless of the total.
- A negative or zero total does **not** exclude stroke; the engine emits a
  clinical-suspicion-override flag when focal signs are present despite a
  non-positive score.
- The wizard is short (6 steps) but must remain one continuous single-page
  wizard.
