---
name: patient-satisfaction-survey-skill
description: "Explains what the Patient Satisfaction Survey form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Patient Satisfaction Survey

Patient satisfaction survey measuring healthcare experience quality using Likert-scale scoring across multiple care domains with normalized composite scoring.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `patient-satisfaction-survey-maintainer-skill` instead.

## Scoring system

- **Instrument**: Likert-scale satisfaction survey (1-5 per item)
- **Range**: 0-100 (normalized composite score)
- **Categories**:
  - Excellent (85-100): Outstanding patient experience across all domains
  - Good (70-84): Above-average experience with minor improvement areas
  - Satisfactory (50-69): Adequate experience with several improvement areas
  - Poor (25-49): Below-average experience requiring significant improvement
  - Very Poor (0-24): Critically deficient experience requiring urgent action
- **Engine files**: `types.ts`, `grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
