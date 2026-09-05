---
name: predicting-risk-of-cardiovascular-disease-events-skill
description: "Explains what the Predicting Risk of Cardiovascular Disease Events (PREVENT) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Predicting Risk of Cardiovascular Disease Events (PREVENT)

AHA PREVENT risk calculator predicting 10- and 30-year risk of total cardiovascular disease (and its subtypes atherosclerotic CVD and heart failure) in patients aged 30-79 without known CVD. Incorporates kidney function and optional metabolic factors as predictors.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `predicting-risk-of-cardiovascular-disease-events-maintainer-skill` instead.

## Scoring system

- **Instrument**: AHA PREVENT equations (2023)
- **Range**: 10-year and 30-year risk as percentages (0.0-100.0%)
- **Predicted outcomes**: total CVD, atherosclerotic CVD (ASCVD), heart failure (HF)
- **Categories** (10-year total CVD): Low (< 5 %), Borderline (5 - < 7.5 %), Intermediate (7.5 - < 20 %), High (≥ 20 %)
- **Engine files**: `types.ts`, `prevent-grader.ts`, `prevent-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `prevent-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
