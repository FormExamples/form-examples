---
name: palliative-assessment-skill
description: "Explains what the Palliative Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Palliative Assessment

Symptom-focused palliative care assessment using the Edmonton Symptom Assessment System-revised (ESAS-r) alongside performance status, goals-of-care documentation, medication and symptom-control planning, and psychosocial and spiritual review to guide individualized palliative management.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `palliative-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: ESAS-r (10 symptoms scored 0-10)
- **Range**: Total 0-100
- **Categories**:
  - None (0-10)
  - Mild (11-30)
  - Moderate (31-60)
  - Severe (61-100)
- **Individual flag**: Any symptom ≥ 7
- **Engine files**: `types.ts`, `esas-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `esas-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
