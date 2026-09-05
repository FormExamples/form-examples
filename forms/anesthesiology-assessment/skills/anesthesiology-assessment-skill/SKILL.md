---
name: anesthesiology-assessment-skill
description: "Explains what the Anesthesiology Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Anesthesiology Assessment

UK NHS-aligned pre-operative anesthesiology assessment combining four validated scoring systems — ASA Physical Status Classification, Mallampati / Airway Score, Revised Cardiac Risk Index (RCRI / Lee Index), and STOP-BANG (OSA screening) — into a composite perioperative risk level, with flagged safety-critical issues and an anaesthetic plan.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `anesthesiology-assessment-maintainer-skill` instead.

## Scoring system

- **Instruments**: ASA Physical Status (I-VI), Mallampati Airway Class (I-IV), RCRI (0-6), STOP-BANG (0-8)
- **Range**: Composite perioperative risk — Low / Moderate / High / Critical
- **Engine files**: `types.ts`, `composite-grader.ts`, `asa-rules.ts`, `mallampati-rules.ts`, `rcri-rules.ts`, `stopbang-rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `composite-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
