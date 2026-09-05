---
name: blood-test-result-skill
description: "Explains what the Blood Test Result form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Blood Test Result

A UK NHS–aligned **blood / pathology test result (report)** that a reporting clinician completes after a blood specimen has been analysed. It is the **result/report counterpart** to *Blood Test Request* (a referral / test order): where the request captures which tests should be done, this form records the quantitative **result values** the laboratory measured and a structured **interpretation**. It records the specimen and its condition, the clinical history, the analyte result values across the common panels (full blood count, urea & electrolytes / renal, liver function, inflammation, glycaemic, endocrine, haematinics, and coagulation), the overall result status with abnormal- and critical-value flags, the narrative and impression, and recommended follow-up — then computes a **four-axis interpretation grade** (result classification, abnormality severity / structured reporting, report completeness, and follow-up urgency) plus a set of safety-critical flags including an automatic **critical-result (panic-value) alert**. The output is a structured pathology report.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `blood-test-result-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
