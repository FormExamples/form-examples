---
name: systematic-coronary-risk-evaluation-2-diabetes-skill
description: "Explains what the SCORE2-Diabetes form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# SCORE2-Diabetes

SCORE2-Diabetes predicts 10-year risk of fatal and non-fatal cardiovascular disease in individuals with type 2 diabetes without prior CVD, aged 40-69 years. It extends the SCORE2 model with diabetes-specific predictors (HbA1c, eGFR, and age at diagnosis). Reference: <https://www.mdcalc.com/calc/10510/score2-diabetes>.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `systematic-coronary-risk-evaluation-2-diabetes-maintainer-skill` instead.

## Scoring system

- **Instrument**: SCORE2-Diabetes (ESC 2023)
- **Range**: 10-year CVD risk as percentage
- **Age-modified thresholds**: Low / moderate (< 5 %), High (5 - < 10 % / < 7.5 %), Very high (≥ 10 % / ≥ 7.5 %) — depending on age band
- **Engine files**: `types.ts`, `score2-grader.ts`, `score2-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `score2-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
