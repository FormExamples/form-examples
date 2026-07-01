# Blood Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `blood-test-request`

## 1. Purpose

A UK NHS–aligned **pathology / phlebotomy blood-test order (request)** that a
clinician completes to order one or more blood-test **panels** for a patient. It
records the requested panels, the clinical indication and details, pre-analytical
and specimen-handling information (fasting, collection, tubes), patient-safety
factors, and the requested urgency — then computes a **four-axis grading**
(appropriateness, pre-analytical / specimen safety, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the laboratory's triage and accept / query / reject decision.

This form is the pathology counterpart to the repository's other clinician-driven
request forms. Unlike a single-procedure request it **orders panels**: the
requested tests are modelled as a set of BOOLEAN columns on the main record. It
is completed by a GP, hospital doctor, nurse, phlebotomist, or consultant, and is
aligned with the RCPath *National Minimum Retesting Intervals in Pathology*
(report G147) and general laboratory-ordering and pre-analytical guidance.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**. Axes are orthogonal:
a highly appropriate request can still have a pre-analytical problem, be
incomplete, or be urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | RCPath National Minimum Retesting Intervals + indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical / specimen safety** | Fasting met? specimen labelled / collected? right tubes? | ok / caution / reject-risk (+ fasting-violation flag) |
| **C. Request completeness** | Mandatory-field checklist, clinical details + indication weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency + critical-test escalation rules | routine / urgent / stat (+ target timeframe) |

> **Note on the 1–9 scale.** There is no single published 1–9 appropriateness
> score for blood tests. This form **anchors** the 1–9 mapping on RCPath retesting-
> interval appropriateness (was the same test ordered inside its minimum retesting
> interval?) combined with indication match, and says so explicitly. It is decision
> support, not a validated instrument.

### Requested panels

Panels are BOOLEAN columns on the main record; at least one should be selected.

| Panel | Notes |
| --- | --- |
| Full blood count (FBC) | EDTA (purple) tube |
| Urea & electrolytes (U&E) | Renal function, electrolytes |
| Liver function (LFT) | |
| Thyroid function (TFT) | |
| HbA1c | Diabetes diagnosis; non-fasting; EDTA tube |
| Lipid profile | NICE: fasting not required; CVD risk |
| C-reactive protein (CRP) | Inflammation / infection |
| Coagulation screen (PT / APTT) | Citrate tube |
| Bone profile | Calcium, phosphate, ALP, albumin |
| Ferritin / iron studies | Anaemia work-up |
| Vitamin B12 & folate | |
| Vitamin D (25-OH) | |
| HbA1c monitoring | Diabetes monitoring; RCPath MRI applies |
| Glucose | Fasting or random |
| INR | Anticoagulation monitoring |
| Blood culture | Sepsis / infection; sterile technique |
| Group & save | Blood group + antibody screen |
| Crossmatch | For transfusion |
| Troponin | Cardiac marker |
| D-dimer | VTE exclusion |
| Amylase / lipase | Pancreatitis |

### Primary indications

routine-monitoring · anaemia · fatigue · infection · diabetes-monitoring ·
thyroid-symptoms · cardiovascular-risk · liver-disease · renal-monitoring ·
anticoagulation-monitoring · pre-operative · suspected-malignancy · other

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

- `bin/test-form blood-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check blood-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `blood-test-request.front-end-with-html.v1` (HTML)
  - `blood-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form blood-test-request
```
