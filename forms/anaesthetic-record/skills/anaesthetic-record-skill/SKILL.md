---
name: anaesthetic-record-skill
description: "Explains what the Anaesthetic Record form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Anaesthetic Record

The intra-operative anaesthesia chart: the contemporaneous clinical record of an anaesthetic from pre-induction checks through emergence and recovery handover. It captures who was present, the pre-operative checks and WHO Safer Surgery Checklist status, ASA physical status and airway assessment, every drug and dose given (induction, maintenance, reversal, analgesia, antiemetics, vasoactive), the airway-management technique and findings, the monitoring modalities in use, the **timed physiological observations** (blood pressure, heart rate, SpO₂, end-tidal CO₂, temperature), fluids and estimated blood loss, any regional or neuraxial technique, intra-operative events and complications, and the recovery handover.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `anaesthetic-record-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
