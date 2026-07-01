# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, three item inputs (each an integer 0–4), timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `auditc-rules.ts`,
   `auditc-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   positive-screen boundary (4/5), the band boundaries (5, 8, 11), and the
   minimum and maximum totals (0 and 12).
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form alcohol-use-disorders-identification-test-consumption`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Only three scored items; the wizard is deliberately short (6 steps) but must
  remain one continuous single-page wizard.
- Each item stores the chosen response's 0–4 point value directly, so the
  grader is a plain additive sum — no per-answer lookup at scoring time.
- The Q3 heavy-episode threshold is sex-specific (≥ 6 units female, ≥ 8 units
  male); `sex` selects the wording shown to the user but does not change the
  additive scoring. The default positive cut is ≥ 5 for both sexes; the optional
  female ≥ 4 cut is surfaced only as a low-priority flag.
- A missing item scores 0 for that item and raises a data-completeness flag —
  the total can understate risk.
- Escalation is out of scope for this form: a positive screen recommends the
  separate full 10-item AUDIT rather than computing it here.
