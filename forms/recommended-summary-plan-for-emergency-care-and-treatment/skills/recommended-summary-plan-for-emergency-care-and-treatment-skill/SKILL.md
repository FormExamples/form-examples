---
name: recommended-summary-plan-for-emergency-care-and-treatment-skill
description: "Explains what the Recommended Summary Plan for Emergency Care and Treatment (ReSPECT) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Recommended Summary Plan for Emergency Care and Treatment (ReSPECT)

A UK personalized **emergency care and treatment plan** created through shared decision-making between a person and one or more clinicians. ReSPECT records a summary of what matters to the person, agreed clinical recommendations for their care in a future emergency in which they may be unable to make or express choices, an explicit **cardiopulmonary resuscitation (CPR) recommendation**, and agreed **ceilings of treatment**. It is a portable record that travels with the person across care settings.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `recommended-summary-plan-for-emergency-care-and-treatment-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
