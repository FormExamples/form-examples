---
name: parkland-formula-for-burns-skill
description: "Explains what the Parkland Formula for Burns form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Parkland Formula for Burns

A fluid-resuscitation calculator for adults and children with major thermal burns. It computes the total volume of crystalloid (Hartmann's solution / lactated Ringer's) to give in the first 24 hours from the time of injury using the **Parkland formula**, splits that volume into the mandated **first-8-hour** and **next-16-hour** phases, derives an **infusion rate** for each phase, and offsets the schedule when resuscitation begins some time after the burn. The output is a titratable starting prescription — fluid must then be adjusted to maintain an adequate **urine output**, not driven by the formula alone.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `parkland-formula-for-burns-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
