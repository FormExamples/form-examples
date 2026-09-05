---
name: emergency-medical-technician-psychomotor-examination-skill
description: "Explains what the Emergency Medical Technician Psychomotor Examination form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Emergency Medical Technician Psychomotor Examination

NREMT-style psychomotor skills examination for Emergency Medical Technicians, scored against a point-based checklist for scene size-up, primary survey, history taking, secondary assessment, and reassessment, with explicit critical-criteria failure conditions.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `emergency-medical-technician-psychomotor-examination-maintainer-skill` instead.

## Scoring system

- **Instrument**: NREMT Psychomotor Skills Examination
- **Range**: Pass / Fail with critical-criteria overrides
- **Categories**:
  - Pass: Minimum point threshold met and no critical-criteria failure
  - Fail: Any critical-criteria failure OR insufficient points
- **Critical criteria** (any → Fail): PPE precautions, scene safety, oxygen therapy, airway/breathing/shock management, transport urgency decision, dangerous intervention, spinal protection when indicated, 15-minute transport call
- **Engine files**: `types.ts`, `psychomotor-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `psychomotor-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
