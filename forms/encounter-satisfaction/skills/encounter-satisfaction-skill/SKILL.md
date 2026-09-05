---
name: encounter-satisfaction-skill
description: "Explains what the Encounter Satisfaction form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Encounter Satisfaction

Patient encounter satisfaction survey for collecting feedback on healthcare experiences.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `encounter-satisfaction-maintainer-skill` instead.

## Scoring system

- **Instrument**: Encounter Satisfaction Score (ESS), inspired by PSQ-18 and HCAHPS
- **Scale**: 5-point Likert (1=Very Dissatisfied ... 5=Very Satisfied), `null` when unanswered
- **Range**: 1.0 - 5.0 (composite mean of all answered questions)
- **19 questions across 6 domains**:
  - Access & Scheduling (3 questions)
  - Communication (4 questions)
  - Staff & Professionalism (3 questions)
  - Care Quality (3 questions)
  - Environment (3 questions)
  - Overall Satisfaction (3 questions)
- **Categories**:
  - 4.5 - 5.0: Excellent
  - 3.5 - 4.4: Good
  - 2.5 - 3.4: Fair
  - 1.5 - 2.4: Poor
  - 1.0 - 1.4: Very Poor
- **Engine files**: `types.ts`, `satisfaction-grader.ts`, `satisfaction-questions.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `satisfaction-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
