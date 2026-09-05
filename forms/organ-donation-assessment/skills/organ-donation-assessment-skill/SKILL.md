---
name: organ-donation-assessment-skill
description: "Explains what the Organ Donation Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Organ Donation Assessment

Organ donation assessment evaluates potential organ donors (living and deceased). Assesses medical suitability, organ function, immunological compatibility, and ethical/consent requirements. Uses donor risk index and organ-specific suitability scoring.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `organ-donation-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Donor Risk Index + Organ-Specific Suitability Scoring
- **Eligibility categories**:
  - Suitable: ideal donor, meets all criteria
  - Conditionally suitable: expanded criteria donor, acceptable with additional evaluation
  - Unsuitable: absolute contraindications present
- **Risk levels**:
  - Low: ideal donor profile
  - Moderate: expanded criteria donor
  - High: marginal organ function
  - Critical: contraindicated
- **Engine files**: `types.ts`, `donation-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `donation-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
