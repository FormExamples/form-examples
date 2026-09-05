---
name: cardiology-assessment-skill
description: "Explains what the Cardiology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Cardiology Assessment

Cardiovascular evaluation using CCS Angina Classification and NYHA Heart Failure Classification with comprehensive cardiac risk profiling.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `cardiology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: CCS Angina Classification + NYHA Heart Failure Classification
- **Range**: CCS Angina Class I-IV, NYHA Heart Failure Class I-IV
- **Categories**:
  - CCS I: Angina only with strenuous exertion
  - CCS II: Slight limitation of ordinary activity
  - CCS III: Marked limitation of ordinary activity
  - CCS IV: Angina at rest or with any physical activity
  - NYHA I: No limitation of physical activity
  - NYHA II: Slight limitation; comfortable at rest
  - NYHA III: Marked limitation; comfortable only at rest
  - NYHA IV: Unable to carry on any physical activity without discomfort
- **Engine files**: `types.ts`, `cardio-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `cardio-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
