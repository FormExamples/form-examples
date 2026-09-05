---
name: pre-anaesthesia-assessment-skill
description: "Explains what the Pre-Anaesthesia Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Pre-Anaesthesia Assessment

A UK NHS–aligned, clinician-driven pre-operative assessment that records **objective findings** (history, examination, vitals, laboratory results, imaging) and computes an **ASA Physical Status grade** (I–VI), a composite perioperative risk level, and a set of safety-critical flags. The output is a signed clinician report with an anaesthesia plan suitable for the pre-operative record.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `pre-anaesthesia-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `ClinicianAssessment` TypeScript type containing 11
  body-system sub-types plus surgical, anaesthesia-plan, and clinician-
  identification fields.
- **Output shape:**
  ```ts
  calculateASA(data: ClinicianAssessment): {
    asaGrade: 1 | 2 | 3 | 4 | 5 | 6;
    mallampatiClass: 1 | 2 | 3 | 4 | null;
    rcriScore: number;    // 0..6
    stopBangScore: number; // 0..8
    frailtyScale: number | null; // 1..9
    compositeRisk: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade; ASA I
  is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `asa-rules.ts`, `mallampati-rules.ts`,
  `rcri-rules.ts`, `stopbang-rules.ts`, `frailty-rules.ts`, `composite-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `asa-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
