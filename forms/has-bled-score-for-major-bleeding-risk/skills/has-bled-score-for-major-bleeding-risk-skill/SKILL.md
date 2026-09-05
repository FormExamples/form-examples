---
name: has-bled-score-for-major-bleeding-risk-skill
description: "Explains what the HAS-BLED Score for Major Bleeding Risk form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# HAS-BLED Score for Major Bleeding Risk

A bedside bleeding-risk score for adults with atrial fibrillation (AF) who are receiving, or being considered for, oral anticoagulation. It records nine clinical criteria — **H**ypertension, **A**bnormal renal and liver function, **S**troke, **B**leeding history or predisposition, **L**abile INR, **E**lderly, and **D**rugs or alcohol — scores each present criterion, sums a total of **0–9**, and flags the patient as being at **higher risk of major bleeding** when the score is **≥ 3**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `has-bled-score-for-major-bleeding-risk-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `HasBledAssessment` TypeScript type — the nine criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeHasBled(data: HasBledAssessment): {
    hypertensionPoint: 0 | 1;
    renalPoint: 0 | 1;
    liverPoint: 0 | 1;
    strokePoint: 0 | 1;
    bleedingPoint: 0 | 1;
    labileInrPoint: 0 | 1;
    elderlyPoint: 0 | 1;
    drugsPoint: 0 | 1;
    alcoholPoint: 0 | 1;
    hasBledScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    riskBand: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the total 0–9
  determines the risk band (`0` → `low`, `1–2` → `moderate`, `≥ 3` → `high`). See
  spec §4. Elderly and alcohol points derive from numeric inputs; a missing
  numeric input contributes 0 and raises a data-completeness flag.
  - hypertension uncontrolled (SBP > 160) → 1
  - abnormal renal function → 1
  - abnormal liver function → 1
  - stroke history → 1
  - bleeding history / predisposition → 1
  - labile INR (TTR < 60%) → 1
  - age > 65 → 1
  - antiplatelets / NSAIDs → 1
  - alcohol ≥ 8 units/week → 1
- **Engine files:** `types.ts`, `utils.ts`, `hasbled-rules.ts`,
  `hasbled-grader.ts`, `flagged-issues.ts`.
- **Tests:** `hasbled-grader.test.ts`, `hasbled-rules.test.ts` — cover the age
  boundary (65/66), the alcohol boundary (7/8 units), the risk-band boundaries
  (0, 2/3), and the minimum and maximum totals (0 and 9).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
