---
name: waterlow-pressure-ulcer-risk-assessment-skill
description: "Explains what the Waterlow Pressure Ulcer Risk Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Waterlow Pressure Ulcer Risk Assessment

A bedside screening tool that estimates an adult patient's risk of developing a pressure ulcer (pressure sore, bedsore, decubitus ulcer). It records a set of weighted risk categories — build / weight for height (BMI), skin type and visual risk areas, sex and age, continence, and mobility — plus four groups of special risk factors (tissue malnutrition, neurological deficit, major surgery or trauma, and medication), **sums** the points into a single total, and places the patient in a risk band. A **higher total means higher risk**: the band drives escalation of pressure-relieving support surfaces, repositioning frequency, and skin-care review.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `waterlow-pressure-ulcer-risk-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `WaterlowAssessment` TypeScript type — the core category and
  special-risk enum inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeWaterlow(data: WaterlowAssessment): {
    buildPoints: number;
    skinPoints: number;
    sexPoints: number;
    agePoints: number;
    continencePoints: number;
    mobilityPoints: number;
    tissueMalnutritionPoints: number;
    neurologicalDeficitPoints: number;
    majorSurgeryTraumaPoints: number;
    medicationPoints: number;
    waterlowScore: number;
    riskBand: 'low' | 'at-risk' | 'high' | 'very-high';
    contributingCategories: ContributingCategory[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive weighted sum — each core category maps its selected
  enum to points; sex-and-age adds `sexPoints + agePoints`; each special-risk
  group maps its highest applicable enum to points. All contributions are summed
  into `waterlowScore`, which selects the band via `≥ 20 → very-high`,
  `≥ 15 → high`, `≥ 10 → at-risk`, else `low`. See spec §4. A missing enum
  contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `waterlow-rules.ts`,
  `waterlow-grader.ts`, `flagged-issues.ts`.
- **Tests:** `waterlow-grader.test.ts`, `waterlow-rules.test.ts` — cover each
  band boundary (9/10, 14/15, 19/20) and every category's point mapping.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
