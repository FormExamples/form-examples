---
name: model-for-end-stage-liver-disease-score-skill
description: "Explains what the Model for End-Stage Liver Disease (MELD) Score form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Model for End-Stage Liver Disease (MELD) Score

A laboratory-based severity calculator for chronic liver disease. It takes a small number of objective blood results — **total bilirubin**, **INR**, **serum creatinine**, and (for MELD-Na) **serum sodium** — applies a validated weighted logarithmic formula, and produces an integer score of **6–40** that maps to an estimated **3-month mortality**. A higher score indicates more severe liver dysfunction and greater short-term mortality risk. The score is used to stratify disease severity and to prioritize candidates for liver transplantation.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `model-for-end-stage-liver-disease-score-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
