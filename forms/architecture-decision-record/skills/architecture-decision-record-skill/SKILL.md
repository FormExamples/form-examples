---
name: architecture-decision-record-skill
description: "Explains what the Architecture Decision Record (Tyree & Akerman) form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Architecture Decision Record (Tyree & Akerman)

A structured form for capturing an Architecture Decision Record (ADR) using the Jeff Tyree & Art Akerman template ("Architecture Decisions: Demystifying Architecture", IEEE Software, 2005). The form walks an architect through a single-page, 16-step wizard, captures all 14 sections of the canonical template plus authorship metadata, and produces an ADR document as Markdown, FHIR R5–style structured JSON, and XML.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `architecture-decision-record-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- No `examples/personas.json` yet for this form — see `form-examples-maintainer-skill` for how personas are authored.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
