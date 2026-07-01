# Plan: Sequential Organ Failure Assessment (SOFA)

## Current status

Foundation docs authored 2026-07-01 (`index.md`, `spec/index.md`, `AGENTS.md`,
`plan.md`, `tasks.md`). Schema, generated representations, front-ends, and the
Loco back-end are not yet built.

## Why this form exists

SOFA is the standard bedside instrument for quantifying multi-organ dysfunction
in critically ill patients and is the organ-dysfunction axis of the Sepsis-3
definition. It complements single-instrument assessments by combining six organ
systems into one 0–24 score whose serial trend (delta-SOFA) is a strong outcome
predictor. This form is the clinician-operated record of the six objective
sub-scores used for escalation and sepsis screening in the ICU.

## Design principles

- **Objective, clinician-observed data only** — every field is a physiology or
  laboratory value, not patient recall.
- **Deterministic threshold scoring** — each system maps to a 0–4 sub-score via
  the published Vincent 1996 thresholds; no weighting or interpolation.
- **Serial by design** — delta-SOFA against a stored baseline is first-class;
  the Sepsis-3 flag depends on it.
- **Single-page wizard** — nine steps on one continuous page (monorepo rule).
- **Pure scoring engine** — `gradeSofa()` is a pure, fully unit-tested function.
- **Never guess** — a missing input yields a `null` sub-score and an
  incomplete-assessment flag rather than a defaulted zero.

## Scoring engine

Six per-system mappers (respiration, coagulation, liver, cardiovascular, CNS,
renal) feed an orchestrator that sums the total, derives delta-SOFA, bands the
mortality risk, sets the Sepsis-3 flag, and runs the flagged-issues rules.
Cardiovascular and renal take the maximum of their two criteria; respiration
sub-scores 3–4 require respiratory support.

## Build order

1. Author SQL migrations in `sql/` (one migration + one entity per table:
   patient, assessment, per-system rows or a single assessment row, grading result).
2. Regenerate derived representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup).
3. Build the scoring engine and unit tests.
4. Build the consolidated HTML front-end (wizard + dashboard, Lily).
5. Build the consolidated SvelteKit front-end (RESTful list + form, Lily).
6. Build the Loco JSON API crate.
7. `bin/test-form sequential-organ-failure-assessment` and Lily drift checks.
