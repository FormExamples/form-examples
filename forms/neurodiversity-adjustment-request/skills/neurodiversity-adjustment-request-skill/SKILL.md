---
name: neurodiversity-adjustment-request-skill
description: "Explains what the Neurodiversity Adjustment Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Neurodiversity Adjustment Request

A UK–aligned **workplace reasonable-adjustments request for neurodiversity** that a worker (or a manager on their behalf) completes to ask their employer for adjustments at work. It records the worker's neurodivergent profile (conditions, diagnosis status, whether they consider it a disability, and consent to share details), the functional difficulties they experience mapped to the ACAS functional areas, the specific adjustments requested across the ACAS adjustment categories, any supporting evidence, and the current impact and urgency — then computes a **four-axis grade** (Equality Act 2010 eligibility, impact / wellbeing risk, request completeness, and handling priority) plus a set of compliance-and-wellbeing flags. The output is a structured request that supports the employer's duty to consider and make reasonable adjustments without unreasonable delay.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `neurodiversity-adjustment-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
