---
name: hernia-diagnostic-evaluation-skill
description: "Explains what the Hernia Diagnostic Evaluation form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Hernia Diagnostic Evaluation

A **hernia diagnostic evaluation** is the clinical assessment used to detect, classify, and grade the urgency of an abdominal-wall or groin hernia, performed by a GP, surgical registrar, or general surgeon. Most uncomplicated hernias are identified during a standard physical examination — visual inspection, palpation, cough impulse, and a reducibility check — without needing advanced imaging. This form records that examination, applies the European Hernia Society (EHS) groin-hernia classification and a red-flag urgency screen, and produces a hernia classification plus an urgency band suitable for the clinical record and for a referral letter.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `hernia-diagnostic-evaluation-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `HerniaDiagnosticEvaluation` TypeScript type containing the
  14 wizard sections plus clinician-identification and patient-identification
  fields.
- **Output shape:**

  ```ts
  calculateHerniaEvaluation(data: HerniaDiagnosticEvaluation): {
    herniaType: HerniaType;
    herniaSubtype: InguinalSubtype | 'not-applicable' | '';
    ehsClassification: string;
    ehsSizeGrade: '1' | '2' | '3' | '';
    reducibilityStatus: ReducibilityStatus;
    computedUrgency: 'routine' | 'soon' | 'urgent' | 'emergency';
    finalUrgency: 'routine' | 'soon' | 'urgent' | 'emergency';
    overrideReason: string;
    recommendation: ManagementPlan;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** red-flag-first, not max-grade over a numeric total — any
  positive red flag in step 8 forces `computedUrgency` to `emergency` and is
  never diluted by the rest of the examination. `routine` is the default when
  nothing else fires.
- **Engine files (HTML):** `js/types.js`, `js/classification-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`,
  `classification-rules.ts`, `flagged-issues.ts`, `grader.ts`), with
  `grader.test.ts` asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
