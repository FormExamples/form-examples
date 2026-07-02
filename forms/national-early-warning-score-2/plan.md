# National Early Warning Score 2 (NEWS2) — implementation plan

## Status

All four layers are built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus the
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup); both
consolidated front-ends (HTML + Lily and SvelteKit + Lily); and the Loco
JSON-API back-end — plus `CHANGELOG.md` and `examples/`.

## Roadmap

1. **Foundation docs** — describe the form, scoring system, and contract.
   *(done)*
2. **SQL schema** (`sql/`) — one migration per table: `assessment_context`,
   `patient`, `observations`, `result`. UUIDv4 PKs; `created_at` / `updated_at`
   / `deleted_at` on every table. Source of truth.
3. **Generated representations** — run the repo generators for XML, FHIR R5,
   protobuf, OpenAPI, the Loco setup script, `CHANGELOG.md`, and `examples/`.
4. **Scoring engine** — `types.ts`, `utils.ts`, `news2-rules.ts`,
   `news2-grader.ts`, `flagged-issues.ts`; pure functions with Vitest unit
   tests covering the RCP worked examples (Scale 1 and Scale 2), band
   boundaries, and red-score escalation.
5. **Front-end (HTML + Lily)** — single-page wizard (`index.html`) + review
   dashboard; conform to the Lily HTML headless contract.
6. **Front-end (SvelteKit + Lily)** — wizard + dashboard on RESTful routes;
   pass `pnpm check` and `pnpm test`.
7. **Back-end (Rust + Loco)** — axum JSON API mirroring the schema; relational
   per-table entities; `cargo build` + `cargo test` pass.
8. **Verify** — `bin/test-form national-early-warning-score-2`,
   `bin/lily-html-refactor --check`, `bin/generate-spec.py --check`.

## Design decisions

- NEWS2 point allocation and aggregate bands follow the RCP 2017 report exactly;
  values are not tuned.
- SpO₂ is scored against Scale 1 or Scale 2; Scale 2 additionally depends on
  whether the patient is on air or oxygen.
- The risk band is the max-severity of the aggregate band and the red-score
  band, so a single extreme parameter cannot be masked by a low aggregate.
- Out-of-scope patients (< 16, pregnancy, spinal-cord injury) are flagged, not
  scored as validated.
