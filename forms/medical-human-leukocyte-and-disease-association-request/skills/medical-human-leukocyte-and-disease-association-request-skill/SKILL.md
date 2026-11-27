---
name: medical-human-leukocyte-and-disease-association-request-skill
description: "Explains what the Medical Human Leukocyte and Disease Association Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Medical Human Leukocyte and Disease Association Request

A generic **HLA typing request for disease association or drug-hypersensitivity screening**, completed by a consultant or general practitioner. It asks a laboratory to type specific HLA alleles linked to a condition (HLA-A29, B27, B51, B*57:01, DR15/DQ6, DQ2/DQ8, DQA1*05, or another named association), with free-text clinical details, report destination and a high-risk-sample flag.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `medical-human-leukocyte-and-disease-association-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
