---
name: employee-onboarding-checklist-skill
description: "Explains what the Employee Onboarding Checklist form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Employee Onboarding Checklist

Employee onboarding checklist for healthcare staff. Tracks completion of mandatory requirements: occupational health clearance, DBS checks, professional registration, mandatory training, IT access, uniform/ID. Completion scoring: 0-100%. Risk flags for overdue items.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `employee-onboarding-checklist-maintainer-skill` instead.

## Scoring system

- **Instrument**: Completion Percentage
- **Range**: 0-100%
- **Categories**:
  - Not started: 0%
  - In progress: 1-49%
  - Mostly complete: 50-89%
  - Complete: 90-100%
- **Risk flags**: Overdue items flagged by priority
- **Engine files**: `types.ts`, `onboarding-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `onboarding-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
