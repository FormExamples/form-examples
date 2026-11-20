---
name: united-states-vehicle-bill-of-sale-skill
description: "Explains what the United States Vehicle Bill of Sale form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Vehicle Bill of Sale

A bill of sale for a private-party sale of a motor vehicle in the United States. One continuous single-page wizard collects the sale (state, date, price, payment, sales-tax basis), the seller and buyer, the vehicle (year, make, model, body type, VIN, title brand), the federal odometer disclosure statement (49 CFR Part 580), the as-is clause, title and lien status, notarization where the state requires it, and the post-sale release of liability and buyer title application. The engine classifies the sale as **complete**, **incomplete**, or **risk flagged** and raises prioritized flags. It is documentation support, not legal advice: the state motor vehicle agency decides what it accepts.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-vehicle-bill-of-sale-maintainer-skill` instead.

## Scoring engine

A completeness and risk-classification engine, not a numeric score. The HTML
engine is the reference: `rules.js` (predicates, `STATE_RULES`, VIN check digit,
odometer exemption), `grader.js` (`validateBillOfSale` returns the class plus
`odometerExempt` and `stateRuleKnown`), `flags.js` (`detectFlaggedIssues`, 18
flags). The Svelte engine in `front-end-with-svelte/src/lib/engine/` is a
TypeScript port with vitest tests that also run every persona. Keep
`createDefaultBillOfSale()` in `engine/defaults.ts`, not in the
`$app/environment`-importing store.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
