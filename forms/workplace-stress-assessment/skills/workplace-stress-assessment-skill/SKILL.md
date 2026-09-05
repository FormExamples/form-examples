---
name: workplace-stress-assessment-skill
description: "Explains what the Workplace Stress Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Workplace Stress Assessment

Workplace stress assessment using the UK HSE Management Standards Indicator Tool to measure perceived stress across seven organizational domains and identify teams or individuals at elevated risk of work-related ill health.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `workplace-stress-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: HSE Management Standards Indicator Tool (35 items, 1-5 Likert)
- **Range**: 7 domain scores + overall risk category (Low / Moderate / High / Very High)
- **Domains**: Demands, Control, Manager Support, Peer Support, Relationships, Role, Change
- **Categories**: Benchmarked against HSE percentile thresholds (20th, 50th, 80th)
- **Engine files**: `types.ts`, `stress-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `stress-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
