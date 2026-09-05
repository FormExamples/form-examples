---
name: curb-65-pneumonia-severity-score-skill
description: "Explains what the CURB-65 Pneumonia Severity Score form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# CURB-65 Pneumonia Severity Score

A clinician-facing severity assessment for adults with community-acquired pneumonia (CAP). The form records the five **CURB-65** criteria, computes a **0–5 severity score** (one point per criterion), assigns a **mortality-risk band**, and generates a signed report with a recommended disposition (home / outpatient, short-stay / supervised, or hospital admission with possible intensive-care review).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `curb-65-pneumonia-severity-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `Curb65Assessment` TypeScript type mirroring the SQL schema —
  encounter/clinician identification, patient identifier, date of birth, sex,
  and the raw criterion inputs.
- **Output shape:**
  ```ts
  calculateCurb65(data: Curb65Assessment): {
    curb65Score: 0 | 1 | 2 | 3 | 4 | 5;
    crb65Score: 0 | 1 | 2 | 3 | 4 | null; // populated when urea not measured
    criteria: {
      confusion: boolean;
      urea: boolean;
      respiratoryRate: boolean;
      bloodPressure: boolean;
      ageOver65: boolean;
    };
    riskBand: 'low' | 'intermediate' | 'high';
    recommendedDisposition:
      | 'home-outpatient'
      | 'short-stay-supervised'
      | 'hospital-admission';
    firedFlags: FiredFlag[];
  }
  ```
- **Algorithm:** one point each for Confusion (new), Urea > 7 mmol/L,
  Respiratory rate ≥ 30, Blood pressure (systolic < 90 or diastolic ≤ 60), and
  age ≥ 65; sum is 0–5. Band: 0–1 low, 2 intermediate, 3–5 high. Missing inputs
  score 0 and raise `incomplete-criterion`. When `ureaMeasured === false`,
  compute CRB-65 (0–4) and band it 0 low / 1–2 intermediate / 3–4 high. Pure
  function — no side effects, no I/O.
- **Engine files:**
  - `types.ts` — `Curb65Assessment`, `Curb65Result`, `FiredFlag`, enums.
  - `curb65-rules.ts` — the five criterion predicates and their thresholds.
  - `curb65-grader.ts` — `calculateCurb65()`; sums criteria, bands, disposition,
    CRB-65 fallback.
  - `flagged-issues.ts` — advisory flags (see §Flagged issues).
  - `utils.ts` — age-from-DOB derivation, unit coercion (BUN mg/dL → urea
    mmol/L), null-safe comparisons.
- **Tests:** `curb65-grader.test.ts`, `curb65-rules.test.ts` — cover every
  boundary (urea = 7 negative, RR = 30 positive, systolic = 90 negative,
  diastolic = 60 positive, age = 65 positive) and the CRB-65 fallback path.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
