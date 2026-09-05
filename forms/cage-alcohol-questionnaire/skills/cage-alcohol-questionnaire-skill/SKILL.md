---
name: cage-alcohol-questionnaire-skill
description: "Explains what the CAGE Alcohol Questionnaire form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# CAGE Alcohol Questionnaire

A brief four-item screening questionnaire for alcohol misuse and dependence in adults. It asks four lifetime yes/no questions — remembered by the mnemonic **CAGE** (**C**ut down, **A**nnoyed, **G**uilty, **E**ye-opener) — scores each answer 0 or 1, sums a total of **0–4**, and flags a **clinically significant** result when the score is **≥ 2**. A positive screen is a prompt for further assessment of drinking, not a diagnosis of an alcohol-use disorder.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `cage-alcohol-questionnaire-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `CageAssessment` TypeScript type — the four criterion inputs
  plus context and identification fields.
- **Output shape:**
  ```ts
  gradeCage(data: CageAssessment): {
    cutDownPoint: 0 | 1;
    annoyedPoint: 0 | 1;
    guiltyPoint: 0 | 1;
    eyeOpenerPoint: 0 | 1;
    cageScore: 0 | 1 | 2 | 3 | 4;
    resultBand: 'negative' | 'low' | 'positive';
    positiveItems: PositiveItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each item scores 1 for `'yes'` and 0 otherwise; the
  total 0–4 determines the result band (`≥ 2` → `positive`, `1` → `low`,
  `0` → `negative`). See spec §4. An unanswered item (`''`) contributes 0 points
  and raises a data-completeness flag.
  - cutDown == 'yes' → 1
  - annoyed == 'yes' → 1
  - guilty == 'yes' → 1
  - eyeOpener == 'yes' → 1
- **Engine files:** `types.ts`, `utils.ts`, `cage-rules.ts`, `cage-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `cage-grader.test.ts`, `cage-rules.test.ts` — cover each item's
  yes/no contribution, every total 0–4, and the threshold boundary (score 1 vs 2).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
