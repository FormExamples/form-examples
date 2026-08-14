# CT Scan Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `ct-scan-test-request`

## 1. Purpose

A UK NHS–aligned **CT (computed tomography) scan request (referral)** that a
clinician completes to request a CT examination for a patient. It records the
requested body region, the clinical indication and specific question, relevant
history, the contrast and radiation-safety factors (renal function, allergy,
metformin, pregnancy), the IR(ME)R radiation justification, and the requested
urgency — then computes a **four-axis grading** (appropriateness, radiation /
contrast safety, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the imaging
department's triage and protocolling decision.

This form is the cross-sectional-imaging counterpart to the repository's other
clinician-driven request forms (e.g. *Pregnancy Ultrasound Test Request*). It is
completed by a radiologist, GP, hospital doctor, surgeon, oncologist, emergency
physician, or radiographer rather than by the patient, and is aligned with the
ACR Appropriateness Criteria, the Royal College of Radiologists (RCR) *iRefer*
guidance, ESUR contrast-media safety guidelines, and the UK Ionizing Radiation
(Medical Exposure) Regulations — IR(ME)R 2017.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
unsafe for contrast, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Radiation & contrast safety** | RCR *iRefer* / ESUR contrast guidelines + IR(ME)R | contrast-safety band (safe / caution / contraindicated), estimated-dose band (low / moderate / high), renal-risk flag |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question + IR(ME)R justification weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety condition (pregnancy with planned exposure, severe contrast allergy,
low eGFR with IV contrast) **auto-escalates** the relevant flag and can move the
contrast-safety band to *contraindicated* regardless of the other axes.

### Estimated radiation dose by study (illustrative)

| Study | Typical effective dose band |
| --- | --- |
| CT head | low |
| CT cervical spine / neck | low–moderate |
| CT chest / CT pulmonary angiogram | moderate |
| CT abdomen–pelvis | moderate–high |
| CT colonography | moderate–high |
| Whole-body / multi-phase CT | high |

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

- `bin/test-form ct-scan-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check ct-scan-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `ct-scan-test-request.front-end-with-html.v1` (HTML)
  - `ct-scan-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form ct-scan-test-request
```
