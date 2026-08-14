# Electroencephalogram Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `electroencephalogram-test-request`

## 1. Purpose

A UK NHS–aligned **electroencephalogram (EEG) request (referral)** that a
clinician completes to request a recording of the brain's electrical activity,
most often to support the diagnosis and classification of epilepsy and
seizures. It records the requested EEG type, the clinical indication and
specific question, the seizure / epilepsy context, current antiepileptic
therapy, and the requested urgency — then computes a **four-axis grading**
(appropriateness, urgency, request completeness, and clinical priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
neurophysiology department's triage and booking decision.

This form is the neurophysiology counterpart to the repository's other
clinician-driven request forms. It is completed by a neurologist, GP, hospital
doctor, paediatrician, or clinical physiologist rather than by the patient, and
is aligned with NICE NG217 (*Epilepsies in children, young people and adults*)
and ILAE practice for the role and limitations of EEG.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG217 epilepsy / ILAE EEG role (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | Red-flag escalation rules | triage tier: routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Acuity weighting of indication + context | priority band: low / moderate / high |

**Key NICE NG217 principle:** an EEG *supports* a diagnosis of epilepsy and
helps classify seizure type / syndrome, but it must **not** be used to *exclude*
a diagnosis of epilepsy, nor be used in isolation. Suspected **status
epilepticus** auto-escalates urgency to emergency regardless of the other axes.

### EEG types and indications

| EEG type | Typical use |
| --- | --- |
| Routine awake | First-line study to support diagnosis and classify seizure type / syndrome |
| Sleep-deprived | Increases yield of interictal epileptiform discharges when routine EEG non-diagnostic |
| Ambulatory 24-hour | Outpatient capture of events / interictal discharges over a longer window |
| Video-telemetry | Inpatient long-term video-EEG to characterize events and classify the syndrome |

| Indication | Notes |
| --- | --- |
| Suspected epilepsy | Support diagnosis after a clinically suspected epileptic seizure |
| Seizure classification | Classify seizure type / epilepsy syndrome |
| Status epilepticus | Suspected / ongoing status — emergency |
| Encephalopathy | Diffuse cerebral dysfunction, including non-convulsive status |
| First seizure | First unprovoked seizure work-up |
| Funny turns | Differentiate epileptic from non-epileptic events |
| Dementia | Selected cognitive / encephalopathic presentations |
| Pre-surgical evaluation | Localization for epilepsy surgery work-up |
| Medication review | Antiepileptic drug withdrawal / treatment decisions |

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

- `bin/test-form electroencephalogram-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check electroencephalogram-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `electroencephalogram-test-request.front-end-with-html.v1` (HTML)
  - `electroencephalogram-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form electroencephalogram-test-request
```
