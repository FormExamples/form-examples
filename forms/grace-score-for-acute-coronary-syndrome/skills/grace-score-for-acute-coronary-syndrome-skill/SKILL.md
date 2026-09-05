---
name: grace-score-for-acute-coronary-syndrome-skill
description: "Explains what the GRACE Score for Acute Coronary Syndrome form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# GRACE Score for Acute Coronary Syndrome

The **GRACE** (Global Registry of Acute Coronary Events) score is a validated risk-stratification tool for adults presenting with an **acute coronary syndrome** (ACS), used above all in **non-ST-elevation ACS** (NSTEMI and unstable angina). It combines eight admission variables — **age**, **heart rate**, **systolic blood pressure**, **serum creatinine**, **Killip class**, **cardiac arrest at admission**, **ST-segment deviation**, and **elevated cardiac enzymes / troponin** — into a **weighted point total** that maps to an estimated **in-hospital** and **6-month all-cause mortality** risk, and to a **Low / Intermediate / High** risk category.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `grace-score-for-acute-coronary-syndrome-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `GraceAssessment` TypeScript type — the eight GRACE variable
  inputs (plus creatinine unit) and the context and identification fields.
- **Output shape:**
  ```ts
  gradeGrace(data: GraceAssessment): {
    gracePoints: number;                       // weighted total, ~0..350+
    inHospitalMortalityBand: 'low' | 'intermediate' | 'high';
    sixMonthMortalityBand: 'low' | 'intermediate' | 'high';
    riskCategory: 'low' | 'intermediate' | 'high';
    invasiveStrategy: string;                  // recommendation keyed on riskCategory
    firedContributors: FiredContributor[];     // per-variable point contribution
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted regression point model (see spec §4) — each variable
  maps through a **weighted, banded lookup** (not a simple sum of yes/no items);
  the points are summed into a total, which is read against the in-hospital
  (≤108 / 109–140 / >140) and 6-month (≤88 / 89–118 / >118) mortality bands. The
  overall `riskCategory` is the worse of the two (max-band rule). Serum
  creatinine is normalized to mg/dL (µmol/L ÷ 88.4) before banding. A missing
  numeric input contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `grace-rules.ts`, `grace-grader.ts`,
  `flagged-issues.ts`.
  - `grace-rules.ts` holds the named per-band point lookup tables (age, heart
    rate, systolic BP, creatinine, Killip, and the three yes/no contributors)
    plus the mortality-band thresholds.
  - `utils.ts` holds creatinine unit normalization and band-lookup helpers.
- **Tests:** `grace-grader.test.ts`, `grace-rules.test.ts` — cover each band
  boundary (age, heart rate, systolic BP, creatinine; Killip I–IV; each yes/no
  contributor), the mortality-band boundaries (108/109, 140/141, 88/89,
  118/119), creatinine unit normalization, and the max-band rule.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
