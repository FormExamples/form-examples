---
name: sleep-study-test-result-skill
description: "Explains what the Sleep Study Test Result form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Sleep Study Test Result

A UK NHS–aligned **sleep study / polysomnography result (report)** that a reporting clinician completes after a sleep investigation has been performed. It is the **result/report counterpart** to *Sleep Study Test Request* (a referral): where the request captures why a study should be done, this form records what the study **found** and a structured **interpretation**. It records the performed study type and adequacy, the clinical history, the key quantitative metrics (recording and sleep time, apnoea-hypopnoea index, oxygen desaturation index, minimum and time-below-90% SpO2, mean heart rate), the OSA severity band, the narrative and structured findings, the impression, and recommended follow-up — then computes a **four-axis interpretation grade** (result classification, abnormality severity / structured reporting, report completeness, and follow-up urgency) plus a set of safety-critical flags including an automatic **critical-result alert**. The output is a structured sleep-study report.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `sleep-study-test-result-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
