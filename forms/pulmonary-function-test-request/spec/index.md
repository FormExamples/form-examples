# Pulmonary Function Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `pulmonary-function-test-request`

## 1. Purpose

A UK NHS–aligned **lung-function / spirometry test request (referral)** that a
clinician completes to request pulmonary function testing for a patient. It
records the requested test, the clinical indication and specific question,
relevant respiratory symptoms, smoking and inhaler background, and a focused
safety / contraindication screen — then computes a **four-axis grading**
(appropriateness, safety / contraindication, request completeness, and triage
priority) plus a set of safety-critical flags. The output is a vetting report
that supports the lung-function department's triage and booking decision.

This form is the respiratory-diagnostics counterpart to the repository's other
clinician-driven test-request forms. It is completed by a respiratory
physician, GP, hospital doctor, respiratory physiologist, or nurse rather than
by the patient, and is aligned with the ARTP statement on pulmonary function
testing, ERS/ATS spirometry standards, and NICE NG80 (asthma) and NG115 (COPD).

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
contraindicated, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG80 (asthma) / NG115 (COPD), ARTP indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Safety / contraindication** | ARTP / ERS-ATS forced-expiration & infection-control contraindications | ok / caution / contraindicated |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency escalation rules | routine / urgent (+ target timeframe) |

A safety contraindication (recent MI, recent thoracic/eye/abdominal surgery,
active respiratory infection, suspected active tuberculosis, haemoptysis)
**downgrades** the safety band and can defer the test regardless of the other
axes.

### Test types and indications

| Test type | Typical indication |
| --- | --- |
| Spirometry | Suspected COPD, baseline obstruction, breathlessness, monitoring |
| Spirometry with reversibility | Suspected asthma, asthma/COPD differentiation |
| Full lung function | Restrictive disease, complex / unexplained breathlessness |
| Gas transfer (DLCO) | Interstitial lung disease, emphysema, pre-chemotherapy |
| Peak flow | Asthma variability, occupational asthma monitoring |
| FeNO | Suspected asthma (eosinophilic airway inflammation) |

NICE NG80 makes spirometry the first-line investigation for suspected asthma
and COPD, with bronchodilator reversibility and FeNO used per the diagnostic
algorithm; NICE NG115 defines spirometry-confirmed airflow obstruction
(post-bronchodilator FEV1/FVC < 0.7) for COPD.

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

- `bin/test-form pulmonary-function-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check pulmonary-function-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `pulmonary-function-test-request.front-end-with-html.v1` (HTML)
  - `pulmonary-function-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form pulmonary-function-test-request
```
