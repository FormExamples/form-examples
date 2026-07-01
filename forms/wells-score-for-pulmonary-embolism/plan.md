# Wells Score for Pulmonary Embolism — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context,
   identification, and haemodynamic-status fields, the seven criterion inputs
   (six yes/no enums + measured heart rate), timestamps; UUIDv4 PK. Source of
   truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `wells-pe-rules.ts`,
   `wells-pe-grader.ts`, `flagged-issues.ts` with Vitest tests covering
   threshold boundaries (heart rate 100/101, two-level 4/4.5, three-level 1.5/2
   and 6/6.5) and the 0 and 12.5 extremes.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form wells-score-for-pulmonary-embolism`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- The score is weighted (points of 3, 1.5, and 1), so the total is a decimal in
  the range 0–12.5. Band against the exact sum without rounding first.
- The **two-level** NICE scheme (`> 4` likely → CTPA; `≤ 4` unlikely → D-dimer)
  is the operational pathway; the **three-level** original bands (`< 2` low,
  `2–6` moderate, `> 6` high) are retained for reference and audit only.
- A `haemodynamicStatus == 'unstable'` patient is a red flag that bypasses the
  scoring pathway — resuscitate and image immediately; the score is not the
  gate to treatment.
- For **PE unlikely** with low gestalt probability, PERC may support ruling PE
  out without D-dimer. PERC is an adjunct, not a replacement.
- A missing heart rate scores 0 for that criterion and raises a
  data-completeness flag — the total can understate risk.
