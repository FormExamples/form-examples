---
name: learning-disability-annual-health-check-skill
description: "Explains what the Learning Disability Annual Health Check form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Learning Disability Annual Health Check

A UK primary-care **annual health check** for people aged **14 or over** on a GP practice's learning-disability (LD) register. It is a comprehensive, whole-person review that captures reasonable adjustments and communication needs, physical health, health-screening and immunization uptake, a medication review including **STOMP** (Stopping Over-Medication with Psychotropics), mental health and behaviour, syndrome-specific checks, and carer and social circumstances — and produces a **Health Action Plan** the person can keep.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `learning-disability-annual-health-check-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
