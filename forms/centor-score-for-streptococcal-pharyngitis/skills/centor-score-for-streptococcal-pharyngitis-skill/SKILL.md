---
name: centor-score-for-streptococcal-pharyngitis-skill
description: "Explains what the Centor Score for Streptococcal Pharyngitis form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Centor Score for Streptococcal Pharyngitis

A clinical prediction tool that estimates the likelihood that an acute sore throat is caused by **group A beta-haemolytic streptococcus (GABHS, "strep")** and therefore the likelihood that antibiotics would help. It records four objective **Centor criteria**, each scoring 1 point when present — **tonsillar exudate**, **tender anterior cervical lymphadenopathy**, **fever (temperature > 38 °C or a history of fever)**, and **absence of cough** — for a Centor total of **0–4**. The **McIsaac modification** adds an **age modifier** (+1 for ages 3–14, 0 for 15–44, −1 for ≥ 45) to give a modified score of **−1 to 5** that adjusts for the age-related probability of streptococcal infection.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `centor-score-for-streptococcal-pharyngitis-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `CentorAssessment` TypeScript type — the four criterion
  inputs, optional measured temperature, patient age, plus context,
  identification, and red-flag fields.
- **Output shape:**
  ```ts
  gradeCentor(data: CentorAssessment): {
    tonsillarExudatePoint: 0 | 1;
    tenderNodesPoint: 0 | 1;
    feverPoint: 0 | 1;
    coughAbsentPoint: 0 | 1;
    centorScore: 0 | 1 | 2 | 3 | 4;
    ageModifier: -1 | 0 | 1;
    mcIsaacScore: number; // -1..5
    riskBand: 'low' | 'moderate' | 'high';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each criterion contributes 0 or 1; the Centor total
  0–4 plus the McIsaac age modifier gives the modified score −1 to 5, which
  determines the risk band (`≤ 1` → low, `2–3` → moderate, `4–5` → high). See
  spec §4.
  - tonsillar exudate = yes → 1
  - tender anterior cervical nodes = yes → 1
  - fever = yes, or measured temperature > 38 °C → 1
  - cough absent = yes → 1
  - age 3–14 → +1; 15–44 → 0; ≥ 45 → −1 (missing age → 0)
- **Engine files:** `types.ts`, `utils.ts`, `centor-rules.ts`,
  `centor-grader.ts`, `flagged-issues.ts`.
- **Tests:** `centor-grader.test.ts`, `centor-rules.test.ts` — cover the fever
  boundary (38.0/38.1 °C), each age-modifier boundary (2/3, 14/15, 44/45 years),
  every Centor total 0–4, and the full McIsaac range −1 to 5.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
