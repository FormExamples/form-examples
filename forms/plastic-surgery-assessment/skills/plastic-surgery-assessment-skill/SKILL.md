---
name: plastic-surgery-assessment-skill
description: "Explains what the Plastic Surgery Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Plastic Surgery Assessment

Plastic surgery assessment evaluating reconstructive and aesthetic surgery candidates using ASA Physical Status Classification (I-V), wound classification, and surgical complexity scoring.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `plastic-surgery-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: ASA Physical Status Classification + Wound Classification + Surgical Complexity Scoring
- **Range**: ASA I-V, Wound Class I-IV, Complexity 1-4
- **Categories**:
  - ASA I: Normal healthy patient
  - ASA II: Patient with mild systemic disease
  - ASA III: Patient with severe systemic disease
  - ASA IV: Patient with severe systemic disease that is a constant threat to life
  - ASA V: Moribund patient not expected to survive without the operation
- **Engine files**: `types.ts`, `plastics-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `plastics-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
