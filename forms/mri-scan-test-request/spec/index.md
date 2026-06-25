# MRI Scan Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `mri-scan-test-request`

## 1. Purpose

A UK NHS–aligned **MRI scan request (referral)** that a clinician completes to
request a magnetic-resonance-imaging examination. It records the requested body
region and clinical indication, the specific clinical question, contrast and
gadolinium / renal (NSF) risk, a structured **MRI safety screen** for
ferromagnetic and electronic implants, and the requested urgency — then computes
a **four-axis grading** (appropriateness, MRI safety, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the imaging department's safety review, protocolling, and
booking decision.

This form is the cross-sectional-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by a radiologist, GP, hospital
doctor, neurologist, orthopaedic surgeon, oncologist, or radiographer rather
than by the patient, and is aligned with the ACR Appropriateness Criteria, the
ACR Manual on MR Safety, MHRA device-safety guidance, and ESUR / RCR gadolinium
guidance.

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, unsafe to scan, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. MRI safety** | ACR Manual on MR Safety / MHRA implant screening; gadolinium-vs-eGFR contrast-renal flag | cleared / conditional / needs-mri-physics-review / contraindicated (+ contrast-renal flag) |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question, and safety screen weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency / red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |

A positive **MRI safety** screen item (pacemaker / ICD, aneurysm clip, orbital
foreign body) drives axis B toward *needs-mri-physics-review* or
*contraindicated* regardless of the other axes, and an **emergency** indication
auto-escalates the triage tier.

### MRI safety note

MRI uses a strong static magnetic field that is always on. Ferromagnetic and
active electronic implants can heat, move, or malfunction in the bore. The
following screen items are safety-critical and must be resolved before scanning:

- **Absolute / high-risk:** cardiac pacemaker or ICD (unless MR-conditional and
  programmed for MRI), intracranial aneurysm clip of unknown / ferromagnetic
  type, metallic foreign body in the eye / orbit.
- **Conditional:** cochlear implant, programmable CSF shunt, neurostimulator,
  metal implant or prosthesis, insulin pump — each requires MR-conditional
  labelling, correct field strength, and protocol confirmation.
- **Logistical:** claustrophobia (sedation / open-bore), weight versus bore /
  table limit.

### Gadolinium and renal (NSF) risk

When IV gadolinium contrast is requested, the engine compares it with the
patient's eGFR (ESUR / RCR guidance): **eGFR < 30 mL/min/1.73 m²** is treated as
*contraindicated* (nephrogenic-systemic-fibrosis risk), **eGFR 30–60** as
*caution* (use a group II / low-risk agent only when necessary), and a previous
moderate–severe gadolinium reaction is flagged independently.

### Body regions and indications

| Body region | Typical indications |
| --- | --- |
| Brain | suspected stroke, suspected MS, epilepsy, dementia, pituitary, neurological deficit |
| Spine (cervical / thoracic / lumbar) | back pain with radiculopathy, neurological deficit, suspected malignancy |
| Head & neck | suspected malignancy, cancer staging |
| Chest / abdomen / pelvis | suspected malignancy, cancer staging, follow-up surveillance |
| Cardiac | cardiac function |
| MR angiogram | vascular assessment |
| Breast | suspected malignancy, cancer staging |
| Musculoskeletal joint | joint derangement |
| Whole body | cancer staging, surveillance |

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

- `bin/test-form mri-scan-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check mri-scan-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `mri-scan-test-request.front-end-form-with-html.v1` (HTML)
  - `mri-scan-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form mri-scan-test-request
```
