---
name: wells-score-for-deep-vein-thrombosis-skill
description: "Explains what the Wells Score for Deep Vein Thrombosis (DVT) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Wells Score for Deep Vein Thrombosis (DVT)

A bedside clinical prediction rule that estimates the pre-test probability of a first lower-limb **deep vein thrombosis (DVT)** in adults with a suspicious leg. It records nine clinical criteria — each scoring **+1** when present — subtracts **2** when an alternative diagnosis is judged at least as likely as DVT, sums a total of **−2 to 9**, and stratifies the patient so the right first investigation is chosen: a **proximal leg vein ultrasound** when DVT is *likely* or a **D-dimer** when DVT is *unlikely*. The score does not diagnose or exclude DVT on its own; it directs the diagnostic pathway.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `wells-score-for-deep-vein-thrombosis-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `WellsDvtAssessment` TypeScript type — the nine criterion
  inputs plus the alternative-diagnosis adjustment, context, and identification
  fields.
- **Output shape:**
  ```ts
  gradeWellsDvt(data: WellsDvtAssessment): {
    criterionPoints: Record<string, 0 | 1 | -2>;
    wellsScore: number;                       // -2..9
    twoLevelBand: 'likely' | 'unlikely';
    threeLevelBand: 'low' | 'moderate' | 'high';
    recommendedInvestigation: 'proximal-leg-vein-ultrasound' | 'd-dimer';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the nine criteria contributes 0 or 1 when
  its value is `yes`; the alternative-diagnosis input subtracts 2. See spec §4.
  - `wellsScore = (sum of +1 for each 'yes' criterion) − (alternativeDiagnosisAsLikely == 'yes' ? 2 : 0)` → range −2..9
  - `twoLevelBand = wellsScore >= 2 ? 'likely' : 'unlikely'`
  - `threeLevelBand = wellsScore >= 3 ? 'high' : wellsScore >= 1 ? 'moderate' : 'low'`
  - `recommendedInvestigation = twoLevelBand == 'likely' ? 'proximal-leg-vein-ultrasound' : 'd-dimer'`
  - A blank criterion contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `wells-dvt-rules.ts`,
  `wells-dvt-grader.ts`, `flagged-issues.ts`.
- **Tests:** `wells-dvt-grader.test.ts`, `wells-dvt-rules.test.ts` — cover the
  two-level boundary (1 vs 2), three-level boundaries (0/1, 2/3), the `−2`
  adjustment including a negative total, and the −2 / 9 extremes.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
