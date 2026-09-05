---
name: fall-risk-assessment-skill
description: "Explains what the Fall Risk Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Fall Risk Assessment

Fall risk evaluation using the Morse Fall Scale (MFS) with comprehensive environmental, medication, mobility, cognitive, and sensory assessments for fall prevention planning.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `fall-risk-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Morse Fall Scale (MFS)
- **Range**: 0-125
- **Categories**:
  - Low Risk: MFS 0-24
  - Moderate Risk: MFS 25-44
  - High Risk: MFS >= 45
  - Critical: Recurrent falls with injury, anticoagulated patient, or MFS >= 75
- **Engine files**: `types.ts`, `fall-risk-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `fall-risk-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
