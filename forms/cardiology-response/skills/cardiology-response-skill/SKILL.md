---
name: cardiology-response-skill
description: "Explains what the Cardiology Response form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Cardiology Response

A UK NHS–aligned **cardiology response (consult reply)** that a cardiology clinician completes in answer to a cardiology referral. It is the **response/report counterpart** to [`cardiology-request`](../cardiology-request): where the request captures *why* a patient should be seen and *how urgently*, this form records *what the cardiology assessment found* and *what should happen next*. It records the consultation type, the clinical summary and examination, the investigations performed, the structured findings, the diagnosis, the key left-ventricular ejection fraction measurement, the management plan and follow-up, and critical-result communication — then computes a **four-axis interpretation grade** (response classification, condition severity / structured findings, response completeness, and follow-up urgency) plus a set of safety-critical flags including an automatic **critical-result alert**. The output is a structured cardiology response letter.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `cardiology-response-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
