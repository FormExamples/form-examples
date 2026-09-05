---
name: mental-health-act-assessment-skill
description: "Explains what the Mental Health Act Assessment form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Mental Health Act Assessment

A formal assessment under the **UK Mental Health Act 1983** (as amended by the Mental Health Act 2007) to determine whether a person with a mental disorder should be **detained in hospital** for assessment or treatment, admitted informally, or supported in the community. It records the coordinated assessment by an **Approved Mental Health Professional (AMHP)** together with the required medical recommendations from **two registered medical practitioners** (at least one of whom is **Section 12 approved**), documents the **statutory criteria** that must be satisfied, captures the **nearest relative / consultee** position, and records the **recommended section** and the **outcome**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `mental-health-act-assessment-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
