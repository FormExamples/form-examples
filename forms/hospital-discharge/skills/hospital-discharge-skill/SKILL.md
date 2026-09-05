---
name: hospital-discharge-skill
description: "Explains what the Hospital Discharge form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Hospital Discharge

Hospital discharge summary form aligned with UK NICE NG27 and the SAFER patient-flow bundle, capturing diagnoses, procedures, medication reconciliation, follow-up arrangements, and community handover details to support safe transfer of care.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `hospital-discharge-maintainer-skill` instead.

## Scoring system

- **Instrument**: Discharge Summary Completeness Validation (NICE NG27)
- **Range**: Complete / Partial / Incomplete
- **Categories**:
  - Complete: All mandatory NICE NG27 fields supplied
  - Partial: Non-mandatory fields outstanding
  - Incomplete: Mandatory fields missing
- **Engine files**: `types.ts`, `discharge-validator.ts`, `validation-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `discharge-validator.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
