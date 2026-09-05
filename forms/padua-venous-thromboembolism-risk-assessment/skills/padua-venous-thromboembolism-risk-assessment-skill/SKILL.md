---
name: padua-venous-thromboembolism-risk-assessment-skill
description: "Explains what the Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Padua Venous Thromboembolism Risk Assessment (Padua Prediction Score)

A bedside risk-stratification tool that estimates the risk of venous thromboembolism (VTE — deep-vein thrombosis and pulmonary embolism) in hospitalized **medical** patients. It records **eleven weighted risk factors**, sums a total of **0–20**, and classifies the patient as **high risk** when the score is **≥ 4** and **low risk** when the score is **< 4**. A high score is a prompt to consider **pharmacological thromboprophylaxis** (in the absence of contraindications such as active bleeding or high bleeding risk); a low score supports withholding routine anticoagulant prophylaxis and using mechanical measures and early mobilization.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `padua-venous-thromboembolism-risk-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `PaduaAssessment` TypeScript type — the eleven risk-factor
  inputs plus the bleeding-risk fields and context and identification fields.
- **Output shape:**
  ```ts
  gradePadua(data: PaduaAssessment): {
    factorPoints: Record<string, number>; // per-factor contribution
    paduaScore: number;                   // 0..20
    riskBand: 'low' | 'high';
    firedFactors: FiredFactor[];
    flaggedIssues: FlaggedIssue[];
    prophylaxisRecommendation: 'pharmacological' | 'mechanical' | 'none';
  }
  ```
- **Algorithm:** additive weighted — each factor contributes its weight when
  present; the total 0–20 determines the risk band (`≥ 4` → `high`). See spec
  §4. A missing numeric input (`ageYears`, `bodyMassIndex`) contributes 0 points
  and raises a data-completeness flag.
  - active cancer (3), previous VTE (3), reduced mobility ≥ 3 days (3), known
    thrombophilia (3)
  - recent trauma/surgery ≤ 1 month (2)
  - age ≥ 70 (1), heart/respiratory failure (1), acute MI or ischaemic stroke
    (1), acute infection/rheumatological (1), obesity BMI ≥ 30 (1), ongoing
    hormonal treatment (1)
- **Engine files:** `types.ts`, `utils.ts`, `padua-rules.ts`,
  `padua-grader.ts`, `flagged-issues.ts`.
- **Tests:** `padua-grader.test.ts`, `padua-rules.test.ts` — cover each factor's
  contribution, the age 69/70 and BMI 29/30 boundaries, the score 3/4 band
  boundary, and the bleeding-risk gating of the recommendation.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
