---
name: biopsy-test-result-skill
description: "Explains what the Biopsy Test Result form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Biopsy Test Result

A UK NHS–aligned **biopsy histopathology result (report)** that a reporting pathologist completes after a tissue or cytology specimen has been examined. It is the **result/report counterpart** to *Biopsy Test Request* (a referral): where the request captures why a biopsy should be done and how to triage it, this form records what the specimen **showed** and a structured **interpretation**. It records the specimen and procedure, the clinical history, the macroscopic and microscopic descriptions, the definitive diagnosis with malignancy status, tumour type, histological grade, resection-margin status and lymphovascular invasion, immunohistochemistry and molecular results, the impression, and recommended follow-up — then computes a **four-axis interpretation grade** (result classification, abnormality severity / structured reporting, report completeness, and follow-up urgency) plus a set of safety-critical flags including an automatic **critical-result alert**. The output is a structured histopathology report.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `biopsy-test-result-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
