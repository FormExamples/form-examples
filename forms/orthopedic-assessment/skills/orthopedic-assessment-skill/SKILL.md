---
name: orthopedic-assessment-skill
description: "Explains what the Orthopaedic Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Orthopaedic Assessment

Musculoskeletal evaluation using the DASH (Disabilities of the Arm, Shoulder and Hand) questionnaire with range of motion and functional assessment.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `orthopedic-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: DASH Score
- **Range**: 0-100
- **Categories**: 0 = No disability, 100 = Most severe disability
- **Engine files**: `types.ts`, `dash-grader.ts`, `dash-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `dash-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
