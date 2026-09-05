---
name: integumentary-assessment-skill
description: "Explains what the Integumentary Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Integumentary Assessment

Structured integumentary (skin, hair, nails) clinical assessment combining a head-to-toe skin inspection with the Braden Scale for pressure ulcer risk and wound TIME assessment, to grade pressure-ulcer risk and characterize integumentary findings.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `integumentary-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Braden Scale + Integumentary System Review
- **Range**: Braden 6-23 (lower = higher risk)
- **Categories**:
  - Very High Risk (≤ 9)
  - High Risk (10-12)
  - Moderate Risk (13-14)
  - Mild Risk (15-18)
  - No Risk (19-23)
- **Engine files**: `types.ts`, `integumentary-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `integumentary-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
