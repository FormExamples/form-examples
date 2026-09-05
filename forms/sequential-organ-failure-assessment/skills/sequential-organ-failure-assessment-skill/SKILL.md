---
name: sequential-organ-failure-assessment-skill
description: "Explains what the Sequential Organ Failure Assessment (SOFA) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Sequential Organ Failure Assessment (SOFA)

A UK NHS–aligned, clinician-driven **Sequential Organ Failure Assessment (SOFA)** score that records **objective physiological and laboratory findings** for six organ systems and computes an organ-dysfunction score for each system (0–4), a **total SOFA score** (0–24), the change from a prior assessment (**delta-SOFA**), a mortality-risk band, and a set of safety-critical flags. The output is a signed clinician report suitable for the intensive-care record and for sepsis screening under the Sepsis-3 definition.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `sequential-organ-failure-assessment-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `SofaAssessment` TypeScript type containing six organ-system
  sub-groups (respiration, coagulation, liver, cardiovascular, cns, renal) plus
  context and baseline fields.
- **Output shape:**
  ```ts
  gradeSofa(data: SofaAssessment): {
    subScores: {
      respiration: 0|1|2|3|4|null;
      coagulation: 0|1|2|3|4|null;
      liver: 0|1|2|3|4|null;
      cardiovascular: 0|1|2|3|4|null;
      cns: 0|1|2|3|4|null;
      renal: 0|1|2|3|4|null;
    };
    totalSofa: number;            // 0..24
    deltaSofa: number | null;     // totalSofa - baselineSofaTotal
    mortalityBand: 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';
    sepsis3: boolean;
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  };
  ```
- **Algorithm:** map each system's input(s) to a 0–4 sub-score using the
  published thresholds; cardiovascular and renal take the maximum of their two
  criteria; respiration sub-scores 3–4 require respiratory support; sum to a
  total 0–24; derive delta-SOFA from the baseline; band the total for mortality;
  set the Sepsis-3 flag when infection is suspected and delta-SOFA ≥ 2. A missing
  input yields a `null` sub-score and an incomplete-assessment flag — never guess.
- **Engine files:**
  - `types.ts` — `SofaAssessment`, `SofaResult`, `FiredRule`, `FlaggedIssue`.
  - `sofa-rules.ts` — the six per-system threshold tables and their mappers.
  - `sofa-grader.ts` — orchestration: sub-scores → total → delta → band → sepsis.
  - `flagged-issues.ts` — severe single-organ, multi-organ, rising-SOFA, high-risk.
  - `utils.ts` — unit conversion (kPa↔mmHg, µmol/L↔mg/dL), safe numeric parsing.
- **Tests:** `sofa-grader.test.ts` (boundary cases per system + totals + delta).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
