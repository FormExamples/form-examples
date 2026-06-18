# Ambulatory Blood Pressure Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `ambulatory-blood-pressure-test-request`

## 1. Purpose

A UK NHS–aligned **ambulatory blood pressure monitoring (ABPM) request
(referral)** that a clinician completes to request 24-hour ambulatory blood
pressure monitoring (or home blood pressure monitoring) for a patient. It
records the most recent clinic blood pressure, the clinical indication and
specific question, current antihypertensive medication, symptoms and
accuracy-affecting factors, and the requested urgency — then computes a
**four-axis grading** (appropriateness, suitability, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the monitoring service's triage and booking decision.

This form is the cardiovascular-diagnostics counterpart to the repository's
other clinician-driven request forms. It is completed by a GP, hospital doctor,
cardiologist, nurse, or pharmacist rather than by the patient, and is aligned
with NICE NG136 *Hypertension in adults* and British and Irish Hypertension
Society (BIHS) ABPM measurement guidance.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, of limited measurement suitability, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG136 (1–9 ordinal; ABPM to confirm clinic BP ≥140/90) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Suitability** | Oscillometric accuracy factors — atrial fibrillation, arm size | ok / caution / limited |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question + clinic BP weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | NICE NG136 severe-BP escalation rules | routine / urgent / emergency (+ target timeframe) |

A severe or accelerated hypertension reading (clinic BP ≥180/120 mmHg)
**auto-escalates** the triage tier to urgent / same-day specialist review,
regardless of the other axes (NICE NG136).

### Appropriateness anchors (NICE NG136)

| Scenario | Direction |
| --- | --- |
| Clinic BP ≥140/90 and <180/120, confirming a new diagnosis | usually-appropriate (ABPM is the most accurate confirmation method) |
| Suspected white-coat or masked hypertension | usually-appropriate |
| Treatment monitoring of known hypertension | may-be-appropriate |
| Clinic BP well below 140/90 with no labile / symptom indication | usually-not-appropriate |
| Clinic BP ≥180/120 | same-day specialist review takes priority over routine ABPM |

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

- `bin/test-form ambulatory-blood-pressure-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check ambulatory-blood-pressure-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `ambulatory-blood-pressure-test-request.front-end-form-with-html.v1` (HTML)
  - `ambulatory-blood-pressure-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form ambulatory-blood-pressure-test-request
```
