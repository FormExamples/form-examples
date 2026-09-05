---
name: cataract-diagnostic-evaluation-skill
description: "Explains what the Cataract Diagnostic Evaluation form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Cataract Diagnostic Evaluation

A comprehensive **cataract diagnostic evaluation**: the ophthalmic assessment used to confirm the presence of a cataract, grade its severity against the validated **LOCS III** (Lens Opacities Classification System III) instrument, assess its functional impact on the patient's daily life, rule out competing posterior-segment pathology (glaucoma, age-related macular degeneration, diabetic retinopathy), and determine surgical candidacy. Performed by an optometrist or ophthalmologist. The output is a signed evaluation report with a computed surgical-candidacy recommendation suitable for the clinical record and for referral into a cataract-surgery pathway.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `cataract-diagnostic-evaluation-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `CataractDiagnosticEvaluation` TypeScript type containing
  the 15 wizard sections plus clinician-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateCataractEvaluation(data: CataractDiagnosticEvaluation): {
    locsIIISeverityRight: 'mild' | 'moderate' | 'severe' | '';
    locsIIISeverityLeft: 'mild' | 'moderate' | 'severe' | '';
    computedSurgicalCandidacy: 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';
    finalSurgicalCandidacy: 'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | '';
    overrideReason: string;
    functionalImpactScore: number | null;    // 0..12 (three 0..4 sub-scores)
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worse eye's LOCS III severity band and the
  worse of acuity/glare drive the computed surgical candidacy; safety flags
  fire independently and are never suppressed by a clinician override.
  `not-indicated` is the default when no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/locs-rules.js`,
  `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `locs-rules.ts`,
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
