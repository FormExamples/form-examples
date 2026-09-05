---
name: tumor-marker-test-result-skill
description: "Explains what the Tumor Marker Test Result form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Tumor Marker Test Result

A UK NHS–aligned **serum tumour-marker test result (report)** that a reporting clinician completes after one or more serum tumour markers have been measured. It is the **result/report counterpart** to *Tumor Marker Test Request* (a referral): where the request captures which markers to order and whether the request is appropriate, this form records the **measured result values** and a structured **interpretation**. It records the performed assay and specimen condition, the clinical history and any known cancer site, the measured value of each marker, a comparison with the previous value and trend, the interpretive narrative and impression, and recommended follow-up — then computes a **four-axis interpretation grade** (result classification, abnormality severity / structured reporting, report completeness, and follow-up urgency) plus a set of safety-critical flags including an automatic **critical-result alert**. The output is a structured laboratory-medicine report.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `tumor-marker-test-result-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
