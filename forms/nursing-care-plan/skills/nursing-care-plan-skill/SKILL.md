---
name: nursing-care-plan-skill
description: "Explains what the Nursing Care Plan form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Nursing Care Plan

A structured nursing care plan that documents patient care following the **nursing process** — Assessment, Diagnosis, Planning, Implementation, Evaluation (**ADPIE**) — and is commonly organized by activities of daily living using the **Roper–Logan–Tierney** model of nursing. The plan captures the identified nursing problems / needs, the goals set for each, the planned interventions, the record of implementation, the evaluation and review, and the risk assessments referenced (falls, pressure ulcer, venous thromboembolism, nutrition / MUST).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `nursing-care-plan-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
