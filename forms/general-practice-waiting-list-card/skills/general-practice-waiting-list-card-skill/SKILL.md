---
name: general-practice-waiting-list-card-skill
description: "Explains what the General Practice Waiting List Card form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# General Practice Waiting List Card

A practitioner-completed administrative card that places a patient on a general practice waiting list and gives the patient a transparent, easy-to-use view of their referral, expected wait, and upcoming appointment(s).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `general-practice-waiting-list-card-maintainer-skill` instead.

## Scoring engine

- **Input shape:** `WaitingListCard` TypeScript type containing practitioner,
  patient, referral, waiting-list-entry, appointment, communication, and
  sign-off fields.
- **Output shape:**

  ```ts
  calculateWaitingTimeStatus(card: WaitingListCard): {
    waitingTimeStatus: 'within-target' | 'approaching-breach' | 'breached' | 'long-wait';
    clinicalPriority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
    daysWaited: number;
    weeksWaited: number;
    daysToTarget: number | null;
    daysToBreach: number | null;
    daysToAppointment: number | null;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```

- **Algorithm:** the worst-band finding sets the Waiting Time Status; the
  clinical priority drives the target wait used in the days-to-target /
  days-to-breach calculation.
- **Engine files:** `types.ts`, `utils.ts`, `priority-targets.ts`,
  `waiting-time-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `waiting-time-rules.test.ts`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
