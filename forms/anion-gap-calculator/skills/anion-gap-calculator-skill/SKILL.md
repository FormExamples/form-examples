---
name: anion-gap-calculator-skill
description: "Explains what the Anion Gap Calculator form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Anion Gap Calculator

A point-of-care calculator that derives the **serum anion gap** from a routine electrolyte panel, corrects it for the patient's serum albumin, and classifies the result as **low**, **normal**, or **high**. A high anion gap is the key laboratory signature of a **high anion gap metabolic acidosis (HAGMA)** and prompts a structured search for the underlying cause. The calculator does not diagnose; it turns four or five numbers into a computed gap, a corrected gap, a classification band, and a set of flagged issues that direct further investigation.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `anion-gap-calculator-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
