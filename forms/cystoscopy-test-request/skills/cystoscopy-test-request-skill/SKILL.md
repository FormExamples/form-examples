---
name: cystoscopy-test-request-skill
description: "Explains what the Cystoscopy Test Request form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Cystoscopy Test Request

A UK NHS–aligned **cystoscopy (bladder endoscopy) request (referral)** that a clinician completes to request a cystoscopic examination of the lower urinary tract. It records the requested procedure, the clinical indication and specific question, relevant history, symptoms and red flags, bleeding-risk factors, and the requested urgency — then computes a **four-axis grading** (appropriateness, cancer-pathway urgency, request completeness, and pre-procedure risk) plus a set of safety-critical flags. The output is a vetting report that supports the urology department's triage and booking decision.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `cystoscopy-test-request-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
