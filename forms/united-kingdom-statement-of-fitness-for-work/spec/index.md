# United Kingdom Statement of Fitness for Work — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `united-kingdom-statement-of-fitness-for-work`

## 1. Purpose

A digital implementation of the UK Statement of Fitness for Work — commonly
known as the **fit note** or **Med 3** — issued by a healthcare professional
(doctor, nurse, occupational therapist, pharmacist, or physiotherapist) to
record the impact of a patient's health condition on their fitness for work.

The fit note supports the patient to stay in or return to work, and acts as
evidence for Statutory Sick Pay (SSP) and health-related benefits. It is the
statutory replacement of the older "sick note" introduced by the UK Department
for Work and Pensions (DWP) in 2010 and significantly revised in 2022 to
broaden the set of authorised issuers and to enable digital delivery.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The fit note has no validated clinical score; instead, the implementation
applies a rule-based **policy compliance and triage grader** that captures
the structural choices made on the form and flags policy non-compliance.

### Fitness for work category

| Category | Driver |
| --- | --- |
| `not_fit` | clinician selected "you are not fit for work" |
| `may_be_fit` | clinician selected "you may be fit for work" with adaptations advice |

Per DWP policy 3.2, the fit note cannot certify "fit for work" — that branch
is intentionally absent.

### Adaptation intensity (only when `may_be_fit`)

| Intensity | Driver |
| --- | --- |
| `none` | "may be fit" selected but no tick boxes — invalid combination |
| `light` | 1 tick box selected (e.g. phased return only) |
| `moderate` | 2 tick boxes selected |
| `substantial` | 3 tick boxes selected |
| `comprehensive` | all 4 tick boxes selected |

### Period compliance

| Compliance | Driver |
| --- | --- |
| `self_cert_range` | period < 7 calendar days — fit note not required |
| `compliant` | period within DWP rules |
| `exceeds_initial_max` | > 3 months in the first 6 months of the condition (policy 3.3) |
| `long_term` | period > 4 weeks — Access to Work referral suggested |
| `very_long_term` | period > 6 months — chronic condition pathway suggested |

### Overall recommendation

| Recommendation | When |
| --- | --- |
| `standard` | routine fit note, no policy concerns |
| `refer_occupational_health` | substantial / comprehensive adaptations or repeated absence |
| `refer_access_to_work` | disability or long-term limitation |
| `refer_employment_advisor` | return to work after extended absence |
| `review_for_validity` | one or more invalidity flags fired |

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql-migrations/` (9 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

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

- `bin/test-form united-kingdom-statement-of-fitness-for-work` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check united-kingdom-statement-of-fitness-for-work` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `united-kingdom-statement-of-fitness-for-work.front-end-form-with-html.v1` (HTML)
  - `united-kingdom-statement-of-fitness-for-work.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form united-kingdom-statement-of-fitness-for-work
```
