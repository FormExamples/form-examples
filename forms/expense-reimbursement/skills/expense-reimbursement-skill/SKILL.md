---
name: expense-reimbursement-skill
description: "Explains what the Expense Reimbursement form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Expense Reimbursement

A **workplace expense reimbursement claim** that a worker (for example a clinician) completes after spending their own money on a work-related expense and wanting to be repaid. It records who is claiming and who approves, each expense line (date, category, merchant, amount, VAT, how it was paid, receipt), the business purpose, how the worker wants to be repaid, and the worker's declarations — then computes a **three-axis grade** (policy compliance, claim completeness, and the approval tier the claim needs) plus a set of fraud-prevention and policy flags. The output is a structured claim that an approver can accept, query, escalate or reject.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `expense-reimbursement-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
