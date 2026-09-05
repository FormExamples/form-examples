---
name: hip-replacement-surgery-evaluation-skill
description: "Explains what the Hip Replacement Surgery Evaluation form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Hip Replacement Surgery Evaluation

A **hip-replacement surgery evaluation** is the orthopaedic assessment used to determine whether a patient is a suitable candidate for total hip arthroplasty. It is performed by an orthopaedic surgeon or extended-scope physiotherapist in a joint-replacement clinic. The form quantifies hip pain and functional decline with the validated **Oxford Hip Score (OHS)**, records the physical examination and imaging findings, audits which conservative treatments have already been tried, screens general surgical fitness, and produces a **surgical-candidacy recommendation** together with a set of safety-critical flags.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `hip-replacement-surgery-evaluation-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `HipReplacementSurgeryEvaluation` TypeScript type containing
  the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateHipEvaluation(data: HipReplacementSurgeryEvaluation): {
    ohsTotal: number;                     // 0..48
    ohsCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory';
    kellgrenLawrenceGrade: number | null; // 0..4
    computedCandidacy: 'strong-candidate' | 'candidate'
                      | 'continue-conservative' | 'not-indicated' | 'mdt-review';
    finalCandidacy: 'strong-candidate' | 'candidate'
                   | 'continue-conservative' | 'not-indicated' | 'mdt-review';
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** rule-order evaluation — `continue-conservative` is checked
  first (conservative measures not exhausted overrides everything else), then
  `not-indicated`, then `strong-candidate`, then `candidate`, then
  `mdt-review` as the fallback. Safety flags fire independently of the
  candidacy recommendation.
- **Engine files (HTML):** `js/types.js`, `js/ohs-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `ohs-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both sides
  of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
