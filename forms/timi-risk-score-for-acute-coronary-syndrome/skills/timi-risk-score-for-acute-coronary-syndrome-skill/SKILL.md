---
name: timi-risk-score-for-acute-coronary-syndrome-skill
description: "Explains what the TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI)

A bedside risk-stratification tool for adults presenting with unstable angina (UA) or non-ST-elevation myocardial infarction (NSTEMI). It records **seven clinical criteria**, awards **1 point** for each criterion that is present, sums a total of **0–7**, and maps that total to the **14-day risk of a composite adverse event** — all-cause death, new or recurrent myocardial infarction, or severe recurrent ischaemia requiring **urgent revascularization**. A higher score identifies patients who benefit most from an **early invasive strategy** and more intensive antithrombotic therapy.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `timi-risk-score-for-acute-coronary-syndrome-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `TimiAssessment` TypeScript type — the seven criterion inputs
  (age plus the risk-factor and clinical yes/no flags) plus context and
  identification fields.
- **Output shape:**
  ```ts
  gradeTimi(data: TimiAssessment): {
    agePoint: 0 | 1;
    riskFactorCount: 0 | 1 | 2 | 3 | 4 | 5;
    riskFactorPoint: 0 | 1;
    knownCadPoint: 0 | 1;
    aspirinPoint: 0 | 1;
    anginaPoint: 0 | 1;
    stDeviationPoint: 0 | 1;
    cardiacMarkerPoint: 0 | 1;
    timiScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    riskBand: 'low' | 'intermediate' | 'high';
    fourteenDayRiskPercent: number;
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the seven criteria contributes 0 or 1; the
  total 0–7 determines the band (`≤ 1` low, `2–4` intermediate, `≥ 5` high) and a
  lookup of the 14-day composite-event risk. See spec §4. Criterion 2 fires when
  **≥ 3** of the five risk factors are `yes`. A missing input counts as absent
  (0 points) and raises a data-completeness flag.
  - age ≥ 65 → 1
  - ≥ 3 of {hypertension, hypercholesterolaemia, diabetes, current smoking,
    family history of premature CAD} → 1
  - known CAD (stenosis ≥ 50%) → 1
  - aspirin in prior 7 days → 1
  - ≥ 2 anginal episodes in 24 h → 1
  - ST deviation ≥ 0.5 mm → 1
  - positive cardiac marker (troponin / CK-MB) → 1
- **Engine files:** `types.ts`, `utils.ts`, `timi-rules.ts`, `timi-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `timi-grader.test.ts`, `timi-rules.test.ts` — cover the age
  boundary (64/65), the risk-factor threshold (2/3 factors), each band
  transition (1→2, 4→5), and every total 0–7 with its mapped 14-day risk.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
