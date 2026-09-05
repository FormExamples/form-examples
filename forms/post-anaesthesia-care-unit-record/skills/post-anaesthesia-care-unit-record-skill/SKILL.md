---
name: post-anaesthesia-care-unit-record-skill
description: "Explains what the Post-Anaesthesia Care Unit (PACU) Record form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Post-Anaesthesia Care Unit (PACU) Record

A structured recovery-room record for patients emerging from anaesthesia or sedation. It captures serial post-operative observations — airway, breathing, circulation, consciousness, oxygen saturation, pain, and post-operative nausea and vomiting (PONV) — and computes a **discharge-readiness score** that tells the recovery team when the patient is safe to leave the post-anaesthesia care unit (PACU, also called the recovery room).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `post-anaesthesia-care-unit-record-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `PacuRecord` TypeScript type — the five Aldrete parameter
  inputs, optional PADSS criterion inputs, airway/pain/PONV fields, plus context
  and identification fields.
- **Output shape:**
  ```ts
  gradePacu(data: PacuRecord): {
    activityScore: 0 | 1 | 2;
    respirationScore: 0 | 1 | 2;
    circulationScore: 0 | 1 | 2;
    consciousnessScore: 0 | 1 | 2;
    oxygenSaturationScore: 0 | 1 | 2;
    aldreteTotal: number;            // 0..10
    readinessBand: 'not-ready' | 'discharge-ready';
    padssTotal: number | null;       // 0..10 when day-surgery criteria supplied
    padssStreetFit: boolean | null;
    firedParameters: FiredParameter[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each Aldrete parameter contributes 0–2; the total
  0–10 determines the readiness band. Discharge-ready requires
  `aldreteTotal >= 9` **and** `oxygenSaturationScore === 2`. PADSS is summed
  independently when supplied (`padssStreetFit = padssTotal >= 9`). See spec §4.
  A missing parameter contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `aldrete-rules.ts`,
  `aldrete-grader.ts`, `flagged-issues.ts`.
- **Tests:** `aldrete-grader.test.ts`, `aldrete-rules.test.ts` — cover the
  discharge boundary (total 8/9), the SpO₂-gated discharge case (total 9 with
  oxygen-saturation score < 2 stays not-ready), every parameter's 0/1/2 levels,
  and the PADSS ≥ 9 boundary.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
