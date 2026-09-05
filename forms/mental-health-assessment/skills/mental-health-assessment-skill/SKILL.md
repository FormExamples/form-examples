---
name: mental-health-assessment-skill
description: "Explains what the Mental Health Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Mental Health Assessment

Combined depression and anxiety screening using PHQ-9 (Patient Health Questionnaire-9) and GAD-7 (Generalized Anxiety Disorder-7) with risk assessment.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `mental-health-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: PHQ-9 + GAD-7
- **Range**: PHQ-9 (0-27), GAD-7 (0-21)
- **Categories**: PHQ-9: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately severe, 20-27 Severe. GAD-7: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe
- **Engine files**: `types.ts`, `mh-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `mh-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
