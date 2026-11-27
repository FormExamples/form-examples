---
name: medical-renal-transplant-recipient-request-skill
description: "Explains what the Medical Renal Transplant Recipient Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Renal Transplant Recipient Request

A generic, jurisdiction-neutral **histocompatibility and immunogenetics request** that a transplant or dialysis clinician completes for a **kidney, kidney/pancreas or pancreas transplant recipient**. It asks a transplant immunology laboratory to perform HLA typing, crossmatching, HLA-antibody monitoring, rejection investigation, ABO-incompatible transplant monitoring or red-cell antibody follow-up, and tells the laboratory what it needs to interpret the result: organ required, sensitization history (transplants, transfusions, pregnancies), clinical information, mode of dialysis and dialysis unit.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-renal-transplant-recipient-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
