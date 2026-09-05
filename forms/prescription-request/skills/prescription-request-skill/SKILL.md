---
name: prescription-request-skill
description: "Explains what the Prescription Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Prescription Request

Prescription request form collecting patient information, clinician details, medication and dosage, substitution options, and request type classification with priority urgency grading (Routine / Urgent / Emergency).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `prescription-request-maintainer-skill` instead.

## Scoring system

- **Instrument**: Priority Classification
- **Range**: Routine / Urgent / Emergency
- **Engine files**: `types.ts`, `prescription-rules.ts`, `prescription-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `prescription-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
