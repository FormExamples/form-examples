---
name: medical-operation-note-skill
description: "Explains what the Medical Operation Note form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Operation Note

A surgical operation note ("op note") is the legal contemporaneous record written by the operating team immediately after a procedure. It documents who did what, what was found, what was used, what was left behind, what went wrong, and what the post-operative plan is. It supports continuity of care, anaesthetic recovery, ward handover, theatre auditing, and medico-legal defence.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-operation-note-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `OperationNote` TypeScript type containing
  identification, team, diagnoses, procedures, anaesthesia, approach,
  technique, materials, drains, specimens, counts, EBL, complications,
  and post-op plan sub-types.
- **Output shape:**
  ```ts
  calculateOperationGrade(data: OperationNote): {
    compositeRisk: 'routine' | 'complicated' | 'high-risk' | 'critical';
    clavienDindoGrade: '0' | 'I' | 'II' | 'IIIa' | 'IIIb' | 'IVa' | 'IVb' | 'V';
    asaPhysicalStatus: 1 | 2 | 3 | 4 | 5 | 6 | null;
    bloodLossBand: 'minimal' | 'mild' | 'moderate' | 'severe' | 'massive';
    countsAgreed: boolean;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** max-grade — the worst finding sets the composite grade;
  Routine is the default when no rules fire.
- **Engine files:** `types.ts`, `utils.ts`, `composite-grader.ts`,
  `clavien-dindo-rules.ts`, `blood-loss-rules.ts`, `count-rules.ts`,
  `never-event-rules.ts`, `anaesthetic-event-rules.ts`,
  `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `clavien-dindo-rules.test.ts`,
  `count-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
