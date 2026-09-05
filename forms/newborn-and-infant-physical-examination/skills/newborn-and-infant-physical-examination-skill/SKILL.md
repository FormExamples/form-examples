---
name: newborn-and-infant-physical-examination-skill
description: "Explains what the Newborn and Infant Physical Examination (NIPE) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Newborn and Infant Physical Examination (NIPE)

A UK national screening-programme examination that records a systematic head-to-toe physical assessment of a baby and classifies **four key screening components** — **eyes**, **heart**, **hips**, and **testes** (in boys) — as **Satisfactory**, **Refer**, or **Not examined**. It is performed **within 72 hours of birth** and repeated at the **6–8 week** infant review. The form is a structured **documentation and classification** instrument: it captures each observation, records a result per component, and computes an overall screening outcome together with the referral pathway and safety flags.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `newborn-and-infant-physical-examination-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
