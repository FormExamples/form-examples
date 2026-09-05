---
name: nutrition-assessment-skill
description: "Explains what the Nutrition Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Nutrition Assessment

Nutritional status evaluation using the Malnutrition Universal Screening Tool (MUST) with comprehensive dietary, swallowing, gastrointestinal, and nutritional support assessment.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `nutrition-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Malnutrition Universal Screening Tool (MUST)
- **MUST Steps**:
  - Step 1: BMI score (0 = BMI >20, 1 = BMI 18.5-20, 2 = BMI <18.5)
  - Step 2: Unplanned weight loss score (0 = <5%, 1 = 5-10%, 2 = >10%)
  - Step 3: Acute disease effect score (0 = none, 2 = acutely ill with no intake >5 days)
- **Total score**: 0 = low risk, 1 = medium risk, >=2 = high risk
- **Severity levels**: low (well-nourished), moderate (at risk), high (malnourished), critical (severe malnutrition with complications)
- **Engine files**: `types.ts`, `nutrition-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `nutrition-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
