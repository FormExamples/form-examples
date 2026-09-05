---
name: medical-language-speaking-assessment-for-cymraeg-skill
description: "Explains what the Medical Language Speaking Assessment for Cymraeg form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Language Speaking Assessment for Cymraeg

Clinical Welsh-language (Cymraeg) speaking assessment for healthcare professionals working with Welsh-speaking patients, aligned to the NHS Wales "More Than Just Words" framework and mapped to CEFR levels A1 through C2 with criteria covering fluency, grammar, pronunciation, and clinical appropriateness.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-language-speaking-assessment-for-cymraeg-maintainer-skill` instead.

## Scoring system

- **Instrument**: NHS Wales Clinical Welsh Language Speaking Assessment (CEFR-mapped)
- **Range**: CEFR A1 to C2
- **Criteria**: Fluency, Grammar, Pronunciation, Clinical Appropriateness
- **Engine files**: `types.ts`, `cymraeg-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `cymraeg-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
