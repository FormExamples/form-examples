# Plan: 4AT — Rapid Delirium and Cognitive-Impairment Screen

## Current status

Foundation docs authored. Schema, generated representations, front-ends, and the
Rust back-end are not yet implemented.

## Why this form exists

Delirium is common, serious, and under-detected in acute and peri-operative
care. The 4AT is a validated, training-free, sub-two-minute bedside screen
recommended by NICE and SIGN 157 as a first-line delirium test. This form
digitises the instrument: it captures the four item responses, computes the
0–12 total and interpretation band, and surfaces flagged issues that prompt a
full clinical delirium assessment.

## Design principles

- **Faithful to the validated instrument** — exact item wording and the
  0 / 4 and 0 / 1 / 2 point allocations from the published 4AT.
- **Screening aid, not diagnosis** — a positive result triggers, but does not
  replace, a full DSM-5 / ICD-10 delirium assessment.
- **Pure scoring engine** — `scoreFourAT()` is a pure function, fully
  unit-tested.
- **Flags fire independently** — abnormal alertness and acute change raise
  high-priority flags regardless of the total.
- **Single-page wizard** — all steps on one continuous page (monorepo rule).
- **FHIR-first exchange** — canonical interchange is FHIR R5 Bundle; XML is an
  archival fallback.

## Scoring engine

Four items summed to a total (0–12):

1. **Alertness** (0 or 4) — normal / mild transient sleepiness score 0; clearly
   abnormal scores 4.
2. **AMT4** (0–2) — age, DOB, place, current year; 0 / 1 / ≥2-or-untestable
   mistakes.
3. **Attention** (0–2) — months of the year backwards; ≥7 correct / <7-or-refuses
   / untestable.
4. **Acute change or fluctuating course** (0 or 4) — no / yes.

Bands: ≥4 possible delirium ± cognitive impairment; 1–3 possible cognitive
impairment; 0 unlikely.

## Build order

1. [x] Scaffold directory.
2. [x] Foundation docs: `index.md`, `AGENTS.md`, `spec/index.md`, `plan.md`,
       `tasks.md`.
3. [ ] Clinical reference docs under `doc/`.
4. [ ] Author SQL Liquibase migrations in `sql/`.
5. [ ] Generate XML + DTD, FHIR R5, Protobuf, OpenAPI, and the Loco setup
       script.
6. [ ] Build `front-end-with-html/` (Lily wizard + dashboard).
7. [ ] Build `front-end-with-svelte/` (Lily wizard + dashboard).
8. [ ] Build `back-end-with-loco/` (axum + Loco JSON API).
9. [ ] Unit-test the scoring engine (Vitest).
10. [ ] Run `bin/test-form four-a-test-for-delirium`.

## Future enhancements

- Collateral-history capture for item 4 (informant, records).
- Trend view across serial 4AT scores for the same patient.
- Linkage to a delirium care-bundle checklist on a positive screen.
- LocalStorage autosave with draft recovery.
- Bilingual (English / Cymraeg) UI for NHS Wales.
