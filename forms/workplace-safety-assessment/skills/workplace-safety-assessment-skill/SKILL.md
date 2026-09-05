---
name: workplace-safety-assessment-skill
description: "Explains what the Workplace Safety Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Workplace Safety Assessment

Workplace safety audit form aligned with UK Health and Safety Executive (HSE) standards, covering physical, chemical, biological, ergonomic, and organizational risks to identify hazards and verify control measures in healthcare settings.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `workplace-safety-assessment-maintainer-skill` instead.

## Scoring system

- **Instrument**: HSE Workplace Safety Audit Checklist
- **Range**: Compliant / Minor Findings / Major Findings / Critical Findings
- **Categories**:
  - Compliant: All controls in place
  - Minor Findings: Low-risk gaps, action within 90 days
  - Major Findings: Moderate-risk gaps, action within 30 days
  - Critical Findings: Imminent risk, immediate corrective action
- **Engine files**: `types.ts`, `safety-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `safety-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
