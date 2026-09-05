---
name: first-aid-training-checklist-skill
description: "Explains what the First Aid Training Checklist form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# First Aid Training Checklist

First Aid at Work (FAW) competency assessment aligned with UK HSE guidance and the St John Ambulance syllabus, covering scene assessment, primary survey, life-threatening emergencies, and injury management with a pass / fail / needs-development outcome.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `first-aid-training-checklist-maintainer-skill` instead.

## Scoring system

- **Instrument**: First Aid at Work Competency Assessment
- **Range**: Pass / Fail / Needs Development
- **Categories**:
  - Pass: All skills demonstrated to competent standard
  - Needs Development: Minor deficiencies; targeted retraining
  - Fail: Critical deficiency in life-saving skills
- **Engine files**: `types.ts`, `first-aid-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `first-aid-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
