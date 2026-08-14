# Nuclear Medicine Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `nuclear-medicine-test-request`

## 1. Purpose

A UK NHS–aligned **nuclear medicine (radionuclide imaging) request (referral)**
that a clinician completes to request a radionuclide study — for example a bone
scan, myocardial perfusion scan, V/Q lung scan, thyroid uptake, renal DMSA /
MAG3, gallium / octreotide, white-cell, or sentinel-node study. It records the
requested scan, the clinical indication and specific question, relevant history,
and the radiation-safety governance (pregnancy and breastfeeding status, renal
function, recent radionuclide exposure, weight) — then computes a **four-axis
grading** (appropriateness, preparation & radiation safety, request
completeness, and triage priority) plus a set of safety-critical flags. The
output is a vetting report that supports the nuclear-medicine department's
justification, triage, and booking decisions.

This form is the nuclear-medicine counterpart to the repository's other
clinician-driven imaging request forms. It is completed by a radiologist,
nuclear-medicine physician, oncologist, cardiologist, GP, or technologist rather
than by the patient, and is aligned with the ACR Appropriateness Criteria, RCR
iRefer, ARSAC guidance, the Ionizing Radiation (Medical Exposure) Regulations
IR(ME)R, and EANM / SNMMI procedure guidelines.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
unsafe to perform now, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / RCR iRefer (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preparation & radiation safety** | ARSAC / IR(ME)R / ICRP / EANM–SNMMI | prep_safety_band: ok / caution / contraindicated; radiation_dose_band: low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety rule (confirmed or possible pregnancy, breastfeeding with a
long-retention radiopharmaceutical, recent interfering radionuclide study) drives
the **prep_safety_band** toward caution or contraindicated regardless of the
other axes, and a high-acuity indication auto-escalates the triage tier.

### Scan-type / indication map

| Scan type | Typical indication | Radiation dose band |
| --- | --- | --- |
| Bone scan (Tc-99m MDP) | suspected bone metastases | moderate |
| Myocardial perfusion (Tc-99m / Tl-201) | cardiac ischaemia | moderate–high |
| V/Q lung scan | pulmonary embolism | low |
| Thyroid uptake (I-123 / Tc-99m) | thyroid function | low |
| Renal DMSA | renal cortical assessment | low |
| Renal MAG3 | renal function / drainage | low |
| Gallium / octreotide (Ga-68 / In-111) | tumour or infection localization | high |
| White-cell scan | infection localization | moderate |
| Sentinel-node | sentinel-node mapping | low |

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

- `bin/test-form nuclear-medicine-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check nuclear-medicine-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `nuclear-medicine-test-request.front-end-with-html.v1` (HTML)
  - `nuclear-medicine-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form nuclear-medicine-test-request
```
