---
name: post-traumatic-stress-assessment-skill
description: "Explains what the Post-Traumatic Stress Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Post-Traumatic Stress Assessment

Post-traumatic stress symptom screen based on the DSM-5-aligned PCL-5 (PTSD Checklist for DSM-5), used by clinicians to identify probable PTSD, monitor severity, and track response to trauma-focused therapy.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `post-traumatic-stress-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: PCL-5 (PTSD Checklist for DSM-5) — 20 items scored 0-4
- **Range**: 0-80 total score
- **Categories**:
  - Minimal (0-20)
  - Mild (21-32)
  - Moderate (33-37) — probable PTSD threshold
  - Severe (38-80)
- **Engine files**: `types.ts`, `pcl5-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `pcl5-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
