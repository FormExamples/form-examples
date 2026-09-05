---
name: medical-error-report-skill
description: "Explains what the Medical Error Report form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Error Report

Medical error reporting form for incident documentation, root cause analysis, and patient safety improvement. Uses WHO severity scale and NCC MERP harm categories.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-error-report-maintainer-skill` instead.

## Scoring system

- **Instrument**: WHO Severity Scale + NCC MERP Harm Categories
- **WHO Severity Scale**: Near Miss, Mild, Moderate, Severe, Critical
- **NCC MERP Categories**: A through I
- **Engine files**: `types.ts`, `error-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `error-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
