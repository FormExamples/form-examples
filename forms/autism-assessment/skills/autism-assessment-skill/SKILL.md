---
name: autism-assessment-skill
description: "Explains what the Autism Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Autism Assessment

Autism spectrum screening using the AQ-10 questionnaire with sensory and developmental profiling.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `autism-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: AQ-10 Score (Autism Spectrum Quotient - 10 item)
- **Range**: 0-10 (each of the 10 items scores 0 or 1)
- **Categories**: 0-5 = Below threshold, >=6 = Referral for diagnostic assessment recommended
- **Engine files**: `types.ts`, `aq10-grader.ts`, `aq10-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `aq10-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
