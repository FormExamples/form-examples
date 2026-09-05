---
name: confusion-assessment-method-skill
description: "Explains what the Confusion Assessment Method (CAM) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Confusion Assessment Method (CAM)

A structured, bedside **delirium screening** instrument that records four observational **features** of an acute confusional state and applies the validated **CAM diagnostic algorithm** to classify delirium as **present** or **absent**. The Confusion Assessment Method is not a numeric sum: the output is a boolean status derived from a fixed pattern of positive features, together with the list of which features were positive and any safety-critical flags.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `confusion-assessment-method-maintainer-skill` instead.

## Scoring engine

This form **classifies**; it does not sum. The engine is a pure boolean
function of four present / absent features.

- **Input shape:** `CamAssessment` TypeScript type — four features plus
  identification, variant, consciousness level, RASS, attention test, motoric
  subtype, and observation notes.
- **Output shape:**
  ```ts
  gradeCam(data: CamAssessment): {
    classification: 'present' | 'absent' | 'unableToAssess';
    deliriumPresent: boolean;
    positiveFeatures: number[];        // subset of [1,2,3,4]
    motoricSubtype: 'hypoactive' | 'hyperactive' | 'mixed' | 'normal' | '';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:**
  ```
  deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
  ```
  where feature1 = acute onset and fluctuating course, feature2 = inattention,
  feature3 = disorganized thinking, feature4 = altered level of consciousness.
  `classification = deliriumPresent ? 'present' : 'absent'`. For the CAM-ICU
  variant, an unrousable patient (RASS −4/−5) yields `unableToAssess` and the
  algorithm is not evaluated.
- **Engine files:**
  - `types.ts` — `CamAssessment`, `CamResult`, `FlaggedIssue`, feature and enum
    types.
  - `cam-rules.ts` — the boolean feature predicates and the
    `1 AND 2 AND (3 OR 4)` diagnostic rule; CAM-ICU RASS gating.
  - `cam-grader.ts` — pure `gradeCam(data)` orchestrator returning the output
    shape above.
  - `flagged-issues.ts` — derives the prioritized flagged-issue list.
  - `utils.ts` — shared helpers (feature normalization, tri-state handling,
    positive-feature-set construction).
- **Tests:** `cam-grader.test.ts` (each satisfying and non-satisfying feature
  pattern plus the `unableToAssess` edge case), `cam-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
