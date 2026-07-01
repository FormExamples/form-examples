# United States HIPAA Authorization Form — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `united-states-hipaa-authorization-form`

## 1. Purpose

A United States Health Insurance Portability and Accountability Act (HIPAA)
authorization form. This is a legal document by which a patient (or their
authorized representative) gives a covered entity — a health-care provider,
health plan, or health-care clearinghouse — explicit, time-bounded permission
to use or disclose specifically described Protected Health Information (PHI)
to a named third-party recipient for a stated purpose. It is the standard
mechanism, defined in **45 CFR § 164.508** of the HIPAA Privacy Rule, for any
use or disclosure of PHI that is **not** otherwise permitted as treatment,
payment, or health-care operations (TPO).

This implementation is modelled on the Tennessee Department of Human Services
form **HS-2557 — HIPAA Authorization for Release of Medical/Health
Information** (revised 12-15), reproduced in [`seed.pdf`](./seed.pdf). The
HS-2557 layout is representative of the standardised state-agency templates
issued by US Departments of Human Services (Tennessee, Pennsylvania, and
others) and complies with the disclosure provisions of:

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

- **Instrument:** HIPAA-Authorization Validity Check
- **Range:** Valid / Invalid
- **Algorithm:** rule-based validation against the **core elements** and
  **required statements** of 45 CFR § 164.508(c). The form is **Valid** only
  when every required element is present and internally consistent.

### Core elements (45 CFR § 164.508(c)(1))

1. A specific and meaningful description of the PHI to be used or disclosed.
2. The name (or specific identification) of the person(s) or class of
   persons authorised to make the use or disclosure.
3. The name (or specific identification) of the person(s) or class of
   persons to whom the use or disclosure may be made.
4. A description of each purpose of the requested use or disclosure.
5. An expiration date or expiration event ("none" is not permitted).
6. The signature of the individual and the date. If signed by a personal
   representative, a description of the representative's authority to act.

### Required statements (45 CFR § 164.508(c)(2))

- The individual's right to revoke the authorization in writing, the
  procedure for revocation, and any exceptions.
- The fact that treatment, payment, enrollment, or eligibility for benefits
  may not be conditioned on signing (with documented exceptions).
- The potential for the disclosed information to be re-disclosed by the
  recipient and no longer protected by the Privacy Rule.

If any element is missing, the engine returns **Invalid** with a list of
the specific fired rules and a priority-graded list of additional flags
(e.g. sensitive-category gaps for substance use, HIV/AIDS, mental health,
or psychotherapy notes, each of which has heightened consent requirements).

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql/` (17 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: scoring result (per the instrument named in §3), `firedRules[]`, `additionalFlags[]`, and a clinical / administrative report. Rendered as HTML in the browser, exported as PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

Required artefacts and their current status:

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) — not implemented |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) — not implemented |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form united-states-hipaa-authorization-form` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check united-states-hipaa-authorization-form` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `united-states-hipaa-authorization-form.front-end-with-html.v1` (HTML)
  - `united-states-hipaa-authorization-form.front-end-with-svelte.v1` (SvelteKit)

## 7. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR), UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software and AI as a Medical Device. Form-specific classification (e.g. Class IIa where output drives clinical decisions) is recorded in [`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from the baseline.

## 8. References

- [`index.md`](../index.md) — form description and scoring details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions
- [`../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) — Lily HTML contract
- [`../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md) — Lily Svelte contract

## 9. Verify

```sh
bin/test-form united-states-hipaa-authorization-form
```
