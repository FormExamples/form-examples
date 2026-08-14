# Coagulation Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `coagulation-test-request`

## 1. Purpose

A UK NHS–aligned **coagulation / haemostasis blood-test request (referral)** that
a clinician completes to order one or more coagulation tests for a patient. It
records the requested tests, the clinical indication and details, the patient's
anticoagulant and bleeding / thrombosis history, pre-analytical specimen
handling, and the requested urgency — then computes a **four-axis grading**
(appropriateness, pre-analytical specimen safety, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the laboratory's and haematology team's triage and
processing decision.

This form is the coagulation-laboratory counterpart to the repository's other
clinician-driven request forms. It is completed by a GP, hospital doctor,
haematologist, or nurse rather than by the patient, and is aligned with British
Society for Haematology (BSH) coagulation and thrombophilia-testing guidance and
NICE NG158 venous-thromboembolism diagnosis.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, at pre-analytical risk, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | BSH indication & retest-interval match, anchored 1–9 | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical specimen safety** | Citrate tube fill / 9:1 ratio / analysis timing | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical details weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / stat (+ target timeframe) |

> **Note on the 1–9 scale.** There is **no single published 1–9
> coagulation-ordering score**. Axis A anchors the 1–9 ordinal on indication
> appropriateness and BSH retest-interval guidance, mirroring the ACR-style
> three-band convention. Active bleeding or suspected DIC **auto-escalate** the
> triage tier to *stat* regardless of the other axes.

### Requested tests and typical indications

| Test | Typical indication |
| --- | --- |
| Prothrombin time / INR | Warfarin monitoring; liver disease; DIC; pre-operative screen |
| Activated partial thromboplastin time (APTT) | Heparin monitoring; unexplained bleeding; lupus anticoagulant screen |
| Fibrinogen (Clauss) | DIC; major haemorrhage; liver disease |
| D-dimer | Suspected DVT / PE with unlikely Wells pre-test probability; DIC |
| Thrombophilia screen | Selected unprovoked VTE where the result changes management |
| Factor assays | Investigation of a confirmed bleeding disorder |
| Anti-Xa assay | LMWH / DOAC level (renal impairment, extremes of weight, pregnancy) |
| Mixing studies | Work-up of an unexplained prolonged PT / APTT |
| Von Willebrand screen | Suspected von Willebrand disease; mucocutaneous bleeding |

### Primary indications

`anticoagulation-monitoring`, `bleeding-disorder`, `suspected-dvt-pe`,
`pre-operative`, `thrombophilia-investigation`, `liver-disease`,
`disseminated-intravascular-coagulation`, `abnormal-bleeding`, `other`.

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql/` (9 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

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

- `bin/test-form coagulation-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check coagulation-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `coagulation-test-request.front-end-with-html.v1` (HTML)
  - `coagulation-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form coagulation-test-request
```
