---
name: lifeguard-certification-checklist-skill
description: "Explains what the Lifeguard Certification Checklist form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Lifeguard Certification Checklist

Pool / beach lifeguard certification checklist aligned with the RLSS UK National Pool Lifeguard Qualification (NPLQ) and International Life Saving Federation (ILSF) competencies, covering supervision and scanning, physical fitness, rescue scenarios, CPR / AED, first aid, and legal / regulatory knowledge.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `lifeguard-certification-checklist-maintainer-skill` instead.

## Scoring system

- **Instrument**: Lifeguard Competency Verification Checklist (RLSS NPLQ / ILSF-aligned)
- **Range**: Pass / Fail / Needs Development
- **Critical competencies** (any failure → Fail): timed swim, unconscious-casualty rescue, spinal handling, CPR with compressions to depth/rate, AED delivery, scanning effectiveness
- **Engine files**: `types.ts`, `lifeguard-grader.ts`, `rules.ts`, `flagged-issues.ts`, `utils.ts`
- **Test file**: `lifeguard-grader.test.ts`

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
