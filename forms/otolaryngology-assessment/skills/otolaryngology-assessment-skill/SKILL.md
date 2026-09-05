---
name: otolaryngology-assessment-skill
description: "Explains what the Otolaryngology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Otolaryngology Assessment

General ear-nose-throat (otolaryngology) consultation assessment covering presenting complaint, history, examination findings, and the SNOT-22 symptom score to quantify sinonasal quality of life and guide ENT management.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `otolaryngology-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: SNOT-22 + ENT Review of Systems
- **Range**: SNOT-22 total 0-110
- **Categories**:
  - Mild (0-7)
  - Moderate (8-19)
  - Severe (20+)
- **Engine files**: `types.ts`, `snot22-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `snot22-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
