---
name: glasgow-blatchford-bleeding-score-skill
description: "Explains what the Glasgow-Blatchford Bleeding Score (GBS) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Glasgow-Blatchford Bleeding Score (GBS)

A pre-endoscopy risk-stratification score for adults presenting with suspected **acute upper gastrointestinal bleeding**. It combines eight weighted parameters — blood urea, haemoglobin, systolic blood pressure, pulse, melaena, syncope, hepatic disease, and cardiac failure — into a single total of **0–23**. The score predicts the likelihood that a patient will need a clinical intervention (blood transfusion, endoscopic therapy, interventional radiology, or surgery) or die. Crucially, a score of **0** (some services use **≤ 1**) identifies very-low-risk patients who may be considered for outpatient management or early discharge without inpatient endoscopy; higher scores prompt admission and endoscopy.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `glasgow-blatchford-bleeding-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `GbsAssessment` TypeScript type — the eight parameter inputs
  plus context and identification fields (including `sex`, which selects the
  haemoglobin band table).
- **Output shape:**
  ```ts
  gradeGbs(data: GbsAssessment): {
    bloodUreaPoints: 0 | 2 | 3 | 4 | 6;
    haemoglobinPoints: 0 | 1 | 3 | 6;
    systolicBloodPressurePoints: 0 | 1 | 2 | 3;
    pulsePoint: 0 | 1;
    melaenaPoint: 0 | 1;
    syncopePoint: 0 | 2;
    hepaticDiseasePoint: 0 | 2;
    cardiacFailurePoint: 0 | 2;
    gbsScore: number; // 0..23
    riskBand: 'very-low' | 'low-moderate' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted additive — each parameter contributes points by band
  (see spec §4); the total 0–23 determines the risk band (`0` → `very-low`,
  `1–5` → `low-moderate`, `≥ 6` → `high`). Haemoglobin uses sex-specific bands.
  A missing numeric input contributes 0 points and raises a data-completeness
  flag; unknown sex falls back to the female haemoglobin table.
  - blood urea: <6.5→0, 6.5–7.9→2, 8.0–9.9→3, 10.0–24.9→4, ≥25.0→6
  - haemoglobin (men): ≥130→0, 120–129→1, 100–119→3, <100→6
  - haemoglobin (women): ≥120→0, 100–119→1, <100→6
  - systolic BP: ≥110→0, 100–109→1, 90–99→2, <90→3
  - pulse ≥100→1; melaena→1; syncope→2; hepatic disease→2; cardiac failure→2
- **Engine files:** `types.ts`, `utils.ts`, `gbs-rules.ts`, `gbs-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `gbs-grader.test.ts`, `gbs-rules.test.ts` — cover every band
  boundary (urea 6.4/6.5, 7.9/8.0, 9.9/10.0, 24.9/25.0; Hb 99/100, 119/120,
  129/130 for both sexes; SBP 89/90, 99/100, 109/110; pulse 99/100) and the
  total endpoints 0 and 23.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
