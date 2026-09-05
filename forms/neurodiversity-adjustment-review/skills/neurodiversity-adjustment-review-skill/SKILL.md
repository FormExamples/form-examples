---
name: neurodiversity-adjustment-review-skill
description: "Explains what the Neurodiversity Adjustment Review form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Neurodiversity Adjustment Review

A UK–aligned **workplace reasonable-adjustments review for neurodiversity** that a manager or HR contact completes with the worker to check whether the agreed adjustments are still working. It is the **third form in the ACAS cycle** — after the [`neurodiversity-adjustment-request`](../neurodiversity-adjustment-request) (what the worker needs) and the [`neurodiversity-adjustment-response`](../neurodiversity-adjustment-response) (what the employer agreed), this form records *how the agreed adjustments are working in practice and what should change*. It captures the per-category effectiveness of the adjustments in place, the worker's feedback and outcomes, any changes arising, and the next review date — then computes a **four-axis grade** (overall effectiveness, wellbeing risk, review completeness, and next-step urgency) plus a set of review flags including an automatic **adjustments-not-working alert**. The output is a structured review record.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `neurodiversity-adjustment-review-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
