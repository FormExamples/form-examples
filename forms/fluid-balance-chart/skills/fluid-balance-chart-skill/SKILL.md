---
name: fluid-balance-chart-skill
description: "Explains what the Fluid Balance Chart form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Fluid Balance Chart

A bedside record of a patient's fluid **intake** and **output** over a charting period (typically 24 hours), used to monitor hydration, renal function, and the response to fluid therapy. The chart captures each timed volume — oral drinks, intravenous (IV) fluids, enteral (tube) feeds, blood and blood products on the intake side; urine, drain losses, vomit or nasogastric (NG) aspirate, stool, and insensible or other losses on the output side — and computes a **running** and **cumulative net balance** (intake minus output).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `fluid-balance-chart-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
