---
name: bone-marrow-donation-assessment-skill
description: "Explains what the Bone Marrow Donation Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Bone Marrow Donation Assessment

Haematopoietic stem cell donor evaluation assessing HLA typing, health screening, anaesthetic fitness, and collection method suitability (peripheral blood stem cells vs bone marrow harvest).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `bone-marrow-donation-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Donor Eligibility Classification with HLA Match Grading
- **Range**: Eligibility (suitable, conditionally suitable, unsuitable) + Risk Level (low, moderate, high, critical)
- **Categories**:
  - Suitable: Ideal match, healthy donor, no contraindications
  - Conditionally suitable: Minor health issues, partial match, requires further evaluation
  - Unsuitable: Contraindicated, significant health risks, poor match
- **Engine files**: `types.ts`, `donor-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `donor-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
