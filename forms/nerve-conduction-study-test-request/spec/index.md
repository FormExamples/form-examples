# Nerve Conduction Study Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `nerve-conduction-study-test-request`

## 1. Purpose

A UK NHS–aligned **nerve conduction study / EMG (electrodiagnostic) request
(referral)** that a clinician completes to request a neurophysiology
examination. It records the requested study (nerve conduction, needle EMG,
or both), the anatomical region and laterality, the clinical indication and
specific question, symptoms and their duration, and the safety factors that
matter for needle EMG and electrical stimulation — then computes a **four-axis
grading** (appropriateness, procedural risk, request completeness, and triage
priority) plus a set of safety-critical flags. The output is a vetting report
that supports the neurophysiology department's triage and booking decision.

This form is the electrodiagnostic / neurophysiology counterpart to the
repository's other clinician-driven request forms. It is completed by a
neurologist, neurophysiologist, GP, hospital doctor, or rheumatologist rather
than by the patient, and is aligned with AANEM and AAN evidence-based
electrodiagnostic practice parameters (carpal tunnel syndrome, distal symmetric
polyneuropathy) and ACR Appropriateness Criteria.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, procedurally risky, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | AANEM / AAN electrodiagnostic practice parameters (1–9 ordinal, indication match) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Procedural risk** | Needle EMG against anticoagulation / cardiac device | low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist; indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent (+ target timeframe) |

A suspected **motor neurone disease** indication **auto-escalates** the triage
tier to urgent regardless of the other axes, because early electrodiagnostic
confirmation changes management and access to disease-modifying therapy.

### Study type and indication mapping

| Indication | Typical study | Region | AANEM / AAN basis |
| --- | --- | --- | --- |
| Carpal tunnel | Nerve conduction (± confirmatory EMG) | Upper limb | Practice parameter: electrodiagnostic studies in CTS |
| Peripheral neuropathy | Nerve conduction + EMG | Lower limb / all-limbs | Practice parameter: distal symmetric polyneuropathy |
| Radiculopathy | EMG (± nerve conduction) | Upper / lower limb | Needle EMG most specific for root level |
| Suspected motor neurone disease | Nerve conduction + EMG | Generalized | EMG for diffuse denervation; expedite |
| Myopathy | EMG | Generalized / limb | Needle EMG myopathic units |
| Plexopathy | Nerve conduction + EMG | Upper / lower limb | Localize plexus vs root vs nerve |
| Suspected myasthenia | Repetitive stimulation | Cranial / upper limb | Decrement on repetitive stimulation |
| Nerve injury | Nerve conduction + EMG | Affected limb | Localize and grade axonal loss |

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

- `bin/test-form nerve-conduction-study-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check nerve-conduction-study-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `nerve-conduction-study-test-request.front-end-with-html.v1` (HTML)
  - `nerve-conduction-study-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form nerve-conduction-study-test-request
```
