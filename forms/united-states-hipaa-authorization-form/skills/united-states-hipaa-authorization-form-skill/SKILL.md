---
name: united-states-hipaa-authorization-form-skill
description: "Explains what the United States HIPAA Authorization Form form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States HIPAA Authorization Form

A United States Health Insurance Portability and Accountability Act (HIPAA) authorization form. This is a legal document by which a patient (or their authorized representative) gives a covered entity — a health-care provider, health plan, or health-care clearinghouse — explicit, time-bounded permission to use or disclose specifically described Protected Health Information (PHI) to a named third-party recipient for a stated purpose. It is the standard mechanism, defined in **45 CFR § 164.508** of the HIPAA Privacy Rule, for any use or disclosure of PHI that is **not** otherwise permitted as treatment, payment, or health-care operations (TPO).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-hipaa-authorization-form-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
