# United Kingdom Lasting Power of Attorney for Financial Decisions — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `united-kingdom-lasting-power-of-attorney-for-financial-decisions`

## 1. Purpose

A digital implementation of the Office of the Public Guardian (OPG) form
**LP1F — Lasting power of attorney for property and financial affairs**. The
LPA is a statutory deed under the Mental Capacity Act 2005 by which a donor
("the donor") appoints one or more attorneys to make decisions about their
property and financial affairs. Once registered by the OPG it is the
legal instrument that lets attorneys run bank accounts, sell property,
manage investments, claim benefits, and pay bills on behalf of the donor.

This project captures the LP1F deed, the four LPC continuation sheets, and
the OPG registration application (sections 12–15 of LP1F) as a single-page,
15-step wizard. The output is a structured record that can be exported as
PDF for wet-signature, FHIR R5 Bundle for health-record integration where
relevant, XML / Protobuf / TypeSpec for system-to-system exchange, and a
validation report flagging legal blockers and risk-of-failure conditions
before the deed is signed or sent for registration.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

See [`index.md`](index.md) for the scoring instrument, ranges, and categories applicable to this form.

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql-migrations/` (19 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

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

- `bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check united-kingdom-lasting-power-of-attorney-for-financial-decisions` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `united-kingdom-lasting-power-of-attorney-for-financial-decisions.front-end-form-with-html.v1` (HTML)
  - `united-kingdom-lasting-power-of-attorney-for-financial-decisions.front-end-form-with-svelte.v1` (SvelteKit)

## 7. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical Device. Form-specific classification (e.g. Class IIa where output drives clinical decisions) is recorded in [`index.md`](index.md) and [`AGENTS.md`](AGENTS.md) where it differs from the baseline.

## 8. References

- [`index.md`](index.md) — form description and scoring details
- [`AGENTS.md`](AGENTS.md) — agent instructions
- [`plan.md`](plan.md) — implementation roadmap
- [`tasks.md`](tasks.md) — task tracking
- [`/spec.md`](../../spec.md) — system-level specification
- [`/AGENTS.md`](../../AGENTS.md) — cross-cutting agent instructions
- [`../AGENTS-front-end-html.md`](../AGENTS-front-end-html.md) — Lily HTML contract
- [`../AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 9. Verify

```sh
bin/test-form united-kingdom-lasting-power-of-attorney-for-financial-decisions
```
