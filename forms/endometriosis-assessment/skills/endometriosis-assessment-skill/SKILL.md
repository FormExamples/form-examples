---
name: endometriosis-assessment-skill
description: "Explains what the Endometriosis Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Endometriosis Assessment

Endometriosis evaluation using revised ASRM (American Society for Reproductive Medicine) staging and EHP-30 quality of life scoring, with comprehensive pelvic pain profiling and fertility assessment.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `endometriosis-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Revised ASRM Staging + EHP-30 Quality of Life
- **Range**: ASRM Stage I-IV (points-based), EHP-30 0-100 per domain
- **Categories**:
  - Stage I (Minimal): 1-5 points
  - Stage II (Mild): 6-15 points
  - Stage III (Moderate): 16-40 points
  - Stage IV (Severe): >40 points
- **Severity**:
  - Mild: Stage I-II, manageable symptoms
  - Moderate: Stage II-III, significant impact
  - Severe: Stage III-IV, debilitating
  - Critical: Bowel/urinary obstruction, fertility crisis
- **Engine files**: `types.ts`, `endo-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `endo-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
