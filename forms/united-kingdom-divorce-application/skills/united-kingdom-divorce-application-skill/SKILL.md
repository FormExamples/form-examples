---
name: united-kingdom-divorce-application-skill
description: "Explains what the United Kingdom Divorce Application form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United Kingdom Divorce Application

A completeness and time-gate checker for applying for a **divorce** (or the **dissolution of a civil partnership**) in England and Wales under the no-fault regime of the Divorce, Dissolution and Separation Act 2020. It follows a case through its three stages: the **application** (form D8 or online), the **conditional order** (form D84, formerly the decree nisi) and the **final order** (form D36, formerly the decree absolute), which is what ends the marriage and produces the divorce paperwork.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-kingdom-divorce-application-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
