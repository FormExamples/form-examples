---
name: qrisk3-cardiovascular-disease-risk-score-skill
description: "Explains what the QRISK3 Cardiovascular Disease Risk Score form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# QRISK3 Cardiovascular Disease Risk Score

A primary-prevention risk calculator that estimates an adult's **10-year risk of a first cardiovascular disease (CVD) event** — coronary heart disease, stroke, or transient ischaemic attack — from routinely available clinical data. It records demographic, lifestyle, comorbidity, and measurement inputs on a single continuous single-page wizard, applies the published **QRISK3 Cox proportional-hazards model**, and returns a **10-year CVD risk percentage**, a risk band, and a **heart age**. A result of **≥ 10 %** meets the NICE threshold at which a lipid-lowering statin (atorvastatin 20 mg) should be offered alongside lifestyle advice.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `qrisk3-cardiovascular-disease-risk-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `Qrisk3Assessment` TypeScript type — the model inputs
  (demographics, lifestyle, cardiometabolic, history, medication) plus context,
  identification, and eligibility fields.
- **Output shape:**
  ```ts
  gradeQrisk3(data: Qrisk3Assessment): {
    linearPredictor: number;
    tenYearRiskPercent: number;   // 0.0..99.9, one decimal
    riskBand: 'low' | 'raised' | 'high';
    heartAge: number | null;      // years; null when not computable
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted risk engine (**not** an additive point sum). Select the
  female or male coefficient set by `sex`; centre and fractional-polynomial
  transform the continuous inputs; multiply each transformed value by its fitted
  Cox coefficient and add age-interaction terms to form the linear predictor
  `LP`; then `tenYearRiskPercent = 100 × (1 − S0^exp(LP))` using the model's
  10-year baseline survival `S0`. Band at `>= 10` (`raised`) and `>= 20`
  (`high`). Heart age inverts the risk function with modifiable factors optimal.
  See spec §4. Optional `townsendScore` defaults to the cohort mean; a missing
  required input blocks a valid result and raises a completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `qrisk3-rules.ts` (coefficient tables
  and transforms), `qrisk3-grader.ts` (linear predictor → risk % + heart age),
  `flagged-issues.ts`.
- **Tests:** `qrisk3-grader.test.ts`, `qrisk3-rules.test.ts` — cover the 10 % and
  20 % band boundaries, the male/female model split, the optional Townsend
  default, and the eligibility guards (age 24/25/84/85, established CVD, FH).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
