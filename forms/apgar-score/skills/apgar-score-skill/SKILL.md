---
name: apgar-score-skill
description: "Explains what the Apgar Score form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Apgar Score

A rapid, structured assessment of a newborn's condition in the first minutes after birth. It records five clinical signs — **Appearance** (skin colour), **Pulse** (heart rate), **Grimace** (reflex irritability), **Activity** (muscle tone), and **Respiration** — each scored **0, 1, or 2**, summed to a total of **0–10** at each timepoint. The assessment is repeated at **1 minute** and **5 minutes** after birth, and again at **10 minutes** (and, where indicated, at subsequent 5-minute intervals) whenever the 5-minute score is below 7. The score summarizes the newborn's transition to extrauterine life and the response to any resuscitation given; it is a description of condition and trend, not a prediction of long-term outcome.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `apgar-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `ApgarAssessment` TypeScript type — birth context,
  identification, resuscitation notes, and a repeated array of per-timepoint
  five-sign scores.
- **Output shape:**
  ```ts
  gradeApgar(data: ApgarAssessment): {
    timepoints: Array<{
      timepointMinutes: number;
      total: number;                                   // 0..10
      band: 'reassuring' | 'moderately-low' | 'low';
    }>;
    trend: 'improving' | 'static' | 'falling' | 'insufficient';
    firedSigns: FiredSign[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — per timepoint, sum the five signs (each 0/1/2) to a
  total of 0–10; the total determines the band (`>= 7` reassuring, `4–6`
  moderately low, `<= 3` low). The trend compares consecutive scored timepoints.
  See spec §4. A missing sign contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `apgar-rules.ts`, `apgar-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `apgar-grader.test.ts`, `apgar-rules.test.ts` — cover each band
  boundary (totals 3/4, 6/7), every trend direction, and the conditional
  10-minute rule.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
