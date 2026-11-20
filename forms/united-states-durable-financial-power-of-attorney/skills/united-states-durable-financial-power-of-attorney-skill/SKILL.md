---
name: united-states-durable-financial-power-of-attorney-skill
description: "Explains what the United States Durable Financial Power of Attorney form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Durable Financial Power of Attorney

A United States **execution-readiness** checker for a durable power of attorney for property and finances. A principal appoints an agent (and successors) to manage money, real estate, investments, benefits, and taxes, and the authority survives the principal's later incapacity. Law here is **state-variable**: the [Uniform Power of Attorney Act (2006)](doc/upoaa-framework.md) (UPOAA) is the baseline, and a `STATE_RULES` table encodes the execution formalities of California, New York, Texas, Florida, Illinois, Pennsylvania, Ohio, and Washington. Any other state falls back to the uniform default and raises a "verify the state rule" flag.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-durable-financial-power-of-attorney-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
