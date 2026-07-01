# Cardiology Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `cardiology-request`

## 1. Purpose

A UK NHS–aligned **cardiology referral / consult request** that a clinician
completes to refer a patient *into* a cardiology service. It records the
requested cardiology service and the primary reason for referral, the specific
clinical question, presenting symptoms and functional class, acute red flags,
investigations already performed (resting ECG, troponin, BNP), the patient's
cardiac history and risk factors, and triage details — then computes a
**four-axis vetting grade** (referral appropriateness, safety / red-flag,
request completeness, and triage priority) plus a set of safety-critical flags.
The output is a vetting report that supports the cardiology department's triage
and booking decision.

This form is the **request** half of the request/response pair: where this form
captures *why* a patient should be seen by cardiology and *how urgently*, the
sibling [`cardiology-response`](../cardiology-response) form records the
cardiology team's reply. It is completed by a GP, hospital doctor, cardiologist,
or specialist nurse rather than by the patient, and is aligned with NICE chest
pain (CG95), chronic heart failure (NG106), transient loss of consciousness
(CG109), and the NHS e-Referral advice-and-guidance / referral-vetting model.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each referral on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate referral can still be
unsafe to manage as a routine referral, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Right-service / right-reason check against NICE referral criteria | usually-appropriate / may-be-appropriate / usually-not-appropriate |
| **B. Safety / red-flag** | Acute red-flag escalation rules | ok / caution / red-flag |
| **C. Request completeness** | Mandatory-field checklist, reason + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag and acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A red flag (suspected acute coronary syndrome, exertional syncope, new-onset
heart failure) drives the safety axis and **auto-escalates** the triage tier
regardless of the other axes. Choose the least-urgent band only when no rule
fires.

### Reason and service map

| Referral reason | Typical service | Notes |
| --- | --- | --- |
| Chest pain (suspected angina) | Rapid-access chest-pain clinic | NICE CG95; typicality drives urgency |
| Breathlessness / suspected heart failure | Heart-failure clinic | BNP / NT-proBNP gates urgency (NG106) |
| Palpitations / arrhythmia | Arrhythmia / EP clinic | Exertional syncope is a red flag |
| Syncope | General cardiology / arrhythmia | Exertional syncope warrants urgent review |
| Murmur / valve disease | Valve clinic | Echocardiography assessment |
| Abnormal ECG | General cardiology | Context-dependent |
| Pre-operative assessment | Pre-operative cardiac | Risk stratification before surgery |

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
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form cardiology-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check cardiology-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `cardiology-request.front-end-with-html.v1` (HTML)
  - `cardiology-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form cardiology-request
```
