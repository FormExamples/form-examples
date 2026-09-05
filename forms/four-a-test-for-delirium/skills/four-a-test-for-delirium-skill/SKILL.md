---
name: four-a-test-for-delirium-skill
description: "Explains what the 4AT — Rapid Delirium and Cognitive-Impairment Screen form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# 4AT — Rapid Delirium and Cognitive-Impairment Screen

The **4AT** is a validated, rapid bedside screening instrument for delirium and possible cognitive impairment. It is designed to be completed in under two minutes by any registered health or social care professional, with no special training and no equipment. It combines a brief test of **alertness**, a four-item abbreviated mental test (**AMT4**), a test of **attention** (reciting the months of the year backwards), and an assessment of **acute change or fluctuating course**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `four-a-test-for-delirium-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `FourATAssessment` TypeScript type mirroring the SQL schema —
  four enum item responses plus identification and context fields.
- **Output shape:**
  ```ts
  scoreFourAT(data: FourATAssessment): {
    item1Score: 0 | 4;         // alertness
    item2Score: 0 | 1 | 2;     // AMT4
    item3Score: 0 | 1 | 2;     // attention (months backwards)
    item4Score: 0 | 4;         // acute change / fluctuating course
    totalScore: number;        // 0..12
    interpretationBand: 'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium';
    firedRules: FiredRule[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** sum-of-items. Per-item point map:
  - Item 1 (alertness): `normal` → 0, `mildTransient` → 0, `abnormal` → 4.
  - Item 2 (AMT4): `noMistakes` → 0, `oneMistake` → 1,
    `twoOrMoreOrUntestable` → 2.
  - Item 3 (attention): `sevenOrMore` → 0,
    `startsButUnderSevenOrRefuses` → 1, `untestable` → 2.
  - Item 4 (acute change): `no` → 0, `yes` → 4.
  - `totalScore = item1 + item2 + item3 + item4` (0–12).
  - Band: `>= 4` → `possibleDelirium`; `1–3` → `possibleCognitiveImpairment`;
    `0` → `unlikely`.
- **Engine files:** `types.ts`, `utils.ts`, `fourat-rules.ts`,
  `fourat-grader.ts`, `flagged-issues.ts`.
- **Tests:** `fourat-grader.test.ts`, `fourat-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
