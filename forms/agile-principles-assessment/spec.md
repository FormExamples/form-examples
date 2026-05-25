# Agile Principles Assessment — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `agile-principles-assessment`

## 1. Purpose

A team / organisation self-assessment that scores adoption of the
**12 principles of the Agile Manifesto** (Beck *et al.*, 2001) and produces a
composite **agility maturity level** (Ad-hoc / Initial / Developing / Mature /
Optimising), a list of weak-principle flags, and a coaching action plan.

The form is a single-page, 14-step wizard. Each principle is scored on a
1–5 Likert scale (Strongly disagree → Strongly agree) with an optional
free-text comment. The engine computes the per-principle band, the overall
maturity level, fired rules, and additional flags (e.g. burnout risk,
technical-debt risk, lack of retrospective practice).

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

- **Per-principle Likert score:** 1 (Strongly disagree) … 5 (Strongly agree).
- **Per-principle band:**
  - **High** = 4–5 (principle is well-adopted)
  - **Mid**  = 3 (principle is partially adopted)
  - **Low**  = 1–2 (principle is weak or absent)
- **Composite maturity** is the unweighted mean of the 12 principle scores:

| Maturity     | Mean score | Description |
| ---          | ---        | --- |
| Optimising   | ≥ 4.50     | Agility is woven into daily work; team continuously inspects and adapts. |
| Mature       | 3.75–4.49  | High adoption with deliberate refinement; few weak principles. |
| Developing   | 3.00–3.74  | Practices in place but uneven; several principles are mid-band. |
| Initial      | 2.00–2.99  | Partial adoption; multiple weak principles; coaching needed. |
| Ad-hoc       | < 2.00     | Agility is largely aspirational; foundational coaching required. |

Unanswered principles are excluded from the mean. If fewer than 6 principles
are answered the composite maturity is reported as **insufficient-data**.

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql-migrations/` (7 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

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

- `bin/test-form agile-principles-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check agile-principles-assessment` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `agile-principles-assessment.front-end-form-with-html.v1` (HTML)
  - `agile-principles-assessment.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form agile-principles-assessment
```
