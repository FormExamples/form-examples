---
name: bhutani-bilirubin-nomogram-skill
description: "Explains what the Bhutani Bilirubin Nomogram form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Bhutani Bilirubin Nomogram

A predictive risk-stratification tool for neonatal hyperbilirubinaemia. It plots a newborn infant's **total serum bilirubin (TSB)** against the infant's **age in hours** on the hour-specific Bhutani nomogram to assign a **percentile risk zone** — **low**, **low-intermediate**, **high-intermediate**, or **high** — that predicts the likelihood of subsequent significant hyperbilirubinaemia. The same TSB and age are compared with the age- and gestation-specific **treatment-threshold graphs** (UK NICE) to indicate whether the infant is at or above the **phototherapy** or **exchange-transfusion** threshold.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `bhutani-bilirubin-nomogram-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
