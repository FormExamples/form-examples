---
name: lumbar-puncture-test-result-skill
description: "Explains what the Lumbar Puncture Test Result form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Lumbar Puncture Test Result

A UK NHS–aligned **lumbar puncture (LP) / cerebrospinal-fluid (CSF) analysis result (report)** that a reporting clinician completes after a lumbar puncture has been performed. It is the **result/report counterpart** to *Lumbar Puncture Test Request* (a referral): where the request captures why CSF sampling and/or manometry should be done and whether it is safe, this form records what the analysis **found** and a structured **interpretation**. It records the manometry opening pressure, the CSF macroscopic appearance, the cell counts, the biochemistry (protein, glucose, CSF:serum glucose ratio, lactate), the microbiology (Gram stain, culture, PCR) and specialist tests (oligoclonal bands, xanthochromia spectrophotometry), the narrative and structured findings, the impression, and recommended follow-up — then computes a **four-axis interpretation grade** (result classification, abnormality severity / structured reporting, report completeness, and follow-up urgency) plus a set of safety-critical flags including an automatic **critical-result alert**. The output is a structured CSF analysis report.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `lumbar-puncture-test-result-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
