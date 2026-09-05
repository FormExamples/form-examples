---
name: oncology-assessment-skill
description: "Explains what the Oncology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Oncology Assessment

Cancer patient evaluation using ECOG (Eastern Cooperative Oncology Group) Performance Status for treatment planning and prognosis.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `oncology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: ECOG Performance Status
- **Range**: 0-5
- **Categories**: 0 = Fully active, 1 = Restricted, 2 = Ambulatory, 3 = Limited self-care, 4 = Completely disabled, 5 = Dead
- **Engine files**: `types.ts`, `ecog-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `ecog-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
