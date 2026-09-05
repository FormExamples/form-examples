---
name: contraception-assessment-skill
description: "Explains what the Contraception Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Contraception Assessment

Contraceptive method eligibility screening using UKMEC (UK Medical Eligibility Criteria) categories for 11 contraceptive methods.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `contraception-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: UKMEC (UK Medical Eligibility Criteria)
- **Range**: Categories 1-4
- **Categories**:
  - UKMEC 1: No restriction for use of the contraceptive method
  - UKMEC 2: Advantages of using the method generally outweigh the theoretical or proven risks
  - UKMEC 3: Theoretical or proven risks usually outweigh the advantages of using the method
  - UKMEC 4: Unacceptable health risk if the contraceptive method is used
- **Engine files**: `types.ts`, `ukmec-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `ukmec-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
