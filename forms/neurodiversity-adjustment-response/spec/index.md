# Neurodiversity Adjustment Response — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `neurodiversity-adjustment-response`

## 1. Purpose

A UK–aligned **workplace reasonable-adjustments response for neurodiversity**
that an employer completes in answer to a request for adjustments. It records the
overall decision and its rationale, which adjustments were agreed (and any
alternatives offered), the trial period and review date, support / resources /
responsibilities, and any escalation — then computes a **four-axis grade**
(outcome classification, legal / discrimination risk, response completeness, and
follow-up / review urgency) plus compliance-and-risk flags.

This form is the **response** half of the request/response pair with the sibling
[`neurodiversity-adjustment-request`](../../neurodiversity-adjustment-request)
form. It combines the ACAS reasonable-adjustment confirmation and review
templates, and is aligned with the Equality Act 2010 duty to make reasonable
adjustments.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, front-ends (form + dashboard, in HTML and
SvelteKit), and the Rust crate listed in §5. Out of scope: hosted deployment,
authentication, multi-tenancy, and legal advice (the legal-risk axis is a triage
signal, not a determination).

## 3. Scoring system

The engine grades each response on **four independent axes**, each anchored to a
recognised source. Axes are orthogonal: a complete, well-structured response can
still carry high legal risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Outcome classification** | Overall decision | fully-agreed / partially-agreed / alternative-offered / declined / deferred |
| **B. Legal / discrimination risk** | Reasonableness / Equality Act failure-to-adjust rules | ok / caution / high-risk |
| **C. Response completeness** | Mandatory-section checklist (decision, rationale, agreed detail, review, contact, effective date) | 0–100 % complete |
| **D. Follow-up / review urgency** | Review-and-escalation rules | none / review-scheduled / urgent-review / escalation-needed (+ target timeframe) |

Declining adjustments for a worker likely covered by the Equality Act 2010
without an adequate reasonableness justification or alternatives **auto-escalates**
Axis B to *high-risk* and raises the `discrimination-risk` flag regardless of the
other axes. Choose the least-alarming band only when no rule fires.

### The reasonableness test

Where any adjustment is declined, `decline_reason_category` records the
reasonableness factor: `not-reasonable`, `disproportionate-cost`,
`health-and-safety`, `operational-impact`, `alternative-provided`,
`insufficient-information`. A decline with no rationale, or no alternative where
one is feasible, is the principal driver of the legal-risk axis.

## 4. Inputs and outputs

**Inputs.** A typed response object whose shape mirrors the SQL schema in `sql/`
(8 migration files). Unanswered text and enum fields default to `''`; unanswered
numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: the four-axis result per §3,
`firedRules[]`, `flags[]`, a `recommendation`, and a structured
confirmation-and-review report. Rendered as HTML, exported as PDF, and
convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script)
are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md)
§Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form neurodiversity-adjustment-response` exits cleanly.
- `bin/test-sql-apply neurodiversity-adjustment-response` applies every migration
  on a fresh Postgres database.
- The scoring engine is pure (no side effects, no I/O) and unit-tested, with rule
  IDs identical across every front-end and the back-end.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)).
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 7. Compliance

- Equality Act 2010 — duty to make reasonable adjustments for disabled workers.
- ACAS Code of Practice and reasonable-adjustments guidance.
- UK GDPR / Data Protection Act 2018 — neurodivergence details are special
  category (health) data; process with consent and a lawful basis.
- ISO/IEC/IEEE 26514:2022.

## 8. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- ACAS — Reasonable adjustments: <https://www.acas.org.uk/reasonable-adjustments>
- Equality Act 2010: <https://www.legislation.gov.uk/ukpga/2010/15/contents>

## 9. Verify

```sh
bin/test-form neurodiversity-adjustment-response
```
