---
name: outpatient-outcome-skill
description: "Explains what the Outpatient Outcome Report form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Outpatient Outcome Report

Structured outpatient outcome report documenting encounter details, operational efficiency, clinical outcome, patient-reported outcome measures (PROMs), patient-reported experience measures (PREMs), and follow-up plan, with a four-domain composite grade (Outpatient Outcome Composite Grade, OOCG).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `outpatient-outcome-maintainer-skill` instead.

## Scoring system

- **Instrument**: Outpatient Outcome Composite Grade (OOCG)
- **Domains**: Clinical, PROM, PREM, Operational (each A–E; overall = worst)
- **PROM sub-instruments**: EQ-5D-5L, Global Rating of Change (GRC), PROMIS Global Health v1.2
- **PREM sub-instrument**: Friends and Family Test (FFT)
- **Operational sub-instruments**: NHS Attendance Outcome code, wait-time vs target, modality

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
