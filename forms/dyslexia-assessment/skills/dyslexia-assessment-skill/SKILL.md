---
name: dyslexia-assessment-skill
description: "Explains what the Dyslexia Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Dyslexia Assessment

Specific learning difficulty evaluation using standardized scores for reading, writing, spelling, phonological processing, working memory, and processing speed with severity classification.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `dyslexia-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: Standardized score assessment battery
- **Range**: Standard scores (mean 100, SD 15)
- **Categories**:
  - Standard score 85-115: Average (no dyslexia)
  - Standard score 70-84: Below average (mild dyslexia)
  - Standard score 55-69: Well below average (moderate dyslexia)
  - Standard score <55: Significantly below average (severe dyslexia)
- **Severity levels**:
  - No dyslexia: All scores within normal limits
  - Mild: Borderline scores, some difficulties
  - Moderate: Below average, consistent pattern of difficulty
  - Severe: Significantly below average, pervasive impact
- **Engine files**: `types.ts`, `dyslexia-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `dyslexia-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
