---
name: agile-checklist-skill
description: "Explains what the Agile Checklist form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Agile Checklist

A team / organization self-assessment that audits **57 concrete behaviours** of an agile way-of-working across three sections — **Teams**, **Stakeholders**, and **Practices** — and produces a composite **agility maturity level** (Ad-hoc / Initial / Developing / Mature / Optimizing), a per-section sub-score, weak-section flags, and a coaching action plan.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `agile-checklist-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `AgileChecklist` TypeScript type containing the
  respondent identification block plus 57 `ItemResponse` entries
  (`{ answer: 'yes' | 'no' | 'not-applicable' | '' }`), grouped by
  section.
- **Output shape:**
  ```ts
  calculateMaturity(data: AgileChecklist): {
    answeredCount: number;            // 0..57
    teamsPercent: number | null;      // 0..100, null if section unanswered
    stakeholdersPercent: number | null;
    practicesPercent: number | null;
    overallPercent: number | null;    // unweighted mean of the three sections
    maturity: 'optimising' | 'mature' | 'developing' | 'initial'
            | 'ad-hoc' | 'insufficient-data';
    sectionBands: {
      teams: 'high' | 'mid' | 'low' | 'unanswered';
      stakeholders: 'high' | 'mid' | 'low' | 'unanswered';
      practices: 'high' | 'mid' | 'low' | 'unanswered';
    };
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** per-section percentage of `yes` answers over
  applicable items (`not-applicable` excluded from denominator);
  unweighted mean of the three section percentages produces the
  composite. Thresholds in `index.md`.
- **Engine files:** `types.ts`, `factory.ts`, `items.ts` (the 57 items
  with section, ordinal, slug, text), `maturity-rules.ts`,
  `flagged-issues.ts`, `composite-grader.ts`.
- **Tests:** `composite-grader.test.ts`, `maturity-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
