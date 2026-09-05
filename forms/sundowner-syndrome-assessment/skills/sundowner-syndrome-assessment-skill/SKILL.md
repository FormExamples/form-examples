---
name: sundowner-syndrome-assessment-skill
description: "Explains what the Sundowner Syndrome Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Sundowner Syndrome Assessment

Sundowner syndrome (sundowning) evaluation using Cohen-Mansfield Agitation Inventory (CMAI) scoring and Neuropsychiatric Inventory (NPI) for behavioural symptoms in elderly patients, particularly those with dementia.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `sundowner-syndrome-assessment-maintainer-skill` instead.

## Scoring system

- **Instruments**: Cohen-Mansfield Agitation Inventory (CMAI) + Neuropsychiatric Inventory (NPI)
- **CMAI Range**: 29-203 (29 items scored 1-7)
- **NPI Range**: 0-144 (12 domains, frequency x severity)
- **Severity Categories**:
  - Mild: Occasional restlessness, redirectable, CMAI 29-45
  - Moderate: Daily episodes, requires intervention, CMAI 46-75
  - Severe: Aggressive behaviour, safety risk, CMAI 76-120
  - Critical: Self-harm risk, requires constant supervision, CMAI >120
- **Engine files**: `types.ts`, `sundowner-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `sundowner-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
