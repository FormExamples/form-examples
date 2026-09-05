---
name: urology-assessment-skill
description: "Explains what the Urology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Urology Assessment

Urological evaluation using the IPSS (International Prostate Symptom Score) with quality of life assessment, renal function review, and sexual health screening.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `urology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: IPSS (International Prostate Symptom Score)
- **Range**: 0-35
- **Categories**: 0-7 = Mild, 8-19 = Moderate, 20-35 = Severe symptoms
- **Engine files**: `types.ts`, `ipss-grader.ts`, `ipss-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `ipss-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
