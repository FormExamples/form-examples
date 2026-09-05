---
name: estimated-glomerular-filtration-rate-calculator-skill
description: "Explains what the Estimated Glomerular Filtration Rate (eGFR) Calculator form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Estimated Glomerular Filtration Rate (eGFR) Calculator

A formula calculator that estimates the **glomerular filtration rate (GFR)** — the volume of blood the kidneys filter each minute — from a single serum **creatinine** measurement together with the patient's **age** and **sex**. It returns an **eGFR in mL/min/1.73 m²** and classifies the result into a **chronic kidney disease (CKD) G-stage** (G1–G5). The calculator does not diagnose kidney disease; it standardizes a laboratory result into a staged estimate that prompts monitoring, medication-dose review, or referral.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `estimated-glomerular-filtration-rate-calculator-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
