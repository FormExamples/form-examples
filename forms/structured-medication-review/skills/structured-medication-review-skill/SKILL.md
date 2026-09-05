---
name: structured-medication-review-skill
description: "Explains what the Structured Medication Review (SMR) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Structured Medication Review (SMR)

A comprehensive, patient-centred medication review for people with problematic polypharmacy, frailty, one or more long-term conditions, or high-risk medicines. It records the patient's **problems and priorities**, **every medicine with its indication and adherence**, opportunities to **deprescribe**, the patient's **anticholinergic burden**, **high-risk-medicine** checks, **monitoring** that is due, and the **shared decisions and agreed actions** reached with the patient. It then reports a **review status** (Complete / Incomplete), a **polypharmacy and anticholinergic burden indicator**, and a set of **flags** that prompt action.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `structured-medication-review-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `SmrReview` TypeScript type — the review context and
  identification fields, problems / goals / plan fields, and a repeating
  `medicines: SmrMedicine[]` list.
- **Output shape:**
  ```ts
  gradeSmr(data: SmrReview): {
    medicineCount: number;
    regularMedicineCount: number;
    anticholinergicBurdenScore: number;      // sum of per-medicine ACB points
    polypharmacyBand: 'none' | 'polypharmacy' | 'hyperpolypharmacy';
    anticholinergicBand: 'low' | 'significant';
    burdenBand: 'low' | 'moderate' | 'high';
    reviewStatus: 'complete' | 'incomplete';
    stopFlags: StoppFlag[];
    startFlags: StartFlag[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** documentation with partial scoring. Sum each medicine's
  anticholinergic burden points (0–3) into `anticholinergicBurdenScore`; count
  regular medicines into `regularMedicineCount`. `burdenBand` is the worse of the
  polypharmacy band (`none` < 5, `polypharmacy` 5–9, `hyperpolypharmacy` ≥ 10) and
  the anticholinergic band (`significant` when ACB ≥ 3) — a max-band rule.
  `reviewStatus` is `complete` only when every required section is filled (see
  spec §4). STOPP / START flags are one per fired criterion. See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `smr-rules.ts`, `smr-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `smr-grader.test.ts`, `smr-rules.test.ts` — cover the polypharmacy
  boundaries (4/5, 9/10 regular medicines), the ACB boundary (2/3), the composite
  burden band, review-status completeness, and every flagged issue.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
