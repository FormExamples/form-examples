---
name: agile-consulting-scorecard-for-hiring-help-skill
description: "Explains what the Agile consulting scorecard for hiring help form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Agile consulting scorecard for hiring help

A self-assessment scorecard that helps an organization decide whether it is ready to hire agile consulting help. The respondent walks through a single-page, step-by-step questionnaire of **sixteen yes/no checklist items** drawn from the four points of the *Agile Manifesto* and the twelve *Principles behind the Agile Manifesto*, scores one point per "yes", and receives a banded readiness verdict (Low / Medium / High) with rationale and recommended next actions.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `agile-consulting-scorecard-for-hiring-help-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `AgileConsultingScorecardAssessment` TypeScript type
  containing organization metadata, respondent metadata, and the sixteen
  boolean checklist answers (`item01`..`item16`) with optional evidence
  text per item.
- **Output shape:**
  ```ts
  gradeScorecard(data: AgileConsultingScorecardAssessment): {
    scoreTotal: number;                       // 0..16
    scoreBand: 'low' | 'borderline' | 'medium' | 'high';
    manifestoSubtotal: number;                // 0..4
    principlesSubtotal: number;               // 0..12
    firedRules: FiredRule[];                  // one per item, recording the answer
    additionalFlags: AdditionalFlag[];        // readiness flags
  }
  ```
- **Algorithm:** sum-of-points. Each `true` answer scores 1; the band
  is read from the table:
  - 0–4 → `low`
  - 5 → `borderline`
  - 6–10 → `medium`
  - 11–16 → `high`
- **Engine files:**
  `types.ts`, `utils.ts`, `manifesto-rules.ts`, `principles-rules.ts`,
  `score-grader.ts`, `flagged-issues.ts`.
- **Tests:** `score-grader.test.ts`, `manifesto-rules.test.ts`,
  `principles-rules.test.ts`, `flagged-issues.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
