# Sundowner Syndrome Assessment — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `sundowner-syndrome-assessment`

## 1. Purpose

Sundowner syndrome (sundowning) evaluation using Cohen-Mansfield Agitation Inventory (CMAI) scoring and Neuropsychiatric Inventory (NPI) for behavioural symptoms in elderly patients, particularly those with dementia.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

- **Instruments**: Cohen-Mansfield Agitation Inventory (CMAI) + Neuropsychiatric Inventory (NPI)
- **CMAI Range**: 29-203 (29 items scored 1-7)
- **NPI Range**: 0-144 (12 domains, frequency x severity)
- **Severity Categories**:
  - Mild: Occasional restlessness, redirectable, CMAI 29-45
  - Moderate: Daily episodes, requires intervention, CMAI 46-75
  - Severe: Aggressive behaviour, safety risk, CMAI 76-120
  - Critical: Self-harm risk, requires constant supervision, CMAI >120

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql-migrations/` (8 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: scoring result (per the instrument named in §3), `firedRules[]`, `additionalFlags[]`, and a clinical / administrative report. Rendered as HTML in the browser, exported as PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

Required artefacts and their current status:

| Subdirectory | Role |
| --- | --- |
| `sql-migrations` | source of truth |
| `xml-representations` | generated |
| `fhir-r5` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-form-with-html` | Lily contract |
| `front-end-form-with-svelte` | SvelteKit |
| `front-end-dashboard-with-html` | Lily contract |
| `front-end-dashboard-with-svelte` | SvelteKit + SVAR |
| `full-stack-with-loco-tera-htmx-alpine` | Rust + Loco |
| `full-stack-with-loco-tera-htmx-alpine-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form sundowner-syndrome-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily Design System contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- LocalStorage key `sundowner-syndrome-assessment.front-end-form-with-html.v1` (HTML) and
  `sundowner-syndrome-assessment.front-end-form-with-svelte.v1` (SvelteKit) preserve draft
  state across reloads.

## 7. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical Device. Form-specific classification (e.g. Class IIa where output drives clinical decisions) is recorded in [`index.md`](index.md) and [`AGENTS.md`](AGENTS.md) where it differs from the baseline.

## 8. References

- [`index.md`](index.md) — form description and scoring details
- [`AGENTS.md`](AGENTS.md) — agent instructions
- [`plan.md`](plan.md) — implementation roadmap
- [`tasks.md`](tasks.md) — task tracking
- [`/spec.md`](../../spec.md) — system-level specification
- [`/AGENTS.md`](../../AGENTS.md) — cross-cutting agent instructions

## 9. Verify

```sh
bin/test-form sundowner-syndrome-assessment
```
