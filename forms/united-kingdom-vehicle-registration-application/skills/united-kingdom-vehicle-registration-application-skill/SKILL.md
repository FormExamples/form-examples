---
name: united-kingdom-vehicle-registration-application-skill
description: "Explains what the United Kingdom Vehicle Registration Application form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United Kingdom Vehicle Registration Application

Registering a vehicle with the Driver and Vehicle Licensing Agency (DVLA) in Great Britain: the **V62** application for a vehicle registration certificate (V5C, the log book), and the first-registration variants **V55/4** (new vehicle), **V55/5** (used vehicle), imported vehicles, and **V627/1** (rebuilt or kit vehicles). The applicant records who is applying, who the registered keeper and owner are, the vehicle's identity, the evidence enclosed, and the fee, and the form checks the application before it is posted.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-kingdom-vehicle-registration-application-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
