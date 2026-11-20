---
name: united-states-property-tax-exemption-application-skill
description: "Explains what the United States Property Tax Exemption Application form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# United States Property Tax Exemption Application

A county or state application for a **residential property tax homestead exemption** and related relief: senior, disability, disabled-veteran and circuit-breaker relief, plus assessment-appeal basics. The applicant gives the parcel number, ownership and occupancy as of the assessment date, the exemptions claimed, household income, the proof documents, the filing date and a signed declaration under penalty for a false statement.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `united-states-property-tax-exemption-application-maintainer-skill` instead.

## Scoring engine

- **Input:** `PropertyTaxApplication` - applicant, property, exemptions, income, documents, filing, appeal, declaration.
- **Output:** `gradeApplication(d)` returns `{ eligibilityClass, filingDeadline, filedLate, qualifyingExemptions, rules }`; `detectFlaggedIssues(d)` returns the flags (a split engine).
- **Classification:** likely-ineligible beats incomplete beats likely-eligible (spec section 4.2).
- **State rules:** edit `STATE_RULES` in `front-end-with-html/js/rules.js` and the Svelte port `src/lib/engine/rules.ts` together, update `spec/index.md` section 4.1 and `doc/index.md`, then `bin/test-personas united-states-property-tax-exemption-application --update`.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
