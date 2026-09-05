---
name: dietic-assessment-skill
description: "Explains what the Dietetic Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Dietetic Assessment

A UK-aligned, dietitian-driven **dietetic assessment**: a comprehensive evaluation of a patient's nutritional status, eating patterns, medical history, and food environment, conducted by a registered dietitian. The form records objective findings and patient-reported intake, computes a **MUST** (Malnutrition Universal Screening Tool) score with a **GLIM** malnutrition diagnosis, a composite nutrition risk level, and a set of safety-critical flags. The output is a signed dietetic report with a nutrition care plan suitable for the clinical record.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `dietic-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `DieticAssessment` TypeScript type containing the 16 wizard
  sections plus dietitian-identification and patient-identification fields.
- **Output shape:**

  ```ts
  calculateNutritionRisk(data: DieticAssessment): {
    mustBmiScore: 0 | 1 | 2;
    mustWeightLossScore: 0 | 1 | 2;
    mustAcuteDiseaseScore: 0 | 2;
    mustScore: number;                                   // 0..6
    mustRisk: 'low' | 'medium' | 'high';
    glimPhenotypicCriteria: string[];
    glimEtiologicCriteria: string[];
    glimDiagnosis: 'none' | 'moderate' | 'severe';
    nrs2002Score: number | null;                         // 0..7
    sarcfScore: number | null;                           // 0..10
    scoffScore: number | null;                           // 0..5
    refeedingRisk: 'none' | 'high' | 'highest';
    energyRequirementKcal: number | null;
    proteinRequirementG: number | null;
    computedCompositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    finalCompositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    overrideReason: string;
    recommendation: Recommendation;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worst finding sets the composite risk band;
  safety flags fire independently of the MUST score. `low` is the default when
  no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/must-rules.js`,
  `js/glim-rules.js`, `js/composite-grader.js`, `js/flagged-issues.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `must-rules.ts`,
  `glim-rules.ts`, `flagged-issues.ts`, `grader.ts`), with `grader.test.ts`
  asserting both sides of every threshold.
- **Purity:** the engine is a pure function — no I/O, no `Date.now()` inside
  the rule predicates (the caller passes `assessmentDate`), no DOM access.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
