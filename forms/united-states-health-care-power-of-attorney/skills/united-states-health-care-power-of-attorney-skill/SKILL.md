---
name: united-states-health-care-power-of-attorney-skill
description: "Explains what the United States Health Care Power of Attorney form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Health Care Power of Attorney

A durable power of attorney for health care: the document in which an adult (the principal) names an agent, and successor agents, to make health care decisions if the principal cannot. States call it a health care proxy (New York), a medical power of attorney (Texas), a designation of health care surrogate (Florida), or an advance health care directive (California). The same form can carry the principal's wishes about life-sustaining treatment, a HIPAA release, and a direction about organ donation.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-health-care-power-of-attorney-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
