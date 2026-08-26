# Partogram (Partograph) — plan

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
2. **SQL migrations** — two related tables in `sql/`: a labour header
   (context, identification, admission; UUIDv4 PK) and a child observation table
   (one row per timed observation, UUIDv4 PK, FK to the header). Timestamps on
   both. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Progress / flag engine** — `types.ts`, `utils.ts`, `partogram-rules.ts`,
   `partogram-grader.ts`, `flagged-issues.ts` with Vitest tests covering the
   alert / action line boundaries, FHR and maternal-vital thresholds,
   poor-progress detection, and the no-observation case.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form). The wizard's observation step is a repeatable timed row.
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema (one migration + one entity per SQL table).
7. **Verify** — `bin/test-form partogram`, Lily drift checks, spec / changelog
   drift checks.

## Design notes

- Unlike the snapshot forms, the partogram is a **timed series**: the schema is a
  header plus a child observation table, and the wizard's observation step is a
  repeatable row. Keep the whole thing one continuous single-page wizard.
- The progress classification uses **only the latest dilatation observation**
  against the alert / action lines; the flags scan the **entire** series.
- Output is a **classification, not a score** — there is no numeric total. Report
  `progressClassification` plus `flaggedIssues`.
- The reference time for both lines is `activePhaseStartAt` (dilatation 4 cm). If
  it or the latest dilatation is missing, classify as `normal` and raise the
  incomplete-observation flag.
- Model the classic fixed alert / action lines; the WHO Labour Care Guide's
  individualized ranges are noted as the reference standard but out of scope.
