---
name: caprini-venous-thromboembolism-risk-assessment-skill
description: "Explains what the Caprini Venous Thromboembolism Risk Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Caprini Venous Thromboembolism Risk Assessment

A structured venous thromboembolism (VTE) risk-stratification tool for surgical and medical inpatients. It records a checklist of **weighted individual risk factors** — each worth **1, 2, 3, or 5 points** — sums them into a total **Caprini score**, maps the total to a **risk band** (very low, low, moderate, high), and recommends a **prophylaxis strategy** (early ambulation, mechanical, or pharmacological). A high score is a prompt to prescribe thromboprophylaxis after a bleeding-risk check; it is not a substitute for clinical judgement.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `caprini-venous-thromboembolism-risk-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `CapriniAssessment` TypeScript type — the age band, the
  yes/no risk-factor inputs (1-, 2-, 3-, and 5-point groups), the bleeding-risk
  input, plus context and identification fields.
- **Output shape:**
  ```ts
  gradeCaprini(data: CapriniAssessment): {
    factorPoints: FactorPoints[];   // each fired factor with its weight
    capriniScore: number;           // 0..40+
    riskBand: 'very-low' | 'low' | 'moderate' | 'high';
    recommendedProphylaxis:
      'early-ambulation' | 'mechanical'
      | 'pharmacological-or-mechanical' | 'pharmacological-plus-mechanical';
    firedFactors: FiredFactor[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the age-band weight plus the fixed weight of
  every fired factor; the total maps to the risk band (0–1 → very-low, 2 → low,
  3–4 → moderate, ≥ 5 → high) and prophylaxis recommendation. See spec §4. A
  high bleeding risk downgrades any pharmacological recommendation to mechanical
  and raises a contraindication flag. A missing input contributes 0 points and
  raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `caprini-rules.ts`,
  `caprini-grader.ts`, `flagged-issues.ts`.
- **Tests:** `caprini-grader.test.ts`, `caprini-rules.test.ts` — cover each band
  boundary (score 1/2, 2/3, 4/5), the age-band weights, the bleeding-risk
  downgrade, and a representative fired-factor mix.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
