# Agile Checklist — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `agile-checklist`

## 1. Purpose

A team / organisation self-assessment that audits **57 concrete behaviours**
of an agile way-of-working across three sections — **Teams**,
**Stakeholders**, and **Practices** — and produces a composite
**agility maturity level** (Ad-hoc / Initial / Developing / Mature /
Optimising), a per-section sub-score, weak-section flags, and a coaching
action plan.

The form is a single-page, 5-step wizard. Each item is answered as
**yes / no / not-applicable**. The engine computes the per-section
percentage of "yes" answers (over applicable items), the overall
maturity level, fired rules per section, and additional flags
(e.g. team-autonomy risk, stakeholder-trust risk, finished-work risk).

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

- **Per-item answer:** `yes`, `no`, or `not-applicable`.
- **Per-section score:** percentage of `yes` answers over applicable
  items. Items answered `not-applicable` are excluded from the
  denominator. Items left `unanswered` are treated as `no` for the
  composite computation but reported separately as the
  *answered-coverage* metric.
- **Per-section band:**
  - **High** = ≥ 75 % yes
  - **Mid**  = 50 – 74 % yes
  - **Low**  = < 50 % yes
- **Composite maturity** is the unweighted mean of the three section
  percentages:

| Maturity     | Mean % yes | Description |
| ---          | ---        | --- |
| Optimising   | ≥ 90 %     | Agile behaviours are pervasive; team continuously inspects and adapts. |
| Mature       | 75 – 89 %  | High adoption with deliberate refinement; few weak sections. |
| Developing   | 50 – 74 %  | Practices in place but uneven; one or two weak sections. |
| Initial      | 25 – 49 %  | Partial adoption; multiple weak sections; coaching needed. |
| Ad-hoc       | < 25 %     | Agility is largely aspirational; foundational coaching required. |

If fewer than 30 of the 57 items are answered (yes / no /
not-applicable) the composite maturity is reported as
**insufficient-data**.

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
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form agile-checklist` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check agile-checklist` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `agile-checklist.front-end-form-with-html.v1` (HTML)
  - `agile-checklist.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form agile-checklist
```
