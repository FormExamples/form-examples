---
name: recognition-of-stroke-in-the-emergency-room-skill
description: "Explains what the Recognition Of Stroke In the Emergency Room (ROSIER) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Recognition Of Stroke In the Emergency Room (ROSIER)

A bedside stroke-recognition instrument for adults presenting acutely to the emergency department with suspected stroke or transient ischaemic attack. It first excludes two common stroke mimics — **loss of consciousness / syncope** and **seizure activity** — each subtracting a point, then records five new, acute-onset neurological signs — **asymmetric facial weakness**, **asymmetric arm weakness**, **asymmetric leg weakness**, **speech disturbance**, and **visual field defect** — each adding a point. The signed total runs from **−2 to +5**. A total **greater than 0** indicates that **stroke is likely** and the acute stroke pathway should be activated; a total of **0 or below** makes stroke unlikely but does **not** exclude it. Blood glucose must be measured and hypoglycaemia corrected before the score is interpreted, because hypoglycaemia is a treatable stroke mimic.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `recognition-of-stroke-in-the-emergency-room-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `RosierAssessment` TypeScript type — the two mimic criteria,
  five neurological-sign inputs, the blood-glucose precondition, plus context
  and identification fields.
- **Output shape:**
  ```ts
  gradeRosier(data: RosierAssessment): {
    rosierScore: number;          // -2..+5
    band: 'stroke-unlikely' | 'stroke-likely';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** signed additive — each mimic contributes 0 or −1, each sign
  contributes 0 or +1; the total −2..+5 determines the band (`> 0` →
  `stroke-likely`). See spec §4. The `> 0` threshold is strict (exactly 0 is
  `stroke-unlikely`).
  - loss of consciousness / syncope = yes → −1
  - seizure activity = yes → −1
  - asymmetric facial weakness = yes → +1
  - asymmetric arm weakness = yes → +1
  - asymmetric leg weakness = yes → +1
  - speech disturbance = yes → +1
  - visual field defect = yes → +1
- **Engine files:** `types.ts`, `utils.ts`, `rosier-rules.ts`,
  `rosier-grader.ts`, `flagged-issues.ts`.
- **Tests:** `rosier-grader.test.ts`, `rosier-rules.test.ts` — cover the `> 0`
  threshold boundary (total 0 vs +1), the extremes (−2 and +5), and the
  hypoglycaemia flag at glucose 3.4 / 3.5.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
