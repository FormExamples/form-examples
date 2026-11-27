---
name: medical-renal-living-donor-request-skill
description: "Explains what the Medical Renal Living Donor Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Renal Living Donor Request

A generic **histocompatibility request for a living kidney donor**, completed by a transplant clinician. It asks a transplant immunology laboratory for donor crossmatching (full or virtual), match grading, altruistic-donor work-up, day-of-transplant samples, ABO titres or red-cell antibody follow-up, and records donor and recipient identifiers, relationship, transplant centre and ABO groups. It is the donor-side companion of [medical-renal-transplant-recipient-request](../medical-renal-transplant-recipient-request/).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-renal-living-donor-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
