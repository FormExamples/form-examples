---
name: hospital-daily-monitoring-checklist-skill
description: "Explains what the Hospital Daily Monitoring Checklist form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Hospital Daily Monitoring Checklist

A hospital administrator's / medical superintendent's **daily rounds checklist** that audits **97 concrete operational checkpoints** across **22 hospital areas** — OPD, Causality (Casualty), Dispensary, HR attendance, Ambulance, Diagnostic Facility (Pathology Lab + Radio Imaging), Store, OT/ICU, Labour Room, Wards, House Keeping, Water Supply, Electric Supply, Diet, Hospital Signage, Fire Fighting Equipment, Patient Feedback, Mortuary, Hospital Furniture, Hospital Waste Management, Infection Control Protocols, and Record Room.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `hospital-daily-monitoring-checklist-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
