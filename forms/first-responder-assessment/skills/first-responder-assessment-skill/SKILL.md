---
name: first-responder-assessment-skill
description: "Explains what the First Responder Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# First Responder Assessment

First responder fitness and competency evaluation for paramedics, EMTs, and first aiders. Covers physical fitness, clinical skills, equipment competency, and psychological readiness.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `first-responder-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: First Responder Competency Framework
- **Competency Levels**: Not Competent (1), Developing (2), Competent (3), Expert (4)
- **Overall Fitness Decisions**: Fit for duty, Fit with restrictions, Temporarily unfit, Permanently unfit
- **Engine files**: `types.ts`, `responder-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `responder-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
