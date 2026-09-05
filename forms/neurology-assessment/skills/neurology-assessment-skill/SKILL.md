---
name: neurology-assessment-skill
description: "Explains what the Neurology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Neurology Assessment

Neurological evaluation using the NIHSS (National Institutes of Health Stroke Scale) with headache, seizure, motor, sensory, and cognitive assessment.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `neurology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: NIHSS (National Institutes of Health Stroke Scale)
- **Range**: 0-42
- **Categories**: 0 = No stroke symptoms, 1-4 = Minor, 5-15 = Moderate, 16-20 = Moderate to severe, 21-42 = Severe
- **Engine files**: `types.ts`, `nihss-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `nihss-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
