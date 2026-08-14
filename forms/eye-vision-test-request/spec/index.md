# Eye Vision Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `eye-vision-test-request`

## 1. Purpose

A UK NHS–aligned **ophthalmic / optometric eye examination request (referral)**
that a clinician completes to request an eye vision test for a patient. It
records the requested test, the eye(s) to be examined, the clinical indication
and specific question, relevant history, symptoms and red flags, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
urgency / triage priority, request completeness, and clinical priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
eye-care service's triage and booking decision.

This form is the ophthalmic-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by an ophthalmologist,
optometrist, GP, orthoptist, or nurse rather than by the patient, and is aligned
with Royal College of Ophthalmologists (RCOphth) referral and acute-eye
guidance, NICE NG81 glaucoma, and the NHS Diabetic Eye Screening Programme.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | RCOphth / NICE indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | RCOphth acute-eye escalation rules | triage tier: routine / urgent / emergency (+ target timeframe) |
| **C. Completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Combined acuity + risk-factor weighting | priority band: low / moderate / high |

A red-flag (sudden visual loss, retinal-detachment symptoms, acute painful red
eye, suspected giant cell arteritis) **auto-escalates** the triage tier to
emergency regardless of the other axes.

### Test types and indications

| Test type | Typical indication |
| --- | --- |
| Visual acuity | Reduced vision, baseline assessment |
| Visual fields | Suspected glaucoma, visual-field defect, neurological symptoms |
| Refraction | Reduced vision, childhood squint |
| Fundus examination | Diabetic retinopathy screening, flashes / floaters |
| Optical coherence tomography (OCT) | Suspected glaucoma, macular assessment |
| Fluorescein angiography | Diabetic retinopathy, retinal vascular disease |
| Tonometry | Suspected glaucoma, known glaucoma monitoring |
| Slit-lamp examination | Red eye, anterior-segment assessment |
| Orthoptic assessment | Childhood squint, diplopia |

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

- `bin/test-form eye-vision-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check eye-vision-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `eye-vision-test-request.front-end-with-html.v1` (HTML)
  - `eye-vision-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form eye-vision-test-request
```
