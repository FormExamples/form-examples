# Apgar Score — plan

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
2. **SQL migrations** — in `sql/`: an assessment table (context,
   identification, resuscitation notes, timestamps; UUIDv4 PK) plus a related
   per-timepoint score table (five signs 0/2, `timepointMinutes`, FK to the
   assessment). Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `apgar-rules.ts`,
   `apgar-grader.ts`, `flagged-issues.ts` with Vitest tests covering band
   boundaries (totals 3/4, 6/7), every trend direction, and the conditional
   10-minute rule.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema (one migration + one entity per SQL table).
7. **Verify** — `bin/test-form apgar-score`, Lily drift checks, spec / changelog
   drift checks.

## Design notes

- The record holds a **repeated** set of five-sign scores, one per timepoint;
  the 1- and 5-minute timepoints are always present, the 10-minute (and later)
  timepoint is conditional on the 5-minute total being below 7.
- The wizard must remain one continuous single-page wizard: the 10-minute step
  is revealed inline (not a separate page) when the 5-minute total < 7.
- Each sign is an explicit 0/1/2 choice; a missing sign scores 0 for that
  timepoint and raises a data-completeness flag — the total can understate
  depression.
- The trend across timepoints is a first-class output, alongside each
  timepoint's band.
</content>
