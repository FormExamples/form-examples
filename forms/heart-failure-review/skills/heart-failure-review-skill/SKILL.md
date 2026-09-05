---
name: heart-failure-review-skill
description: "Explains what the Heart Failure Annual Review form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Heart Failure Annual Review

A UK primary-care structured **annual review** for adults with an established diagnosis of chronic heart failure. It records the objective and self-reported findings needed to confirm functional status, review fluid balance, verify monitoring bloods, and check that guideline-directed medical therapy has been optimized. The engine derives an **NYHA functional status**, a **medication- optimization status** against the "four pillars" of heart-failure therapy, grades the **completeness** of the review, and raises safety flags (urgent review, optimization gaps, deranged renal function or potassium, fluid overload, missing monitoring bloods).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `heart-failure-review-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
