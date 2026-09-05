---
name: paediatric-early-warning-score-skill
description: "Explains what the Paediatric Early Warning Score (PEWS) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Paediatric Early Warning Score (PEWS)

An age-banded **track-and-trigger** early-warning tool for children. It records a set of physiological observations across three domains — **respiratory**, **cardiovascular**, and **behaviour / neurological** — scores each parameter **0–3** against the **normal range for the child's age band**, sums an aggregate total, and maps that total (together with single-parameter and concern triggers) onto an **escalation band** with a recommended review timeframe. A high score, any single parameter scoring 3, or documented **nurse or parent/carer concern** each prompts escalation and senior review.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `paediatric-early-warning-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `PewsAssessment` TypeScript type — the age band, the seven
  parameter inputs, the two concern flags, plus context and identification.
- **Output shape:**
  ```ts
  gradePews(data: PewsAssessment): {
    respiratoryRateScore: 0 | 1 | 2 | 3;
    respiratoryEffortScore: 0 | 1 | 2 | 3;
    oxygenSaturationScore: 0 | 1 | 2 | 3;
    supplementalOxygenScore: 0 | 1 | 2 | 3;
    heartRateScore: 0 | 1 | 2 | 3;
    capillaryRefillScore: 0 | 1 | 2 | 3;
    consciousnessScore: 0 | 1 | 2 | 3;
    aggregateScore: number;                 // 0..21
    maxParameterScore: 0 | 1 | 2 | 3;
    escalationBand: 'routine' | 'low' | 'medium' | 'high';
    firedTriggers: FiredTrigger[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** age-band-driven then additive. Resolve the age-band normal
  ranges for respiratory rate and heart rate; score every parameter 0–3; sum to
  `aggregateScore`; map to `escalationBand` (`≥6` high, `4–5` medium, `2–3` low,
  else routine). Override triggers — `maxParameterScore == 3`, `nurseConcern`,
  `parentConcern` — raise the effective escalation without changing the total.
  See spec §4. A missing numeric input contributes 0 and raises a
  data-completeness flag; an unset age band leaves the rate parameters unscored.
- **Engine files:** `types.ts`, `utils.ts`, `pews-rules.ts` (age-band tables +
  per-parameter thresholds), `pews-grader.ts`, `flagged-issues.ts`.
- **Tests:** `pews-grader.test.ts`, `pews-rules.test.ts` — cover each age band's
  rate boundaries, every parameter's 0–3 thresholds, the single-parameter=3
  override, the nurse / parent concern triggers, and each escalation-band
  boundary.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
