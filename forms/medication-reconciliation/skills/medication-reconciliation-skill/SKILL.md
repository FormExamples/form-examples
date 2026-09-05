---
name: medication-reconciliation-skill
description: "Explains what the Medication Reconciliation form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medication Reconciliation

A structured medicines-safety document that reconciles a patient's medicines at a transition of care — **admission**, **internal transfer**, or **discharge**. It captures the **best-possible medication history (BPMH)** compiled from two or more independent information sources, records the **current inpatient medication list**, and reconciles the two — identifying every **discrepancy** (omission, duplication, dose / frequency / route change, drug interaction, high-risk medicine) and documenting the **intended action** (continue / hold / stop / change / start) with a clinical **rationale** for each line item.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medication-reconciliation-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
