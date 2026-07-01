# Colonoscopy Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `colonoscopy-test-request`

## 1. Purpose

A UK NHS–aligned **lower-GI endoscopy procedure request (referral)** that a
clinician completes to request a colonoscopy (or flexible sigmoidoscopy / CT
colonography) for a patient. It records the requested procedure, the clinical
indication and specific question, lower-GI red-flag symptoms, the FIT and
haemoglobin results, anticoagulant / antiplatelet medication, bowel-preparation
fitness and renal function, ASA physical status, and the requested urgency —
then computes a **four-axis grading** (appropriateness, cancer-pathway urgency,
request completeness, and pre-procedure risk) plus a set of safety-critical
flags. The output is a vetting report that supports the endoscopy unit's triage
and booking decision.

This form is the lower-GI-endoscopy counterpart to the repository's other
clinician-driven request forms. It is completed by a gastroenterologist,
colorectal surgeon, GP, or nurse-endoscopist rather than by the patient, and is
aligned with NICE NG12 suspected-cancer referral, NICE DG56 FIT triage, BSG /
ESGE bowel-preparation and periprocedural anticoagulation guidance, ASA
physical-status grading, and the ASGE / EPAGE Appropriate Use Criteria.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, urgent, or high-risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ASGE Appropriate Use Criteria / EPAGE / NICE (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Cancer-pathway urgency** | NICE NG12 / DG56 suspected-cancer rules | routine / urgent / two-week-wait / emergency (+ target timeframe, 2WW eligibility + rationale) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Pre-procedure risk** | BSG / ESGE periprocedural anticoagulant stratification + bowel-prep fitness + ASA grade | low / moderate / high (+ anticoagulant action) |

A positive FIT (≥10 µg Hb/g, NICE DG56) or a NICE NG12 lower-GI red-flag
combination **escalates** the triage tier to two-week-wait. An acute presentation
(emergency setting with active bleeding) **auto-escalates** to emergency
regardless of the other axes.

### Procedure / indication notes

| Procedure | Typical indications | Pathway notes |
| --- | --- | --- |
| Colonoscopy | rectal bleeding, change in bowel habit, iron-deficiency anaemia, positive FIT, IBD diagnosis / surveillance, polyp surveillance, CRC screening | Full lower-GI survey; FIT ≥10 µg/g → suspected-cancer pathway (NICE DG56) |
| Flexible sigmoidoscopy | left-sided / distal symptoms, rectal bleeding, distal surveillance | Limited to recto-sigmoid |
| CT colonography | frail / unfit-for-colonoscopy patients, incomplete colonoscopy, abnormal imaging | Radiological alternative; still needs bowel prep |

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

- `bin/test-form colonoscopy-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check colonoscopy-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `colonoscopy-test-request.front-end-with-html.v1` (HTML)
  - `colonoscopy-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form colonoscopy-test-request
```
