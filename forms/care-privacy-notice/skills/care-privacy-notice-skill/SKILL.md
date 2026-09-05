---
name: care-privacy-notice-skill
description: "Explains what the Care Privacy Notice form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Care Privacy Notice

Read-and-acknowledge privacy notice form based on the BMA GDPR template for GP practices.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `care-privacy-notice-maintainer-skill` instead.

## Scoring system

- **Instrument**: Completeness Validation
- **Range**: Complete / Incomplete
- **Categories**:
  - Complete: All acknowledgment fields filled
  - Incomplete: One or more missing
- **Engine files**: `types.ts`, `form-validator.ts`, `validation-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `form-validator.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
