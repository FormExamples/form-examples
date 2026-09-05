---
name: newborn-blood-spot-screening-skill
description: "Explains what the Newborn Blood Spot Screening form measures, its scoring instrument and categories, and how to read its example/persona fixtures. Use when a user asks what this form does, how its score or grade is computed, or wants a worked example for it. For cross-form concepts shared across the monorepo, use form-examples-skill instead."
---

# Newborn Blood Spot Screening

A record of the newborn blood spot (heel-prick) screening test offered to every baby in the UK, normally taken around **day 5** of life (counting the day of birth as day 0). A few drops of blood are collected onto a filter-paper card and screened for **nine conditions**: **sickle cell disease (SCD)**, **cystic fibrosis (CF)**, **congenital hypothyroidism (CHT)**, and six **inherited metabolic diseases (IMDs)** — **phenylketonuria (PKU)**, **medium-chain acyl-CoA dehydrogenase deficiency (MCADD)**, **maple syrup urine disease (MSUD)**, **isovaleric acidaemia (IVA)**, **glutaric aciduria type 1 (GA1)**, and **homocystinuria (pyridoxine unresponsive) (HCU)**.

This skill is the end-user-facing guide to this specific form; for cross-form concepts and terminology shared across the monorepo, use `form-examples-skill`. For implementation work on this form's code, use `newborn-blood-spot-screening-maintainer-skill` instead.

## Scoring

See [`../../index.md`](../../index.md) and [`../../spec/index.md`](../../spec/index.md) for the scoring instrument, ranges, and categories this form uses.

## Worked examples

- [`../../examples/personas.json`](../../examples/personas.json) — hand-authored realistic scenarios with the engine's exact expected output for each one.
- [`../../examples/assessment.json`](../../examples/assessment.json) — a type-defaulted example of the form's data shape (blank/typed, not a realistic scenario).

## Learn more

- [`../../index.md`](../../index.md) — full form description and scoring details.
- [`../../spec/index.md`](../../spec/index.md) — the living domain spec (the behavioural contract this form's code must satisfy).
- [`../../doc/`](../../doc/) — clinical/regulatory reference documentation this form is based on.
