---
name: seasonal-affective-disorder-assessment-skill
description: "Explains what the Seasonal Affective Disorder Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Seasonal Affective Disorder Assessment

Seasonal mood disorder evaluation using SPAQ Global Seasonality Score (GSS) and PHQ-9 depression severity screening with combined severity classification.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `seasonal-affective-disorder-assessment-maintainer-skill` instead.

## Scoring system

- **Instruments**: SPAQ Global Seasonality Score (GSS) + PHQ-9 Depression Severity
- **SPAQ GSS Range**: 0-24 (6 items, each 0-4)
  - 0-7: No SAD
  - 8-10: Subsyndromal SAD
  - 11-24: SAD likely
- **PHQ-9 Range**: 0-27 (9 items, each 0-3)
  - 0-4: Minimal depression
  - 5-9: Mild depression
  - 10-14: Moderate depression
  - 15-19: Moderately severe depression
  - 20-27: Severe depression
- **Combined Severity**: no-sad, mild, moderate, severe, critical
- **Engine files**: `types.ts`, `sad-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `sad-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
