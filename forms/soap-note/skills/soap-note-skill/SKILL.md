---
name: soap-note-skill
description: "Explains what the SOAP Note form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# SOAP Note

A structured clinical progress note that records a single patient encounter in the four canonical **SOAP** sections — **Subjective**, **Objective**, **Assessment**, and **Plan** — and grades the note for **documentation completeness** rather than computing a clinical risk score. The engine checks the note against a set of required SOAP components, classifies it as **Complete**, **Partial**, or **Incomplete**, reports a completeness percentage, and raises safety flags (for example: an assessment or plan is missing, red-flag symptoms are documented without a corresponding plan, no safety-netting advice is recorded, or abnormal vitals are not addressed).

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `soap-note-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
