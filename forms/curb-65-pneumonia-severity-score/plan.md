# Plan: CURB-65 Pneumonia Severity Score

## Current status

Foundation docs authored 2026-07-01 (`index.md`, `spec/index.md`, `AGENTS.md`,
`plan.md`, `tasks.md`). Schema, generated representations, front-ends, and the
Rust Loco crate are not yet built.

## Why this form exists

Community-acquired pneumonia is common and its mortality spans two orders of
magnitude depending on presentation severity. CURB-65 is a simple, validated
five-criterion rule (Lim *et al.* 2003; BTS-endorsed) that stratifies 30-day
mortality risk and guides the site-of-care decision — home/outpatient,
short-stay/supervised, or hospital admission with possible intensive-care review.
A digital form makes the calculation reproducible, auditable, and exportable to
the record. The CRB-65 variant extends the same logic to primary-care settings
without immediate laboratory access.

## Design principles

- **Faithful to the published rule** — five criteria, one point each, 0–5; bands
  0–1 / 2 / 3–5. No undocumented thresholds.
- **Safety flags fire independently** — hypotension, new confusion, and hypoxia
  raise flags regardless of the numeric total.
- **Graceful degradation to CRB-65** — when urea is unavailable, the four-
  criterion primary-care variant is computed rather than blocking the score.
- **Clinician override is first-class** — the computed disposition is never
  silently discarded; both computed and final are stored and printed.
- **Single-page wizard** — all steps on one continuous page (monorepo rule).
- **Pure scoring engine** — `calculateCurb65()` is a pure function, fully
  unit-tested at every criterion boundary.
- **FHIR-first exchange** — canonical interchange is FHIR R5 Bundle; XML is an
  archival fallback.

## Build order

1. [x] Scaffold directory (skeleton).
2. [x] Foundation docs: `index.md`, `spec/index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`.
3. [ ] `doc/` clinical reference notes (criterion thresholds, mortality bands,
       CRB-65 mapping, BTS/NICE cross-walk).
4. [ ] SQL Liquibase migrations (assessment, grading_result, grading_flag).
5. [ ] Generate XML + DTD, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script.
6. [ ] Build `front-end-with-html/` (Lily wizard + dashboard).
7. [ ] Build `front-end-with-svelte/` (Lily wizard + RESTful dashboard).
8. [ ] Build `back-end-with-loco/` (axum + Loco JSON API).
9. [ ] Unit-test `curb65-grader.ts` (Vitest) at every boundary.
10. [ ] `bin/test-form curb-65-pneumonia-severity-score`.

## Future enhancements

- Automatic urea-unit detection (mmol/L vs mg/dL) with confirmation.
- Side-by-side CURB-65 / CRB-65 display when both are computable.
- LocalStorage autosave with draft recovery.
- Trend view for serial assessments during an admission.
- Clinical safety case (DCB0129 / DCB0160) documentation.
