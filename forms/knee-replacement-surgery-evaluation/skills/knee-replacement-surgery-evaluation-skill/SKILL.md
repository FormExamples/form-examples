---
name: knee-replacement-surgery-evaluation-skill
description: "Explains what the Knee Replacement Surgery Evaluation form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Knee Replacement Surgery Evaluation

An orthopaedic **knee-replacement surgery evaluation**: the assessment used by an orthopaedic surgeon or extended-scope physiotherapist in a joint-replacement clinic to decide whether a patient is a suitable candidate for total or partial knee arthroplasty. The form records the presenting history, scores the validated **Oxford Knee Score (OKS)**, captures the physical examination and diagnostic imaging, audits the conservative treatment already tried, and computes an OKS total and category, a surgical-candidacy recommendation, and a set of safety flags. The output is a signed evaluation report suitable for the clinical record and the joint-replacement multidisciplinary team (MDT).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `knee-replacement-surgery-evaluation-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `KneeReplacementSurgeryEvaluation` TypeScript type
  containing the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateKneeEvaluation(data: KneeReplacementSurgeryEvaluation): {
    oksItemScores: Record<string, number | null>;
    oksTotal: number;
    computedOksCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';
    finalOksCategory: 'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | '';
    maxKellgrenLawrenceGrade: number | null;
    computedCandidacy: 'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | '';
    finalCandidacy: 'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | '';
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** the OKS total and category are a straight sum and band
  lookup. The candidacy recommendation is a first-match-wins ordered rule
  list (see `oks-rules.ts` / `js/oks-rules.js`). Safety flags fire
  independently of the candidacy override.
- **Engine files (HTML):** `js/types.js`, `js/oks-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `oks-rules.ts`,
  `flagged-issues.ts`, `grader.ts`), with `grader.test.ts` asserting both
  sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
