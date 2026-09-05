---
name: issue-tracker-skill
description: "Explains what the Issue tracker form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Issue tracker

A general-purpose issue tracker that borrows the structure of a clinical **SOAP-style assessment** and applies it to any reportable problem — software defects, operational incidents, safety events, project blockers, customer complaints, and so on. Each issue is captured through a single-page, step-by-step questionnaire (nine SOAP-style sections) and graded with seven independent scoring scales drawn from medicine, aviation, civil engineering, and software-product practice. The output is a signed report with a composite priority and a list of safety-critical flags, suitable for triage and remediation tracking.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `issue-tracker-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `IssueTrackerAssessment` TypeScript type containing the
  nine SOAP-style sub-types plus reporter and metadata fields.
- **Output shape:**
  ```ts
  gradeIssue(data: IssueTrackerAssessment): {
    scoreByPriorityRank: number;        // 1, 2, 3, ...
    scoreBySeverityOfImpact: 1 | 2 | 3 | 4 | 5;
    scoreByMagnitudeOfDamage: number;   // 1..10
    scoreByHarmGrade: 0 | 1 | 2 | 3 | 4;
    scoreByFailureCondition: 'A' | 'B' | 'C' | 'D' | 'E';
    scoreByMoscowRequirement: 1 | 2 | 3 | 4;
    scoreByFrequencyPercent: number;    // 0..100
    compositePriority: 'low' | 'moderate' | 'high' | 'critical';
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst single-dimension finding sets the
  composite. The composite is `low` only when *every* score is in its
  low band.
- **Engine files:** `types.ts`, `utils.ts`, `priority-rules.ts`,
  `severity-rules.ts`, `magnitude-rules.ts`, `harm-rules.ts`,
  `failure-rules.ts`, `moscow-rules.ts`, `frequency-rules.ts`,
  `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, plus one per scoring rule file.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
