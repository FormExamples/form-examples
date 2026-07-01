# Microbiology Culture Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `microbiology-culture-test-request`

## 1. Purpose

A UK NHS–aligned **microbiology specimen culture / MC&S request (referral)** that
a clinician completes to order microscopy, culture, and antibiotic-sensitivity
testing (and related molecular / screening tests) on a clinical specimen. It
records the specimen and site, the requested tests, the clinical indication and
details, pre-analytical specimen handling, patient-safety factors, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
pre-analytical specimen safety, request completeness, and triage priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
laboratory's triage and acceptance decision.

This form is the microbiology-laboratory counterpart to the repository's other
clinician-driven test-request forms. It is completed by a GP, hospital doctor,
nurse, microbiologist, or other clinician rather than by the patient, and is
aligned with the UKHSA / RCPath **Standards for Microbiology Investigations
(SMI)** and **NICE NG51** (suspected sepsis).

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**. Axes are
orthogonal: a highly appropriate request can still be pre-analytically unsafe,
incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | UKHSA SMI specimen / indication match (1–9 ordinal anchor) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical specimen safety** | SMI specimen type / timing / transport; sampling before antibiotics | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical details weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | NICE NG51 sepsis escalation rules | routine / urgent / stat (+ target timeframe) |

There is **no single published 1–9 microbiology appropriateness score**, so
Axis A is anchored on **specimen-and-indication appropriateness** (analogous to
the ACR ordinal scale) using the UKHSA SMI specimen-selection guidance. Suspected
sepsis **auto-escalates** triage to *stat* regardless of the other axes.

### Specimen, test, and indication options

| Specimen types | Requestable tests | Primary indications |
| --- | --- | --- |
| blood-culture, urine, wound-swab, sputum, throat-swab, stool, csf, tissue, catheter-tip, genital-swab, other | culture-and-sensitivity (MC&S), gram-stain, acid-fast-bacilli (TB), fungal-culture, pcr-molecular, c-difficile-toxin, mrsa-screen | suspected-sepsis, urinary-tract-infection, wound-infection, respiratory-infection, gastroenteritis, meningitis, sti-screen, pyrexia-unknown-origin, infection-screening, other |

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

- `bin/test-form microbiology-culture-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check microbiology-culture-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `microbiology-culture-test-request.front-end-with-html.v1` (HTML)
  - `microbiology-culture-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form microbiology-culture-test-request
```
