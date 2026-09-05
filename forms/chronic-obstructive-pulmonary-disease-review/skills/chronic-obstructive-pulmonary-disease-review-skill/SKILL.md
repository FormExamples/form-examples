---
name: chronic-obstructive-pulmonary-disease-review-skill
description: "Explains what the Chronic Obstructive Pulmonary Disease Review (COPD Annual Review) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Chronic Obstructive Pulmonary Disease Review (COPD Annual Review)

A UK primary-care **annual review** for adults with a confirmed diagnosis of chronic obstructive pulmonary disease (COPD). It records the objective and patient-reported findings that a structured COPD review should capture — spirometry, symptom burden, exacerbation history, smoking status, inhaler technique and adherence, vaccinations, pulmonary rehabilitation, oxygen, comorbidities, and the self-management / rescue-pack plan — then derives a **GOLD airflow-limitation grade (1–4)**, a **combined ABE assessment group**, a **review completeness grade**, and a set of clinical flags that prompt action.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `chronic-obstructive-pulmonary-disease-review-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
