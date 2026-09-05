---
name: zarit-burden-interview-skill
description: "Explains what the Zarit Burden Interview (ZBI) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Zarit Burden Interview (ZBI)

A caregiver self-report questionnaire that measures the subjective **burden** experienced by an informal carer looking after a person with dementia, chronic illness, or long-term disability. The carer rates **22 items** describing the emotional, physical, social, and financial strain of caregiving, each on a **0–4** frequency scale (0 = never … 4 = nearly always). The item ratings sum to a total of **0–88**, which is mapped to a burden band from *little or no burden* to *severe burden*. A high total is a prompt to arrange **carer support and respite** and to **screen the carer for depression and anxiety**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `zarit-burden-interview-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `ZaritAssessment` TypeScript type — the context and subject
  fields plus the 22 item ratings (`item1`…`item22`, each `0 | 1 | 2 | 3 | 4 |
  null`) and the `instrumentForm` selector (`'zbi22' | 'zbi12'`).
- **Output shape:**
  ```ts
  gradeZarit(data: ZaritAssessment): {
    firedItems: FiredItem[];
    totalScore: number;              // 0..88 (ZBI-22) or 0..48 (ZBI-12)
    maxScore: 88 | 48;
    burdenBand:
      | 'little-or-none' | 'mild-to-moderate' | 'moderate-to-severe' | 'severe'
      | 'lower' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — sum the answered ratings over the active item set
  (all 22, or the 12 short-form items `1,2,3,6,9,10,11,12,17,20,21,22`); a
  missing rating contributes 0 and raises a data-completeness flag. The total
  maps to a burden band (ZBI-22: 0–21 / 22–40 / 41–60 / 61–88; ZBI-12: <17 /
  ≥17). See spec §4.
- **Engine files:** `types.ts`, `utils.ts`, `zarit-rules.ts`, `zarit-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `zarit-grader.test.ts`, `zarit-rules.test.ts` — cover each band
  boundary (21/22, 40/41, 60/61 for ZBI-22; 16/17 for ZBI-12), the all-0 minimum
  and all-4 maximum, missing-item handling, and both instrument forms.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
