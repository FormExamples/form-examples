---
name: hormone-replacement-therapy-assessment-skill
description: "Explains what the Hormone Replacement Therapy Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Hormone Replacement Therapy Assessment

HRT eligibility and symptom assessment using the MRS (Menopause Rating Scale) covering vasomotor, bone, cardiovascular, and breast health.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `hormone-replacement-therapy-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: MRS (Menopause Rating Scale)
- **Range**: Composite score across somatic, psychological, and urogenital subscales
- **Categories**: Based on subscale and total severity ratings
- **Engine files**: `types.ts`, `mrs-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `mrs-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
