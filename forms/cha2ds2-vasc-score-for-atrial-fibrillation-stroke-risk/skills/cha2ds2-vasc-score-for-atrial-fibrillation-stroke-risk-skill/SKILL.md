---
name: cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk-skill
description: "Explains what the CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk

A clinical prediction tool that estimates the annual risk of ischaemic stroke and systemic thromboembolism in adults with **non-valvular atrial fibrillation** (AF), and guides the decision to start oral anticoagulation. It records eight weighted risk factors — **C**ongestive heart failure, **H**ypertension, **A**ge ≥ 75, **D**iabetes, prior **S**troke/TIA/thromboembolism, **V**ascular disease, **A**ge 65–74, and **S**ex **c**ategory (female) — sums a total of **0–9**, and maps the total to a risk band with anticoagulation guidance and an estimated annual stroke rate.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `Cha2ds2VascAssessment` TypeScript type — the eight criterion
  inputs (age and sex drive the age and sex-category points) plus context and
  identification fields.
- **Output shape:**
  ```ts
  gradeCha2ds2Vasc(data: Cha2ds2VascAssessment): {
    congestiveHeartFailurePoint: 0 | 1;
    hypertensionPoint: 0 | 1;
    agePoint: 0 | 1 | 2;
    diabetesPoint: 0 | 1;
    strokePoint: 0 | 2;
    vascularDiseasePoint: 0 | 1;
    sexPoint: 0 | 1;
    cha2ds2VascScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    riskBand: 'low' | 'intermediate' | 'high';
    annualStrokeRatePercent: number;
    anticoagulationRecommendation: 'none' | 'consider' | 'recommended';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive with weighted and mutually-exclusive terms; see spec §4.
  - CHF / hypertension / diabetes / vascular disease → 1 each when present
  - prior stroke / TIA / thromboembolism → 2 when present
  - age ≥ 75 → 2; age 65–74 → 1; age < 75 and ≥ 65 handled as a single band
    (never both)
  - female sex → 1
  - total 0–9 → risk band, with the edge cases: male total 0 = low, female total 1
    (sex point only) = low, male total 1 = intermediate, otherwise high
  - `annualStrokeRatePercent` is a fixed lookup indexed by total score
    (0→0.2, 1→1.3, 2→2.2, 3→3.2, 4→4.0, 5→6.7, 6→9.8, 7→9.6, 8→6.7, 9→15.2)
  - A missing enum input is treated as absent (`no`) and raises a
    data-completeness flag; missing `ageYears` scores 0 for age and flags.
- **Engine files:** `types.ts`, `utils.ts`, `cha2ds2vasc-rules.ts`,
  `cha2ds2vasc-grader.ts`, `flagged-issues.ts`.
- **Tests:** `cha2ds2vasc-grader.test.ts`, `cha2ds2vasc-rules.test.ts` — cover the
  age boundaries (64/65/74/75), mutually-exclusive age bands, the female-total-1
  low-risk case, the male-total-1 intermediate case, and every total 0–9 against
  the stroke-rate lookup.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
