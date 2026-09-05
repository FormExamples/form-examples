---
name: health-screening-questionnaire-skill
description: "Explains what the Health Screening Questionnaire form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Health Screening Questionnaire

A generic, purpose-flexible baseline health and lifestyle screen used by employers, gyms and fitness professionals, and primary-care / preventive-health services to establish a person's medical history, uncover hidden risk factors, and flag whether they need further medical review before starting an activity (an exercise programme, a new job role) or as a routine wellness check. The form wraps two real, validated instruments — **PAR-Q+** for physical-activity readiness and **AUDIT-C** for alcohol use — inside a wider occupational and wellness screening questionnaire, and computes a composite risk band with a referral recommendation and a set of safety flags.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `health-screening-questionnaire-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `HealthScreeningQuestionnaire` TypeScript type containing
  the 14 wizard sections plus assessor-identification and
  patient-identification fields.
- **Output shape:**

  ```ts
  calculateHealthScreening(data: HealthScreeningQuestionnaire): {
    parqPlusClearance: 'cleared' | 'further-assessment-required';
    auditCScore: number | null;                          // 0..12
    auditCBand: 'low' | 'increasing-risk' | 'higher-risk' | '';
    computedRiskBand: 'low' | 'moderate' | 'high' | 'refer-urgently';
    finalRiskBand: 'low' | 'moderate' | 'high' | 'refer-urgently' | '';
    computedRecommendation: Recommendation;
    finalRecommendation: Recommendation;
    overrideReason: string;
    firedRules: FiredRule[];
    flags: AdditionalFlag[];
  }
  ```

- **Algorithm:** max-grade — the worst finding sets the composite risk band;
  safety flags fire independently of the risk band. `low` is the default when
  no rule fires.
- **Engine files (HTML):** `js/types.js`, `js/parq-rules.js`,
  `js/audit-c-rules.js`, `js/flagged-issues.js`, `js/composite-grader.js`.
- **Engine files (Svelte):** the same modules in TypeScript under
  `src/lib/engine/` (`types.ts`, `defaults.ts`, `utils.ts`, `parq-rules.ts`,
  `audit-c-rules.ts`, `flagged-issues.ts`, `grader.ts`), with
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
