---
name: united-states-vehicle-title-and-registration-application-skill
description: "Explains what the United States Vehicle Title and Registration Application form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Vehicle Title and Registration Application

An application for a **certificate of title and registration** with a United States state motor vehicle agency. The applicant records the state and transaction, the owner and co-owner identification, the vehicle and its VIN, the federal **odometer disclosure**, the title history and any **title brand** (salvage, junk, rebuilt, flood, and so on), any **lien**, proof of insurance, inspections, and the **sales or use tax** and fees. The engine checks the application for completeness and consistency against federal rules and the rules of the chosen state, before it reaches a clerk.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-vehicle-title-and-registration-application-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
