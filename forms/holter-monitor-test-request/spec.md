# Holter Monitor Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `holter-monitor-test-request`

## 1. Purpose

A UK NHS–aligned **ambulatory ECG (Holter) monitoring request (referral)** that
a clinician completes to request ambulatory cardiac rhythm monitoring for a
patient. It records the requested monitor type, the clinical indication and
specific question, the patient's symptoms and symptom frequency, the relevant
cardiac context and red flags, and the requested urgency — then computes a
**four-axis grading** (appropriateness, urgency/triage, request completeness,
and clinical priority) plus a set of safety-critical flags. The output is a
vetting report that supports the cardiac physiology department's triage and
booking decision.

This form is the ambulatory-cardiology counterpart to the repository's other
clinician-driven request forms. It is completed by a cardiologist, GP,
hospital doctor, cardiac physiologist, or nurse rather than by the patient, and
is aligned with ACC/AHA ambulatory electrocardiography guidance, the ISHNE-HRS
expert consensus on ambulatory ECG, NICE NG196 atrial fibrillation guidance, and
ESC syncope guidance.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACC/AHA ambulatory ECG guidance + indication/symptom-frequency match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency / triage** | Red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Acuity banding across symptoms and cardiac context | low / moderate / high |

A red-flag (syncope, suspected VT, post-stroke AF detection) **auto-escalates**
the triage tier regardless of the other axes.

### Monitor-type / symptom-frequency matching

The choice of monitor duration depends on how often symptoms occur — the
diagnostic yield of a 24-hour Holter is high only for daily or near-daily
symptoms; infrequent symptoms need longer or patient-activated recording.

| Symptom frequency | Recommended monitor |
| --- | --- |
| Daily / near-daily | 24-hour or 48-hour Holter |
| Weekly | 7-day monitor |
| Monthly | 14-day monitor or event recorder |
| Rare (< monthly) | event recorder or implantable loop recorder |

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

- `bin/test-form holter-monitor-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check holter-monitor-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `holter-monitor-test-request.front-end-form-with-html.v1` (HTML)
  - `holter-monitor-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form holter-monitor-test-request
```
