---
name: agile-principles-assessment-skill
description: "Explains what the Agile Principles Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Agile Principles Assessment

A team / organization self-assessment that scores adoption of the **12 principles of the Agile Manifesto** (Beck *et al.*, 2001) and produces a composite **agility maturity level** (Ad-hoc / Initial / Developing / Mature / Optimizing), a list of weak-principle flags, and a coaching action plan.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `agile-principles-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `AgileAssessment` TypeScript type containing the
  respondent identification block plus 12 `PrincipleResponse` objects
  (`{ score: 1|2|3|4|5|null; comment: string }`).
- **Output shape:**
  ```ts
  calculateMaturity(data: AgileAssessment): {
    answeredCount: number;        // 0..12
    meanScore: number | null;     // null if fewer than 6 answered
    maturity: 'optimising' | 'mature' | 'developing' | 'initial'
            | 'ad-hoc' | 'insufficient-data';
    perPrincipleBands: Array<'high' | 'mid' | 'low' | 'unanswered'>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** unweighted mean of answered principle scores; thresholds in
  `index.md`. Each principle below 3 fires its own coaching rule; any score
  of 1 raises a critical-gap flag.
- **Engine files:** `types.ts`, `factory.ts`, `principles.ts`,
  `maturity-rules.ts`, `flagged-issues.ts`, `composite-grader.ts`.
- **Tests:** `composite-grader.test.ts`, `maturity-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
