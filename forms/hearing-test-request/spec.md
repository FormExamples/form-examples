# Hearing Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `hearing-test-request`

## 1. Purpose

A UK NHS–aligned **audiology / hearing-assessment request (referral)** that a
clinician completes to request a hearing test for a patient. It records the
requested test, the affected side, the clinical indication and specific
question, relevant history, symptoms and red flags, and the requested urgency —
then computes a **four-axis grading** (appropriateness, urgency, request
completeness, and clinical priority) plus a set of safety-critical flags. The
output is a vetting report that supports the audiology department's triage and
booking decision.

This form is the audiology counterpart to the repository's other
clinician-driven request forms. It is completed by an audiologist, ENT surgeon,
GP, hearing therapist, or nurse rather than by the patient, and is aligned with
the British Society of Audiology recommended procedures, NICE NG98 (hearing loss
in adults), NICE Quality Standard QS185, and ENT-UK / BAO-HNS sudden
sensorineural hearing loss guidance.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | British Society of Audiology / NICE NG98 indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | ENT-UK / BAO-HNS + NICE QS185 red-flag escalation | triage tier routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Composite of acuity and appropriateness | low / moderate / high |

> **Note on the 1–9 scale.** There is no single published 1–9 audiology
> appropriateness score (unlike the ACR Appropriateness Criteria in radiology).
> This form **anchors the 1–9 axis on indication appropriateness** derived from
> the British Society of Audiology recommended procedures and NICE NG98, and
> says so explicitly. The three bands follow the usual ordinal-rating
> convention.

A red flag (sudden sensorineural hearing loss, unilateral / asymmetric
symptoms, ear discharge) **auto-escalates** the triage tier regardless of the
other axes. Per NICE QS185 and ENT-UK guidance, sudden sensorineural hearing
loss developing over ≤ 3 days within the past 30 days is an **otological
emergency** — refer to be seen within 24 hours; if more than 30 days ago, refer
urgently to be seen within 2 weeks.

### Test types and typical indications

| Test type | Typical indication |
| --- | --- |
| Pure-tone audiometry | Hearing loss, occupational noise, baseline assessment |
| Tympanometry | Middle-ear function, ear discharge, suspected effusion |
| Speech audiometry | Hearing-aid candidacy, functional hearing assessment |
| Otoacoustic emissions | Cochlear (outer hair cell) function, ototoxic monitoring |
| Auditory brainstem response | Retrocochlear / neural pathway, asymmetric loss, infants |
| Newborn hearing screen | Universal newborn hearing screening programme |
| Hearing-aid assessment | Hearing-aid review / fitting |
| Other | Indication recorded in the clinical question |

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

- `bin/test-form hearing-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check hearing-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `hearing-test-request.front-end-form-with-html.v1` (HTML)
  - `hearing-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form hearing-test-request
```
