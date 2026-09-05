---
name: wells-score-for-pulmonary-embolism-skill
description: "Explains what the Wells Score for Pulmonary Embolism form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Wells Score for Pulmonary Embolism

A clinical prediction rule that estimates the pre-test probability of acute pulmonary embolism (PE) in adults presenting with suspected PE. It records seven weighted criteria, sums a total of **0–12.5**, and stratifies the patient into a probability band that selects the next diagnostic step — a **D-dimer** test when PE is unlikely, or a **CT pulmonary angiogram (CTPA)** when PE is likely.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `wells-score-for-pulmonary-embolism-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `WellsPeAssessment` TypeScript type — the seven criterion
  inputs plus context, identification, and haemodynamic-status fields.
- **Output shape:**
  ```ts
  gradeWellsPe(data: WellsPeAssessment): {
    dvtSignsPoints: 0 | 3;
    peMostLikelyPoints: 0 | 3;
    heartRatePoints: 0 | 1.5;
    immobilisationSurgeryPoints: 0 | 1.5;
    previousDvtPePoints: 0 | 1.5;
    haemoptysisPoints: 0 | 1;
    malignancyPoints: 0 | 1;
    wellsScore: number;            // 0 .. 12.5
    twoLevelBand: 'unlikely' | 'likely';
    threeLevelBand: 'low' | 'moderate' | 'high';
    recommendedPathway: 'd-dimer' | 'ctpa';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive weighted — each present criterion contributes its
  points; the total 0–12.5 determines the bands. See spec §4.
  - `dvtSigns == 'yes'` → 3
  - `peMostLikely == 'yes'` → 3
  - `heartRate > 100` → 1.5
  - `immobilisationSurgery == 'yes'` → 1.5
  - `previousDvtPe == 'yes'` → 1.5
  - `haemoptysis == 'yes'` → 1
  - `malignancy == 'yes'` → 1
  - `twoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely'`
  - `recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'`
  - `threeLevelBand = wellsScore < 2 ? 'low' : wellsScore <= 6 ? 'moderate' : 'high'`
  - A missing numeric heart rate contributes 0 points and raises a
    data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `wells-pe-rules.ts`,
  `wells-pe-grader.ts`, `flagged-issues.ts`.
- **Tests:** `wells-pe-grader.test.ts`, `wells-pe-rules.test.ts` — cover each
  threshold boundary (heart rate 100/101, two-level 4/4.5, three-level 1.5/2 and
  6/6.5) and the 0 and 12.5 extremes.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
