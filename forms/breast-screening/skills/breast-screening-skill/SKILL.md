---
name: breast-screening-skill
description: "Explains what the Breast Screening Record (NHS Breast Screening Programme) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Breast Screening Record (NHS Breast Screening Programme)

A documentation and result-classification record for a mammography breast screening encounter within the **NHS Breast Screening Programme (NHSBSP)**. It captures the screening episode end to end — **eligibility**, **consent**, the **mammogram views** taken, the **radiological reporting outcome** of film reading, and, where the woman is recalled, the **assessment result** expressed with a breast imaging classification. From these inputs the engine classifies the **screening outcome and next action**, validates completeness, and raises safety flags.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `breast-screening-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
