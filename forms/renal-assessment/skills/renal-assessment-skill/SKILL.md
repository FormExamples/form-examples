---
name: renal-assessment-skill
description: "Explains what the Renal Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Renal Assessment

Renal (kidney) assessment aligned with KDIGO 2012/2024 CKD classification, stratifying chronic kidney disease by GFR category (G1-G5) and albuminuria category (A1-A3) to produce a composite risk level that drives management and referral.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `renal-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: KDIGO CKD Classification (GFR × Albuminuria heatmap)
- **Range**: G1-G5 × A1-A3; composite risk Low / Moderate / High / Very High
- **Engine files**: `types.ts`, `kdigo-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `kdigo-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
