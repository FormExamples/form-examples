---
name: substance-abuse-assessment-skill
description: "Explains what the Substance Abuse Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Substance Abuse Assessment

Substance use disorder evaluation using AUDIT (Alcohol Use Disorders Identification Test) and DAST-10 (Drug Abuse Screening Test) with comprehensive biopsychosocial assessment.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `substance-abuse-assessment-maintainer-skill` instead.

## Scoring system

- **Instruments**: AUDIT (0-40) + DAST-10 (0-10)
- **AUDIT Categories**:
  - Low risk (0-7): Education on safe drinking
  - Hazardous (8-15): Simple advice and brief intervention
  - Harmful (16-19): Brief intervention and continued monitoring
  - Dependence likely (20-40): Referral to specialist for diagnostic evaluation and treatment
- **DAST-10 Categories**:
  - No problems (0): No intervention needed
  - Low level (1-2): Monitor and reassess
  - Moderate level (3-5): Further investigation and brief intervention
  - Substantial level (6-8): Intensive assessment and treatment
  - Severe level (9-10): Intensive assessment and treatment, referral to specialist
- **Combined Severity**: low, moderate, high, critical (active withdrawal/overdose risk)
- **Engine files**: `types.ts`, `substance-grader.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `substance-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
