---
name: epilepsy-review-skill
description: "Explains what the Epilepsy Annual Review form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Epilepsy Annual Review

A UK primary-care structured annual review for adults with epilepsy, aligned with **NICE NG217** (*Epilepsies in children, young people and adults*, 2022). It is a **documentation-completeness and control-classification** instrument rather than a numeric score: the clinician records what has happened since the last review — seizure type and frequency, seizure-free status, anti-seizure medication (ASM) and adherence and side effects, triggers, injuries and status epilepticus events, safety (driving, bathing, occupation), Sudden Unexpected Death in Epilepsy (SUDEP) risk discussion, valproate and pregnancy-prevention arrangements for women of childbearing potential, mental health, and the agreed care plan — and the engine classifies **seizure control**, grades **review completeness**, and raises **safety flags**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `epilepsy-review-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
