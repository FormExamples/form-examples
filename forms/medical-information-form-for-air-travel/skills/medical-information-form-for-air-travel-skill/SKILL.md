---
name: medical-information-form-for-air-travel-skill
description: "Explains what the Medical Information Form for Air Travel (MEDIF) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Information Form for Air Travel (MEDIF)

A **Medical Information Form (MEDIF)** is the standardized airline document used to determine whether a passenger with specific health needs is fit to fly and whether in-flight medical support (supplemental oxygen, stretcher, incubator, medical escort, battery-powered medical device) must be arranged in advance. It is completed in two parts: Part 1 by the passenger (or booking agent) and Part 2 by the attending physician, then forwarded to the airline's medical desk for clearance.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-information-form-for-air-travel-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `MedifAssessment` TypeScript type containing trip details,
  passenger identity, attending-physician identity, 7 clinical sections
  (cardiovascular, respiratory, recent-event, pregnancy, communicable,
  in-flight-needs, medications) and the requested accommodations.
- **Output shape:**
  ```ts
  evaluateFitnessToFly(data: MedifAssessment): {
    fitnessBand: 'fit' | 'fit-with-conditions' | 'requires-review' | 'unfit-to-fly';
    firedRules: FiredRule[];
    safetyFlags: SafetyFlag[];
    deskRecommendation: string;
    validUntil: string; // ISO 8601 date
  }
  ```
- **Algorithm:** max-grade — the worst-band finding sets the overall
  fitness band; `fit` is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `equipment-rules.ts`,
  `recent-event-rules.ts`, `cardiorespiratory-rules.ts`, `pregnancy-rules.ts`,
  `communicable-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `recent-event-rules.test.ts`,
  `cardiorespiratory-rules.test.ts`, `pregnancy-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
