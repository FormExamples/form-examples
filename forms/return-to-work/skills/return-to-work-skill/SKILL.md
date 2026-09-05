---
name: return-to-work-skill
description: "Explains what the Return to Work form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Return to Work

A clinician-issued medical certificate authorizing an employee's return to work after illness, injury, or extended absence. The form captures the clinician's assessment, the period of validity, the patient's fitness status, any workplace adjustments or restrictions, and a phased-return plan where applicable. The output is a signed *Statement of Fitness for Work* (aligned with the UK NHS **Med 3 "Fit Note"**), suitable to give to the employee and to share with the employer's occupational-health team.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `return-to-work-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `ReturnToWorkAssessment` TypeScript type containing
  patient, clinician, job-context, absence, diagnosis, treatment,
  functional, fitness-statement, phased-return, adjustment, follow-up,
  and sign-off sub-types.
- **Output shape:**
  ```ts
  calculateReturnToWork(data: ReturnToWorkAssessment): {
    fitnessStatement: 'fit' | 'may-be-fit' | 'not-fit';
    restrictionPriority: 'routine' | 'standard' | 'restricted' | 'high-risk';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the most severe adjustment sets the
  restriction priority; safety flags fire independently.
- **Engine files:** `types.ts`, `utils.ts`, `fitness-rules.ts`,
  `restriction-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `restriction-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
