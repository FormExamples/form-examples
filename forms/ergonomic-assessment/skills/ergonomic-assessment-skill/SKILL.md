---
name: ergonomic-assessment-skill
description: "Explains what the Ergonomic Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Ergonomic Assessment

Workplace ergonomic evaluation using the REBA (Rapid Entire Body Assessment) for musculoskeletal risk.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `ergonomic-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: REBA (Rapid Entire Body Assessment)
- **Range**: 1-15
- **Categories**:
  - 1: Negligible risk, no action required
  - 2-3: Low risk, change may be needed
  - 4-7: Medium risk, further investigation and change soon
  - 8-10: High risk, investigate and implement change
  - 11-15: Very high risk, implement change immediately
- **Engine files**: `types.ts`, `reba-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `reba-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
