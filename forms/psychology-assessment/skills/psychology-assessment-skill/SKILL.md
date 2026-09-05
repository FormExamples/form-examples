---
name: psychology-assessment-skill
description: "Explains what the Psychology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Psychology Assessment

General psychological screening assessment that collects self-reported data on depression, anxiety, and stress symptoms using the **DASS-21** instrument, computes severity categories per subscale, and flags safety-critical items (e.g. suicidal ideation) for clinician review.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `psychology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: DASS-21 (Depression Anxiety Stress Scales — 21 item).
- **Subscales**: Depression, Anxiety, Stress; 7 items each.
- **Item scale**: 0–3 Likert (did not apply → applied very much).
- **Raw range**: 0–21 per subscale, doubled to match DASS-42 reference norms.
- **Categories**: Normal, Mild, Moderate, Severe, Extremely Severe.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
