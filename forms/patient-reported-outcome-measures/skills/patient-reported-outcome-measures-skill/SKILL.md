---
name: patient-reported-outcome-measures-skill
description: "Explains what the Patient-Reported Outcome Measures form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Patient-Reported Outcome Measures

A battery of **four independent, validated patient-reported outcome instruments**, commonly administered together in spine-surgery outcomes research: the **SF-36v2 Health Survey**, the **Neck Disability Index (NDI)**, the **modified Japanese Orthopedic Association score (mJOA)**, and **EuroQol 5-Dimensions (EQ-5D-3L)**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `patient-reported-outcome-measures-maintainer-skill` instead.

## Scoring engine

```ts
computeSf36(data: Sf36Response): {
  pf: number|null; rp: number|null; bp: number|null; gh: number|null;
  vt: number|null; sf: number|null; re: number|null; mh: number|null;
  pcsApprox: number|null; mcsApprox: number|null;
}
computeNdi(data: NdiResponse): { rawScore: number; answeredSections: number; percentageScore: number|null; band: 'no-disability'|'mild'|'moderate'|'severe'|'complete'|'' }
computeMjoa(data: MjoaResponse): { totalScore: number|null; band: 'mild'|'moderate'|'severe'|'' }
computeEq5d(data: Eq5dResponse): { healthStateDescriptor: string; ukIndexValue: number|null; vasScore: number|null }
```

All four are pure functions, no side effects. See
[`spec/index.md`](./spec/index.md) for the exact recode tables,
domain-to-item mappings, and band thresholds — **implement exactly as
documented there**, including the explicit note that SF-36
`pcsApprox`/`mcsApprox` are non-licensed simplified approximations,
not the trademarked QualityMetric norm-based PCS/MCS.

- **Engine files:** `types.ts`, `sf36-rules.ts`, `ndi-rules.ts`,
  `mjoa-rules.ts`, `eq5d-rules.ts`, `factory.ts`.
- **Tests:** one test file per instrument, each with at least: an
  all-best-answers case, an all-worst-answers case, and one
  partially-answered case. For EQ-5D specifically, test the "11111"
  state → index exactly 1.0, and at least one state with a level-3
  dimension to confirm the N3 term applies.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
