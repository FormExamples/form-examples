---
name: medical-language-speaking-assessment-for-english-skill
description: "Explains what the Medical Language Speaking Assessment for English form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Language Speaking Assessment for English

Clinical English-language speaking assessment for internationally educated healthcare professionals, modelled on the Occupational English Test (OET) Medicine speaking sub-test, using role-played patient scenarios and criterion-based scoring on linguistic and clinical communication indicators.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-language-speaking-assessment-for-english-maintainer-skill` instead.

## Scoring system

- **Instrument**: OET Speaking Sub-test (Medicine profession)
- **Range**: 0-500 (grades A, B, C+, C, D, E)
- **Linguistic criteria**: Intelligibility, Fluency, Appropriateness of Language, Resources of Grammar & Expression
- **Clinical communication indicators**: Relationship-building, Understanding patient's perspective, Providing structure, Information-gathering, Information-giving
- **Engine files**: `types.ts`, `oet-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `oet-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
