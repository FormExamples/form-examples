# Neurodiversity Adjustment Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `neurodiversity-adjustment-request`

## 1. Purpose

A UK–aligned **workplace reasonable-adjustments request for neurodiversity** that
a worker (or a manager on their behalf) completes to ask their employer for
adjustments at work. It records the worker's neurodivergent profile, the
functional difficulties they experience mapped to the ACAS functional areas, the
specific adjustments requested across the ACAS adjustment categories, any
supporting evidence, and the current impact and urgency — then computes a
**four-axis grade** (Equality Act 2010 eligibility, impact / wellbeing risk,
request completeness, and handling priority) plus compliance-and-wellbeing flags.

This form is the **request** half of the request/response pair with the sibling
[`neurodiversity-adjustment-response`](../../neurodiversity-adjustment-response)
form, and is aligned with ACAS reasonable-adjustments guidance and the Equality
Act 2010 duty to make reasonable adjustments.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, front-ends (form + dashboard, in HTML and
SvelteKit), and the Rust crate listed in §5. Out of scope: hosted deployment,
authentication, multi-tenancy, and any medical diagnosis of neurodivergence
(this is a workplace-adjustments record, not a clinical assessment).

## 3. Scoring system

The engine grades each request on **four independent axes**, each anchored to a
recognised source. Axes are orthogonal: a request can strongly engage the
Equality Act duty yet still be incomplete, and a low-eligibility request can
still be urgent on wellbeing grounds.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Eligibility** | Equality Act 2010 disability test (substantial + long-term adverse effect) | likely-covered / possibly-covered / unclear |
| **B. Impact / wellbeing** | Impact and absence-risk escalation rules | ok / caution / high-risk |
| **C. Completeness** | Mandatory-field checklist (conditions, difficulties, adjustments, tasks affected, consent) | 0–100 % complete (+ missing fields) |
| **D. Priority** | Impact and absence-risk escalation rules | routine / soon / urgent (+ target timeframe) |

A worker at risk of sickness absence / burnout, or reporting severe impact,
drives the impact axis and **auto-escalates** the priority tier regardless of the
other axes. Choose the least-urgent band only when no rule fires.

### ACAS functional areas → adjustment categories

| Functional difficulty | Typical adjustment category | Example adjustments (ACAS) |
| --- | --- | --- |
| Concentration / focus | Working environment; equipment | Quiet workspace, noise-cancelling headphones, standing desk, breaks |
| Reading / written communication | Equipment; communication | Screen reader, speech-to-text, clear-step instructions |
| Organisation / time management | Communication; support | Visual planners, check-ins, smaller tasks |
| Sensory overload | Working environment; policy | Quiet space, screen filters, softer-material uniform |
| Balance / coordination | Equipment; working environment | Specialist keyboard / mouse, clutter-free workspace |
| Fatigue / burnout | Working arrangements | Flexible hours, phased return, remote / hybrid |

## 4. Inputs and outputs

**Inputs.** A typed request object whose shape mirrors the SQL schema in `sql/`
(8 migration files). Unanswered text and enum fields default to `''`; unanswered
numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: the four-axis result per §3,
`firedRules[]`, `flags[]`, a `recommendation`, and a structured request report.
Rendered as HTML in the browser, exported as PDF, and convertible to FHIR R5
Bundle, XML, JSON, CSV, or TSV.

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

- `bin/test-form neurodiversity-adjustment-request` exits cleanly.
- `bin/test-sql-apply neurodiversity-adjustment-request` applies every migration
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
- ACAS — Reasonable adjustments for neurodiversity: <https://www.acas.org.uk/reasonable-adjustments/adjustments-for-neurodiversity>
- Equality Act 2010: <https://www.legislation.gov.uk/ukpga/2010/15/contents>

## 9. Verify

```sh
bin/test-form neurodiversity-adjustment-request
```
