---
name: child-pugh-score-skill
description: "Explains what the Child-Pugh Score (Child-Turcotte-Pugh) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Child-Pugh Score (Child-Turcotte-Pugh)

A prognostic score for the severity of chronic liver disease, principally cirrhosis. It grades **five parameters** — total bilirubin, serum albumin, INR (or prothrombin time), ascites, and hepatic encephalopathy — on a 1-to-3 scale, sums a total of **5-15**, and assigns a **class (A, B, or C)** that maps to estimated one- and two-year survival and to peri-operative mortality risk. The score guides prognosis, transplant assessment, and surgical-risk stratification.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `child-pugh-score-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `ChildPughAssessment` TypeScript type — the five parameter
  inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeChildPugh(data: ChildPughAssessment): {
    bilirubinPoint: 1 | 2 | 3;
    albuminPoint: 1 | 2 | 3;
    coagulationPoint: 1 | 2 | 3;
    ascitesPoint: 1 | 2 | 3;
    encephalopathyPoint: 1 | 2 | 3;
    childPughScore: number;              // 5..15
    childPughClass: 'A' | 'B' | 'C';
    oneYearSurvival: string;             // banded estimate
    twoYearSurvival: string;             // banded estimate
    surgicalRisk: 'low' | 'moderate' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the five parameters maps to 1, 2, or 3 points
  against the thresholds in spec §4; the total 5-15 bands into class A/B/C. Each
  class carries fixed survival and surgical-risk estimates. See spec §4. A
  missing parameter cannot be scored, so the engine treats an incomplete
  parameter set as a partial score and raises a data-completeness flag.
  - bilirubin: `< 34` → 1, `34-50` → 2, `> 50` µmol/L → 3
  - albumin: `> 35` → 1, `28-35` → 2, `< 28` g/L → 3
  - coagulation (INR): `< 1.7` → 1, `1.7-2.3` → 2, `> 2.3` → 3
  - ascites: none → 1, mild → 2, moderate-to-severe → 3
  - encephalopathy: none → 1, grade 1-2 → 2, grade 3-4 → 3
- **Engine files:** `types.ts`, `utils.ts`, `child-pugh-rules.ts`,
  `child-pugh-grader.ts`, `flagged-issues.ts`.
- **Tests:** `child-pugh-grader.test.ts`, `child-pugh-rules.test.ts` — cover each
  threshold boundary (bilirubin 34/50, albumin 28/35, INR 1.7/2.3), each ordinal
  grade, and every class boundary (6/7, 9/10).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
