---
name: diabetes-podiatry-assessment-skill
description: "Explains what the Diabetes Podiatry Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Diabetes Podiatry Assessment

A structured diabetic foot risk-screening record aligned with **NICE NG19** (*Diabetic foot problems: prevention and management*). For each foot it captures sensory neuropathy status, pedal pulses, structural deformity, callus, skin breakdown, active ulceration (and its severity), ulceration and amputation history, and a suspected-Charcot-foot marker, together with patient-wide risk factors (renal replacement therapy, visual acuity impairment, self-care ability, footwear). From the two examined feet it classifies each foot's risk, applies the patient-wide high-risk overrides, derives an overall risk category, review pathway, and review interval, and raises flagged issues.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `diabetes-podiatry-assessment-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- No `examples/personas.json` yet for this form — see `form-examples-maintainer-skill` for how personas are authored.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
