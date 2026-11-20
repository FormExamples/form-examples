---
name: united-kingdom-birth-registration-skill
description: "Explains what the United Kingdom Birth Registration form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United Kingdom Birth Registration

Prepare to register a birth in England and Wales (GOV.UK "Register a birth") and order the birth certificate from the General Register Office (GRO). The form is a single continuous single-page wizard that collects the child, the mother, the second parent and the basis for recording them, the informant and identity evidence, and the certificate order. Its engine is a **completeness and validity** engine, not a clinical score: it classifies the application as **ready to submit**, **incomplete**, **needs additional evidence**, or **out of scope**, and raises flagged issues for the statutory deadline, the informant, the unmarried-father rules, and the required evidence.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-kingdom-birth-registration-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
