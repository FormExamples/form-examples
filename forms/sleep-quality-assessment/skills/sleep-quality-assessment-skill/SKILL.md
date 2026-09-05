---
name: sleep-quality-assessment-skill
description: "Explains what the Sleep Quality Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Sleep Quality Assessment

Sleep quality evaluation using the PSQI (Pittsburgh Sleep Quality Index) covering sleep habits, latency, duration, efficiency, disturbances, and daytime dysfunction.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `sleep-quality-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: PSQI (Pittsburgh Sleep Quality Index)
- **Range**: 0-21
- **Categories**: 0-5 = Good sleep quality, 6-10 = Poor sleep quality, 11-21 = Very poor sleep quality
- **Engine files**: `types.ts`, `psqi-grader.ts`, `psqi-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `psqi-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
