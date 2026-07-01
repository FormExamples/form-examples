# Chronic Kidney Disease Annual Review — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — review table(s) in `sql/`: context and identification,
   renal function, albuminuria, blood pressure, medication review, and metabolic
   bloods fields; timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Classification engine** — `types.ts`, `utils.ts`, `review-rules.ts`,
   `review-grader.ts`, `flagged-issues.ts` with Vitest tests covering each
   G-stage and A-stage boundary, every KDIGO heat-map cell, the BP-target
   derivation, the rapid-decline rule, and each completeness grade.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form chronic-kidney-disease-review`, Lily drift
   checks, spec / changelog drift checks.

## Design notes

- This is a documentation-completeness and classification form, not a single
  additive score: eGFR → G-stage, ACR → A-stage, and the pair indexes the KDIGO
  heat-map to a risk zone. A parallel completeness grader judges the review
  bundle.
- The KDIGO heat-map is the canonical KDIGO 2012/2024 6×3 grid; the risk zone
  must be derived from the two stages, never entered directly.
- Missing eGFR or ACR yields a `null` category/zone and a data-completeness flag
  — the classification can understate risk when staging data is absent.
- The BP target is derived (< 130/80 when ACR ≥ 70 or diabetes; else < 140/90),
  so the "at target" flag depends on the ACR and diabetes fields.
- Rapid-decline detection needs both current and previous eGFR with sample
  dates; when either is absent the flag is simply not raised.
- The wizard has eight sections but must remain one continuous single-page
  wizard.
