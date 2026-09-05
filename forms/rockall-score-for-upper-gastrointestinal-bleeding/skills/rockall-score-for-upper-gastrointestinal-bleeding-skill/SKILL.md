---
name: rockall-score-for-upper-gastrointestinal-bleeding-skill
description: "Explains what the Rockall Score for Upper Gastrointestinal Bleeding form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Rockall Score for Upper Gastrointestinal Bleeding

A risk-stratification instrument that estimates the risk of **rebleeding** and **mortality** in adults presenting with acute upper gastrointestinal (GI) bleeding. It has two forms that share the same clinical variables:

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `rockall-score-for-upper-gastrointestinal-bleeding-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `RockallAssessment` TypeScript type — the clinical and
  endoscopic parameter inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeRockall(data: RockallAssessment): {
    agePoints: 0 | 1 | 2;
    shockPoints: 0 | 1 | 2;
    comorbidityPoints: 0 | 2 | 3;
    clinicalRockallScore: number;      // 0..7
    diagnosisPoints: 0 | 1 | 2;
    stigmataPoints: 0 | 2;
    fullRockallScore: number | null;   // 0..11 or null (no endoscopy)
    riskBand: 'low' | 'intermediate' | 'high' | 'clinical-only';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive per parameter (see spec §4).
  - age: `< 60 → 0`, `60–79 → 1`, `≥ 80 → 2`
  - shock: `SBP < 100 → 2`, else `HR ≥ 100 → 1`, else `0`
  - comorbidity: `none → 0`, `major → 2`, `severe → 3`
  - clinical score = age + shock + comorbidity (0–7)
  - diagnosis: `mallory-weiss-or-none → 0`, `all-other → 1`, `upper-gi-malignancy → 2`
  - stigmata: `none-or-dark-spot → 0`, `high-risk → 2`
  - full score (only when `endoscopyPerformed == 'yes'`) = clinical + diagnosis + stigmata (0–11)
  - band from full score (`≤ 2 low`, `3–4 intermediate`, `≥ 5 high`), else `clinical-only` (clinical 0 → `low`)
- **Engine files:** `types.ts`, `utils.ts`, `rockall-rules.ts`,
  `rockall-grader.ts`, `flagged-issues.ts`.
- **Tests:** `rockall-grader.test.ts`, `rockall-rules.test.ts` — cover each
  threshold boundary (age 59/60/79/80, HR 99/100, SBP 99/100), every enum value,
  and the clinical-only vs full path.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
