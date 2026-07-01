# CAGE Alcohol Questionnaire — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

Foundation docs authored (`index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
`tasks.md`). SQL, generated representations, front-ends, and back-end not yet
built.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, four criterion inputs (yes/no enums), timestamps;
   UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `cage-rules.ts`,
   `cage-grader.ts`, `flagged-issues.ts` with Vitest tests covering each item's
   contribution, every total 0–4, and the `≥ 2` threshold boundary.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form cage-alcohol-questionnaire`, Lily drift checks,
   spec / changelog drift checks.

## Design notes

- Only four scored inputs, all yes/no; the wizard is deliberately short (7 steps)
  but must remain one continuous single-page wizard.
- An unanswered item scores 0 (treated as "no") and raises a data-completeness
  flag — the score can understate risk.
- The eye-opener item is scored like the others but flagged separately as a
  dependence marker, so a "yes" is surfaced even below the total threshold.
- CAGE detects established problem drinking better than early hazardous use; the
  summary should note AUDIT-C as the more sensitive alternative for at-risk
  screening.
