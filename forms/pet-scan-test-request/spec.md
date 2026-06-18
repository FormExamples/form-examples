# PET Scan Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `pet-scan-test-request`

## 1. Purpose

A UK NHS–aligned **PET-CT (positron emission tomography) scan request
(referral)** that a clinician completes to request a PET-CT examination, most
commonly an oncology FDG-PET-CT for cancer staging, restaging, or
treatment-response assessment. It records the requested tracer and scan type,
the primary indication and specific clinical question, the primary tumour site
and relevant history, the FDG patient-preparation and safety data (diabetes,
blood glucose control, pregnancy, breastfeeding, renal function), the IR(ME)R
justification, and the requested urgency — then computes a **four-axis grading**
(appropriateness, preparation safety and radiation dose, request completeness,
and triage priority) plus a set of safety-critical flags. The output is a
vetting report that supports the nuclear-medicine department's triage and
booking decision.

This form is the molecular-imaging counterpart to the repository's other
clinician-driven imaging request forms (CT, MRI, ultrasound, echocardiogram). It
is completed by a radiologist, nuclear-medicine physician, oncologist, GP,
hospital doctor, or technologist rather than by the patient, and is aligned with
the ACR Appropriateness Criteria, RCR iRefer, EANM / SNMMI FDG-PET procedure
guidelines, and IR(ME)R radiation-justification duties.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
unsafe to prepare, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / RCR iRefer (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preparation safety & radiation dose** | EANM / SNMMI FDG-PET prep + IR(ME)R | prep-safety: ok / caution / contraindicated; radiation-dose: low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity / urgency escalation rules | routine / urgent / emergency (+ target timeframe) |

Axis B is driven by glucose control (FDG uptake needs blood glucose typically
**below 11 mmol/L**), pregnancy status, and breastfeeding. Pregnancy or
uncontrolled glucose force the **caution** or **contraindicated** band and a
safety flag, regardless of how appropriate the request is.

### Scan type and indication

| Scan type | Typical tracer | Common indications |
| --- | --- | --- |
| FDG-PET-CT | [18F]FDG | cancer staging / restaging, treatment response, suspected recurrence, lymphoma, solitary pulmonary nodule, infection / inflammation |
| PSMA-PET | [68Ga]/[18F]PSMA | prostate cancer staging / biochemical recurrence |
| DOTATATE-PET | [68Ga]DOTATATE | neuroendocrine tumour localisation / staging |
| Amyloid-PET | [18F] amyloid tracers | neurology — dementia / Alzheimer assessment |
| Cardiac-PET | [18F]FDG / perfusion | myocardial viability, cardiac sarcoid |

### FDG patient-preparation thresholds (EANM / SNMMI)

| Parameter | Target |
| --- | --- |
| Fasting | ≥ 4–6 hours (no caloric intake; water permitted) |
| Blood glucose (EANM) | below ~7 mmol/L preferred |
| Blood glucose (SNMMI) | 7–11 mmol/L acceptable; recheck / reschedule if above ~11 mmol/L |
| Diabetes | measure and document glucose before tracer; do not treat hyperglycaemia as an absolute contraindication |

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

- `bin/test-form pet-scan-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check pet-scan-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `pet-scan-test-request.front-end-form-with-html.v1` (HTML)
  - `pet-scan-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form pet-scan-test-request
```
