# Echocardiogram Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `echocardiogram-test-request`

## 1. Purpose

A UK NHS–aligned **cardiac echocardiogram request (referral)** that a clinician
completes to request an echocardiogram (echo) examination for a patient. It
records the requested echo type, the clinical indication and specific question,
relevant cardiac history, symptoms and NYHA functional class, ECG and
natriuretic-peptide findings, any previous echo, cardiotoxic-chemotherapy
status, and the requested urgency — then computes a **four-axis grading**
(appropriateness, urgency, request completeness, and clinical priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
echo / cardiac-physiology department's triage and booking decision.

This form is the cardiac-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by a cardiologist, GP, hospital
doctor, heart-failure nurse, or cardiac physiologist rather than by the patient,
and is aligned with the ACC/AHA/ASE Appropriate Use Criteria for echocardiography,
British Society of Echocardiography (BSE) referral guidance, and NICE NG106
chronic heart failure (NT-proBNP thresholds).

Full design description: [`index.md`](index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, urgent, or low clinical priority.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACC/AHA/ASE & BSE Appropriate Use Criteria (1–9 ordinal) | appropriate (7–9) / may-be-appropriate (4–6) / rarely-appropriate (1–3) |
| **B. Urgency** | BSE referral acuity / red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | NYHA class, natriuretic peptide (NICE NG106), suspected severe pathology | low / moderate / high |

A red flag (suspected endocarditis, severe symptomatic valve disease, acute
heart failure) **auto-escalates** the urgency tier regardless of the other axes.

### Echo-type and indication map

| Echo type | Typical use |
| --- | --- |
| Transthoracic (TTE) | First-line study for nearly all indications |
| Transoesophageal (TOE) | Endocarditis, valve detail, cardiac source of embolism, pre-cardioversion thrombus |
| Stress echo | Inducible ischaemia, low-flow low-gradient aortic stenosis, viability |
| Contrast echo | Poor acoustic windows, LV opacification, suspected apical pathology |

| Indication | Notes |
| --- | --- |
| Heart failure | Confirm/characterise; LVEF; prioritised by NT-proBNP (NICE NG106) |
| Murmur / suspected valve disease | Assess severity and ventricular response |
| Breathlessness | Distinguish cardiac vs non-cardiac cause |
| Palpitations | Structural substrate assessment |
| Chest pain | Structural / functional assessment alongside ischaemia work-up |
| Hypertension | Left-ventricular hypertrophy, diastolic function |
| Cardiomyopathy | Diagnosis and surveillance |
| Endocarditis | TTE then TOE; urgent (high-priority flag) |
| Post-MI | LV function, complications |
| Pulmonary hypertension | RV function, estimated PA pressures |
| Pre-chemotherapy / cardio-oncology | Baseline and serial LVEF for cardiotoxic agents |
| Stroke / TIA source | Cardiac source of embolism |
| Congenital | Structural assessment, surveillance |
| Surveillance of known disease | Interval reassessment |

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

- `bin/test-form echocardiogram-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check echocardiogram-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `echocardiogram-test-request.front-end-form-with-html.v1` (HTML)
  - `echocardiogram-test-request.front-end-form-with-svelte.v1` (SvelteKit)

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
bin/test-form echocardiogram-test-request
```
