---
name: asthma-assessment-skill
description: "Explains what the Asthma Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Asthma Assessment

Asthma control evaluation using the ACT (Asthma Control Test) scoring instrument.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `asthma-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: ACT Score (Asthma Control Test)
- **Range**: 5-25 (sum of 5 questions, each scored 1-5)
- **Categories**: <=15 = Not well controlled, 16-19 = Not well controlled, 20-25 = Well controlled
- **Engine files**: `types.ts`, `act-grader.ts`, `act-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `act-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
