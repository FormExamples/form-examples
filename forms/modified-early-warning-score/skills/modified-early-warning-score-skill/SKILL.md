---
name: modified-early-warning-score-skill
description: "Explains what the Modified Early Warning Score (MEWS) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Modified Early Warning Score (MEWS)

A bedside aggregate **track-and-trigger** score for adult inpatients. It records five routine physiological observations — **systolic blood pressure**, **heart rate**, **respiratory rate**, **temperature**, and **level of consciousness (AVPU)** — allocates each a sub-score of **0–3**, sums an aggregate of **0–14**, and triggers escalation when the aggregate is high or any single parameter scores the maximum. A high MEWS is not a diagnosis; it is a prompt to increase monitoring frequency, obtain urgent medical review, and consider critical-care outreach.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `modified-early-warning-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `MewsObservation` TypeScript type — the five parameter inputs
  plus context, identification, and optional `previousMewsScore`.
- **Output shape:**
  ```ts
  gradeMews(data: MewsObservation): {
    systolicBloodPressurePoint: 0 | 1 | 2 | 3;
    heartRatePoint: 0 | 1 | 2 | 3;
    respiratoryRatePoint: 0 | 1 | 2 | 3;
    temperaturePoint: 0 | 1 | 2 | 3;
    avpuPoint: 0 | 1 | 2 | 3;
    mewsScore: number;              // 0..14
    riskBand: 'low' | 'medium' | 'high';
    singleParameterTrigger: boolean;
    firedParameters: FiredParameter[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** each parameter maps its measured value to a 0–3 sub-score via
  the Subbe (2001) allocation table; the sub-scores sum to the aggregate 0–14.
  `riskBand` is `high` (≥ 5), `medium` (2–4), or `low` (0–1);
  `singleParameterTrigger` is true when any sub-score equals 3. See spec §4. A
  missing numeric input contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `mews-rules.ts`, `mews-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `mews-grader.test.ts`, `mews-rules.test.ts` — cover every allocation
  band boundary (SBP 70/71, 80/81, 100/101, 199/200; HR 40/41, 50/51, 100/101,
  110/111, 129/130; RR 8/9, 14/15, 20/21, 29/30; temperature 34.9/35.0,
  38.4/38.5; each AVPU level), the aggregate band edges (1/2, 4/5), and the
  single-parameter=3 trigger.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
