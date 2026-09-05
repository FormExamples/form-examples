---
name: bowel-cancer-screening-with-faecal-immunochemical-test-skill
description: "Explains what the Bowel Cancer Screening with Faecal Immunochemical Test (FIT) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Bowel Cancer Screening with Faecal Immunochemical Test (FIT)

A documentation and result-classification form for the **NHS Bowel Cancer Screening Programme (BCSP)**. It records the outcome of a home **faecal immunochemical test (FIT)** kit: the participant's screening eligibility, whether the kit was returned and adequate, and the measured **faecal haemoglobin concentration** in **micrograms of haemoglobin per gram of faeces (µg Hb/g)**. A result-classification engine compares the concentration against the programme threshold, assigns a **result class** (negative / positive / spoilt), sets the **management action** (routine recall / colonoscopy referral / repeat kit), validates completeness, and raises flagged issues.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `bowel-cancer-screening-with-faecal-immunochemical-test-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
