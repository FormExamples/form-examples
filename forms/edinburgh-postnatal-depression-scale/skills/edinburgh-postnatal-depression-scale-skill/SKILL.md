---
name: edinburgh-postnatal-depression-scale-skill
description: "Explains what the Edinburgh Postnatal Depression Scale (EPDS) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Edinburgh Postnatal Depression Scale (EPDS)

A 10-item self-report screening questionnaire for **perinatal depression** — covering both the **antenatal** (during pregnancy) and **postnatal** (after birth) periods. The person completing it rates how they have felt **in the past seven days** across ten statements. Each item scores **0–3**, giving a total of **0–30**. A higher total indicates a greater likelihood of depression. A total of **≥ 10** suggests possible depression and **≥ 13** is a more specific threshold for likely depressive illness; either prompts **further clinical assessment**, not a diagnosis. Separately, **any positive response to item 10** (thoughts of self-harm) is a mandatory safety flag that requires **immediate risk assessment regardless of the total score**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `edinburgh-postnatal-depression-scale-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `EpdsAssessment` TypeScript type — the ten item responses plus
  context and identification fields. Each item response is the **already-scored**
  0–3 value; the reverse-scoring is applied when mapping the printed option to a
  score (see spec §4), so the stored `item1..item10` values are all 0–3 with
  higher = more symptomatic.
- **Output shape:**
  ```ts
  gradeEpds(data: EpdsAssessment): {
    itemScores: [number, number, number, number, number,
                 number, number, number, number, number]; // each 0..3
    totalScore: number;          // 0..30
    band: 'lower' | 'possible' | 'likely';
    selfHarmFlag: boolean;       // item10 > 0
    firedItems: FiredItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the ten 0–3 item scores to a total 0–30; the band
  is `>= 13` → `likely`, `>= 10` → `possible`, else `lower`. `selfHarmFlag` is
  `item10 > 0` and is computed independently of the total. See spec §4. Reverse
  scoring for items 3, 5, 6, 7, 8, 9, 10 is applied at option→score mapping
  (`score = 3 - optionIndex`); items 1, 2, 4 use `score = optionIndex`. A missing
  item response contributes 0 to the total and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `epds-rules.ts`, `epds-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `epds-grader.test.ts`, `epds-rules.test.ts` — cover the reverse-score
  mapping for each item, the band boundaries (9/10 and 12/13), the full 0–30
  range, and the item-10 safety flag for every non-zero response.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
