# Cytology Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `cytology-test-request`

## 1. Purpose

A UK NHS–aligned **cytology specimen request (referral)** that a clinician
completes to request a cytology examination of a specimen — cervical smear,
urine, sputum, serous-cavity effusion (pleural / ascitic), fine-needle
aspiration (thyroid or breast), or cerebrospinal fluid. It records the
requested specimen type and site, the clinical indication and specific
question, the cervical-screening / cytology context, the specimen-collection
(pre-analytical) details, and the requested urgency — then computes a
**four-axis grading** (appropriateness, pre-analytical specimen adequacy,
request completeness, and triage priority) plus a set of safety-critical flags.
The output is a vetting report that supports the cytology / pathology
laboratory's triage and acceptance decision.

This form is the cytopathology counterpart to the repository's other
clinician-driven request forms. It is completed by a pathologist, GP,
gynaecologist, respiratory physician, or nurse rather than by the patient, and
is aligned with the NHS Cervical Screening Programme (HPV primary screening),
RCPath cytopathology guidance, and NICE NG12 (suspected cancer recognition and
referral).

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
pre-analytically poor, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NHS Cervical Screening Programme / indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical specimen adequacy** | Specimen collected / timing / fixation (RCPath cytopathology) | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | NICE NG12 suspected-cancer escalation rules | routine / urgent / two-week-wait (+ target timeframe) |

A suspected-cancer indication or a previous high-grade cytology result
**auto-escalates** the triage tier toward the two-week-wait pathway regardless
of the other axes.

### Specimen types

| Specimen type | Typical indication |
| --- | --- |
| Cervical smear | Cervical screening (HPV primary screen + cytology triage) |
| Urine cytology | Haematuria, suspected urothelial malignancy |
| Sputum cytology | Suspected respiratory malignancy |
| Fluid — pleural / ascitic | Serous-cavity effusion investigation |
| Fine-needle aspiration — thyroid | Thyroid nodule |
| Fine-needle aspiration — breast | Breast lump |
| CSF cytology | Suspected CNS / meningeal involvement |

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

- `bin/test-form cytology-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check cytology-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `cytology-test-request.front-end-form-with-html.v1` (HTML)
  - `cytology-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form cytology-test-request
```
