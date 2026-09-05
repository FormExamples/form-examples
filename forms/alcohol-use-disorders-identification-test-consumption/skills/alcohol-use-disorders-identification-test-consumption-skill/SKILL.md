---
name: alcohol-use-disorders-identification-test-consumption-skill
description: "Explains what the Alcohol Use Disorders Identification Test — Consumption (AUDIT-C) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Alcohol Use Disorders Identification Test — Consumption (AUDIT-C)

A brief, three-item alcohol screening questionnaire for adults. It records the three consumption items of the World Health Organization's Alcohol Use Disorders Identification Test — **frequency of drinking**, **typical quantity** (in UK units), and **frequency of heavy episodic drinking** — scores each **0–4**, and sums a total of **0–12**. A total of **≥ 5** indicates increasing- or higher-risk drinking and prompts a full 10-item AUDIT and a brief intervention.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `alcohol-use-disorders-identification-test-consumption-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `AuditcAssessment` TypeScript type — the three item inputs
  (each an integer 0–4) plus context and identification fields.
- **Output shape:**
  ```ts
  gradeAuditc(data: AuditcAssessment): {
    frequencyOfDrinkingPoint: 0 | 1 | 2 | 3 | 4;
    typicalQuantityPoint: 0 | 1 | 2 | 3 | 4;
    heavyEpisodeFrequencyPoint: 0 | 1 | 2 | 3 | 4;
    auditcScore: number;            // 0..12
    riskBand: 'lower' | 'increasing' | 'higher' | 'possible-dependence';
    firedItems: FiredItem[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each item contributes its own 0–4 point value; the
  total 0–12 determines the risk band (`≥ 5` → positive screen). See spec §4. A
  missing item input contributes 0 points and raises a data-completeness flag.
  - `auditcScore >= 11` → `possible-dependence`
  - `auditcScore >= 8`  → `higher`
  - `auditcScore >= 5`  → `increasing`
  - otherwise           → `lower`
- **Engine files:** `types.ts`, `utils.ts`, `auditc-rules.ts`,
  `auditc-grader.ts`, `flagged-issues.ts`.
- **Tests:** `auditc-grader.test.ts`, `auditc-rules.test.ts` — cover the
  positive-screen boundary (total 4/5), each band boundary (5, 8, 11), and the
  minimum and maximum totals (0 and 12).

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
