---
name: quick-sequential-organ-failure-assessment-skill
description: "Explains what the Quick Sequential Organ Failure Assessment (qSOFA) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Quick Sequential Organ Failure Assessment (qSOFA)

A bedside sepsis-risk screen for adults with suspected or confirmed infection. It records three objective clinical criteria — **respiratory rate**, **mentation**, and **systolic blood pressure** — scores each as 0 or 1, sums a total of **0–3**, and flags the patient as **higher risk of a poor outcome** when the score is **≥ 2**. A high score is not a diagnosis of sepsis; it is a prompt to escalate: perform a full Sequential Organ Failure Assessment (SOFA), start a sepsis workup, and obtain senior review.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `quick-sequential-organ-failure-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `QsofaAssessment` TypeScript type — the three criterion
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeQsofa(data: QsofaAssessment): {
    respiratoryRatePoint: 0 | 1;
    mentationPoint: 0 | 1;
    systolicBloodPressurePoint: 0 | 1;
    qsofaScore: 0 | 1 | 2 | 3;
    riskBand: 'lower' | 'higher';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the total 0–3
  determines the risk band (`≥ 2` → `higher`). See spec §4. A missing numeric
  input contributes 0 points and raises a data-completeness flag.
  - respiratory rate ≥ 22 → 1
  - GCS < 15 (or "mentation altered" = yes) → 1
  - systolic BP ≤ 100 → 1
- **Engine files:** `types.ts`, `utils.ts`, `qsofa-rules.ts`, `qsofa-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `qsofa-grader.test.ts`, `qsofa-rules.test.ts` — cover each threshold
  boundary (RR 21/22, GCS 14/15, SBP 100/101) and every total 0–3.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
