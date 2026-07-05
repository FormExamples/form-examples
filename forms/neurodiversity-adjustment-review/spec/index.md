# Neurodiversity Adjustment Review — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `neurodiversity-adjustment-review`

## 1. Purpose

A UK–aligned **workplace reasonable-adjustments review for neurodiversity**: a
manager / HR contact reviews with the worker whether the agreed adjustments are
still working. It records the per-category effectiveness of the adjustments in
place, the worker's feedback and outcomes, any changes arising, and the next
review date — then computes a **four-axis grade** (overall effectiveness,
wellbeing risk, review completeness, next-step urgency) plus review flags. It is
the review third of the ACAS request / confirmation / review cycle, alongside
[`neurodiversity-adjustment-request`](../../neurodiversity-adjustment-request)
and [`neurodiversity-adjustment-response`](../../neurodiversity-adjustment-response).

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, front-ends (form + dashboard, in HTML and
SvelteKit), and the Rust crate. Out of scope: hosted deployment, authentication,
multi-tenancy, and any clinical assessment.

## 3. Scoring system

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Effectiveness** | Per-category effectiveness mix | effective / partially-effective / ineffective / not-yet-assessed |
| **B. Wellbeing risk** | Satisfaction, wellbeing change, barriers, escalation | ok / caution / high-risk |
| **C. Completeness** | Mandatory-field checklist | 0–100 % complete |
| **D. Next-step urgency** | Failing-adjustment / escalation rules | none / review-scheduled / adjust-now / escalate (+ timeframe) |

Any adjustment reported not-working, a dissatisfied worker, declining wellbeing,
or an escalation drives the wellbeing-risk axis and next-step urgency and raises
the matching flag, regardless of the other axes.

## 4. Inputs and outputs

**Inputs.** A typed review object mirroring the SQL schema in `sql/` (8 migration
files). Unanswered text / enum fields default to `''`; unanswered numeric / date
fields default to `null`.

**Outputs.** A grading object: the four-axis result, `firedRules[]`, `flags[]`, a
`recommendation`, and a structured review report. Rendered as HTML, exported as
PDF, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

`sql` (source of truth) · `xml` · `fhir` · `protobuf` · `openapi` (generated) ·
`front-end-with-html` · `front-end-with-svelte` · `back-end-with-loco` ·
`back-end-with-loco-setup` (generated). Generated artefacts are never
hand-edited; re-run the generators after schema changes.

## 6. Acceptance criteria

- `bin/test-form neurodiversity-adjustment-review` exits cleanly.
- `bin/test-sql-apply neurodiversity-adjustment-review` applies every migration.
- The scoring engine is pure and unit-tested, with rule IDs identical across
  every front-end and the back-end.
- The HTML and SvelteKit front-ends conform to the Lily headless contracts.
- The Rust crate builds and tests pass.

## 7. Compliance

Equality Act 2010; ACAS Code of Practice and reasonable-adjustments guidance;
UK GDPR / Data Protection Act 2018 (special category health data); ISO/IEC/IEEE 26514:2022.

## 8. References

- [`index.md`](../index.md) — form description and scoring details
- ACAS — Reasonable adjustments: <https://www.acas.org.uk/reasonable-adjustments>
- Equality Act 2010: <https://www.legislation.gov.uk/ukpga/2010/15/contents>

## 9. Verify

```sh
bin/test-form neurodiversity-adjustment-review
```
