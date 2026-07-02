# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) — plan

Implementation roadmap. See [`spec/index.md`](./spec/index.md) for the contract.

## Status

All four layers are built as of 2026-07-02: foundation docs (`index.md`,
`spec/index.md`, `AGENTS.md`, `plan.md`, `tasks.md`); SQL migrations plus the
generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup); both
consolidated front-ends (HTML + Lily and SvelteKit + Lily); and the Loco
JSON-API back-end — plus `CHANGELOG.md` and `examples/`.

## Roadmap

1. **Foundation docs** — index, spec, agent instructions. ✅
2. **SQL migrations** — single assessment table in `sql/`: context and
   identification fields, the seven criterion inputs (age plus the risk-factor
   and clinical yes/no flags), timestamps; UUIDv4 PK. Source of truth.
3. **Generated representations** — run the XML, FHIR R5, protobuf, OpenAPI, and
   Loco setup generators.
4. **Scoring engine** — `types.ts`, `utils.ts`, `timi-rules.ts`,
   `timi-grader.ts`, `flagged-issues.ts` with Vitest tests covering the age
   boundary (64/65), the risk-factor threshold (2/3), each band transition, and
   every total 0–7 with its 14-day risk.
5. **Front-ends** — consolidated `front-end-with-html` (Lily wizard + dashboard)
   and `front-end-with-svelte` (Lily; RESTful `/<plural>/` list + `/<plural>/[id]`
   form).
6. **Back-end** — `back-end-with-loco` Rust axum + Loco JSON API, relational
   per-table schema.
7. **Verify** — `bin/test-form timi-risk-score-for-acute-coronary-syndrome`,
   Lily drift checks, spec / changelog drift checks.

## Design notes

- Seven scored inputs, all present/absent; the wizard groups them into 7 steps
  but must remain one continuous single-page wizard.
- Criterion 2 is a **derived count**: it fires when ≥ 3 of five risk factors are
  present. Surface the running count (0–5) and the ≥ 3 threshold in the UI.
- The 14-day composite-event risk is a fixed lookup by score (§4); keep the table
  in one place (`timi-rules.ts`) so front-ends and back-end stay consistent.
- This is the **UA/NSTEMI** score. STEMI presentations use the separate TIMI
  STEMI instrument and are out of scope; make the working-diagnosis field and
  the summary make this explicit.
- A missing input scores 0 for its criterion and raises a data-completeness flag
  — the score can understate risk.
