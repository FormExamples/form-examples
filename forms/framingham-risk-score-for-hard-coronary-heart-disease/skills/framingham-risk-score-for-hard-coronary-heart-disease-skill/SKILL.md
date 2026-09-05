---
name: framingham-risk-score-for-hard-coronary-heart-disease-skill
description: "Explains what the Framingham Risk Score for Hard Coronary Heart Disease form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Framingham Risk Score for Hard Coronary Heart Disease

Estimates 10-year risk of heart attack (myocardial infarction or coronary death) in patients aged 30-79 years with no history of CHD or diabetes, using the Wilson/D'Agostino 1998 Cox regression model.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `framingham-risk-score-for-hard-coronary-heart-disease-maintainer-skill` instead.

## Scoring system

- **Instrument**: Framingham Hard CHD Risk Score (Wilson 1998 / ATP III)
- **Range**: 10-year risk as percentage (< 1 % - 30 %+)
- **Categories**:
  - Low: < 10 %
  - Moderate: 10 - < 20 %
  - High: ≥ 20 %
- **Engine files**: `types.ts`, `framingham-grader.ts`, `framingham-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `framingham-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
