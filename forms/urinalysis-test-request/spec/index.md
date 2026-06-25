# Urinalysis Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `urinalysis-test-request`

## 1. Purpose

A UK NHS–aligned **urine pathology test request (order)** that a clinician
completes to order one or more urine investigations for a patient. It records
the requested test panel (dipstick, MC&S, ACR, PCR, pregnancy test, drug screen,
cytology, 24-hour collection), the clinical indication and details, symptoms and
red flags, the specimen type and collection timing, and the requested urgency —
then computes a **four-axis grading** (appropriateness, preanalytical specimen
suitability, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the
pathology / laboratory triage and acceptance decision.

This form is the urine-pathology counterpart to the repository's other
clinician-driven test-request forms (notably the blood test request, which it
mirrors by ordering multiple tests as a selectable panel). It is completed by a
GP, hospital doctor, nurse, or urologist rather than by the patient, and is
aligned with NICE NG109 (lower UTI), NICE NG12 (suspected cancer / haematuria),
and UK Standards for Microbiology Investigations (UK SMI) B41 urine
investigation guidance.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still
have an unsuitable specimen, be incomplete, or be urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Indication-to-test match + guideline appropriateness (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preanalytical** | Specimen suitability — type / collected / timing / contamination risk (UK SMI B41) | ok / caution / reject-risk (+ specimen advisory note) |
| **C. Request completeness** | Mandatory-field checklist, clinical details + indication weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / stat (+ target timeframe) |

> **Note on the 1–9 appropriateness scale.** There is no single published 1–9
> appropriateness score for urinalysis. This engine anchors the 1–9 on
> **indication-to-test match** and **guideline appropriateness** (NICE NG109,
> NICE NG12, UK SMI B41) and labels it as such, by analogy to the ACR
> Appropriateness Criteria ordinal scale used elsewhere in this repository.

A red flag (visible haematuria, or fever + loin pain suggesting pyelonephritis /
urosepsis) **auto-escalates** the triage tier regardless of the other axes.

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

- `bin/test-form urinalysis-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check urinalysis-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `urinalysis-test-request.front-end-form-with-html.v1` (HTML)
  - `urinalysis-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form urinalysis-test-request
```
