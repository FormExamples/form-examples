---
name: workplace-climate-assessment-skill
description: "Explains what the Workplace Climate Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Workplace Climate Assessment

Workplace climate assessment measuring organizational culture, psychological safety, and employee experience using a validated Likert-scale instrument to inform leadership, inclusion, and wellbeing programmes.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `workplace-climate-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Workplace Climate Index (Likert-scale 1-5 per item)
- **Range**: 0-100 (normalized composite score)
- **Categories**:
  - Thriving (85-100): Strong, inclusive, psychologically safe climate
  - Healthy (70-84): Generally positive climate with minor growth areas
  - Developing (50-69): Mixed climate with several improvement areas
  - Strained (25-49): Concerning climate requiring intervention
  - Critical (0-24): Severely unhealthy climate requiring urgent action
- **Engine files**: `types.ts`, `grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
