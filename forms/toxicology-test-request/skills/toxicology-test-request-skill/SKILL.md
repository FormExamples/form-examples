---
name: toxicology-test-request-skill
description: "Explains what the Toxicology Test Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Toxicology Test Request

A UK NHS–aligned **toxicology / poisons / therapeutic-drug-level blood-test request (referral)** that a clinician completes to request one or more toxicology assays — paracetamol, salicylate, alcohol, drugs-of-abuse screen, lithium, digoxin, antiepileptic drug levels, carboxyhaemoglobin, heavy metals, or a named specific drug level. It records the requested assays, the clinical indication, the suspected agent and ingestion timing, whether the exposure is a deliberate overdose, and the requested urgency — then computes a **four-axis grading** (appropriateness, ingestion-timing validity, request completeness, and triage priority) plus a set of safety-critical flags. The output is a vetting report that supports the laboratory's and toxicology team's triage decision.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `toxicology-test-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
