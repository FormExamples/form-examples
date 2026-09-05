---
name: dermatology-assessment-skill
description: "Explains what the Dermatology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Dermatology Assessment

Dermatological quality of life evaluation using the DLQI (Dermatology Life Quality Index) with lesion characterization.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `dermatology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: DLQI (Dermatology Life Quality Index)
- **Range**: 0-30
- **Categories**:
  - 0-1: No effect on patient's life
  - 2-5: Small effect on patient's life
  - 6-10: Moderate effect on patient's life
  - 11-20: Very large effect on patient's life
  - 21-30: Extremely large effect on patient's life
- **Engine files**: `types.ts`, `dlqi-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `dlqi-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
