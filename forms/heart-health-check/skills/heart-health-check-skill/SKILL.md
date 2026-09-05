---
name: heart-health-check-skill
description: "Explains what the Heart Health Check form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Heart Health Check

NHS Heart Health Check for cardiovascular risk assessment using simplified QRISK3-based scoring with 10-year CVD risk estimation and heart age calculation.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `heart-health-check-maintainer-skill` instead.

## Scoring system

- **Instrument**: Simplified QRISK3-based cardiovascular risk
- **Range**: 0.1–95.0% (10-year CVD risk percentage)
- **Categories**: Draft (age/sex missing), Low (<10%), Moderate (10–19.9%), High (>=20%)
- **Heart age**: Age at which an average person (non-smoker, BP 120, TC/HDL 4.0) matches the patient's risk
- **Engine files**: `types.ts`, `risk-calculator.ts`, `risk-grader.ts`, `risk-rules.ts`, `flagged-issues.ts`, `utils.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
