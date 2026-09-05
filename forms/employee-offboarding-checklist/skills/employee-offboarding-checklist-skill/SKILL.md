---
name: employee-offboarding-checklist-skill
description: "Explains what the Employee Offboarding Checklist form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Employee Offboarding Checklist

Structured offboarding checklist ensuring every departing employee completes the administrative, operational, and knowledge-transfer steps required to protect patient safety, organizational data, and service continuity.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `employee-offboarding-checklist-maintainer-skill` instead.

## Scoring system

- **Instrument**: Offboarding Completeness Validation
- **Range**: Complete / Partial / Incomplete
- **Categories**:
  - Complete: All mandatory items confirmed
  - Partial: Non-blocking items outstanding
  - Incomplete: Mandatory items outstanding; requires escalation
- **Engine files**: `types.ts`, `checklist-validator.ts`, `validation-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `checklist-validator.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
