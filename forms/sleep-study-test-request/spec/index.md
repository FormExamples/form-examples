# Sleep Study Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `sleep-study-test-request`

## 1. Purpose

A UK NHS–aligned **sleep study / polysomnography request (referral)** that a
clinician completes to request a sleep investigation for a patient, mainly to
diagnose or exclude **obstructive sleep apnoea (OSA)**. It records the requested
study type, the clinical indication and specific question, the Epworth
Sleepiness Scale and STOP-BANG scores, anthropometry (BMI, neck circumference),
symptoms and risk factors, and the requested urgency — then computes a
**four-axis grading** (appropriateness, clinical priority, request completeness,
and triage) plus a set of safety-critical flags. The output is a vetting report
that supports the sleep service's triage and booking decision.

This form is the sleep-medicine counterpart to the repository's other
clinician-driven test-request forms. It is completed by a respiratory
physician, sleep physician, GP, ENT surgeon, neurologist, or physiologist
rather than by the patient, and is aligned with NICE NG202, SIGN guidance, the
Epworth Sleepiness Scale, the STOP-BANG questionnaire, and DVLA fitness-to-drive
guidance for excessive sleepiness.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Epworth + STOP-BANG vs. indication match (NICE NG202 / SIGN), 1–9 ordinal | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Clinical priority** | Occupational driving, severe daytime sleepiness, comorbidity | low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question, and Epworth weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage** | Escalation rules (vocational driver / severe sleepiness → urgent) | routine / urgent (+ target timeframe) |

A vocational-driver request with excessive sleepiness, or severe daytime
sleepiness (high Epworth), **auto-escalates** the triage tier regardless of the
other axes, in line with DVLA guidance.

### Study types and indications

| Study type | Typical use |
| --- | --- |
| Home sleep apnoea test (HSAT) | First-line for uncomplicated suspected OSA |
| Polysomnography (PSG) | Complex / discordant cases, comorbidity, non-respiratory sleep disorders |
| Overnight oximetry | Screening where HSAT is unavailable |
| Multiple sleep latency test (MSLT) | Suspected narcolepsy / hypersomnolence |
| Actigraphy | Circadian-rhythm and insomnia assessment |

| Indication | Notes |
| --- | --- |
| Suspected OSA | High STOP-BANG and/or witnessed apnoeas |
| Snoring | Often with daytime sleepiness |
| Daytime sleepiness | High Epworth; DVLA relevance |
| Suspected narcolepsy | MSLT pathway |
| Insomnia | Often actigraphy |
| Restless legs | Often PSG |
| COPD overlap | NICE NG202 COPD–OSAHS overlap pathway |
| Pre-bariatric | Pre-operative OSA screening |
| Driver assessment | DVLA / occupational driver |

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

- `bin/test-form sleep-study-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check sleep-study-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `sleep-study-test-request.front-end-with-html.v1` (HTML)
  - `sleep-study-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form sleep-study-test-request
```
