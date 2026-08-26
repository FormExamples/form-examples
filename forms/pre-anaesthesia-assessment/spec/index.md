# Pre-Anaesthesia Assessment — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `pre-anaesthesia-assessment`

## 1. Purpose

A UK NHS–aligned, clinician-driven pre-operative assessment that records
**objective findings** (history, examination, vitals, laboratory results, imaging)
and computes an **ASA Physical Status grade** (I–VI), a composite perioperative
risk level, and a set of safety-critical flags. The output is a signed clinician
report with an anaesthesia plan suitable for the pre-operative record.

This form is the clinician counterpart to a patient self-report pre-operative
questionnaire: it is completed by an anaesthetist, surgeon, pre-op assessment
nurse, or perioperative physician rather than by the patient. It is aligned with
CPOC's _Preoperative Assessment and Optimization for Adult Surgery_ (June 2021)
and the Geeky Medics _Anaesthetic Pre-operative Assessment OSCE Guide_, and is
intended to support shared decision-making under the Montgomery consent
standard.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

- **Primary instrument:** ASA Physical Status Classification (I–VI) computed on
  objective clinician findings, with a clinician override + reason.
- **Secondary instruments:** Mallampati airway class (I–IV), Revised Cardiac
  Risk Index (RCRI, 0–6), STOP-BANG OSA screening (0–8), Clinical Frailty Scale
  (1–9), Duke Activity Status Index (DASI), ECOG performance status.
- **Composite perioperative risk:** Low / Moderate / High / Critical, driven by
  the worst-band finding across instruments (max-grade algorithm).

| Category | Drivers                                                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Low      | ASA I–II, Mallampati I–II, RCRI 0, STOP-BANG 0–2, CFS 1–3 — routine anaesthesia                                                                    |
| Moderate | any single mid-band finding — additional planning, senior review optional                                                                          |
| High     | ASA III, Mallampati III–IV, RCRI ≥ 2, STOP-BANG ≥ 5, CFS 5–6 — senior anaesthetist review, consider enhanced care                                  |
| Critical | ASA IV–V, predicted difficult airway plus significant cardiorespiratory comorbidity, CFS ≥ 7 — MDT pre-op review, consider critical care admission |

## 4. Inputs and outputs

**Inputs.** A typed assessment object whose shape mirrors the SQL schema in `sql/` (13 migration files). Unanswered text and enum fields default to `''`; unanswered numeric, date, and time fields default to `null`.

**Outputs.** A grading object emitted by the engine: scoring result (per the instrument named in §3), `firedRules[]`, `additionalFlags[]`, and a clinical / administrative report. Rendered as HTML in the browser, exported as PDF via the SvelteKit endpoint, and convertible to FHIR R5 Bundle, XML, JSON, CSV, or TSV.

## 5. Artefacts

Required artefacts and their current status:

| Subdirectory               | Role                                               |
| -------------------------- | -------------------------------------------------- |
| `sql`                      | source of truth                                    |
| `xml`                      | generated                                          |
| `fhir`                     | generated                                          |
| `protobuf`                 | generated                                          |
| `openapi`                  | generated                                          |
| `front-end-with-html`      | HTML + Lily (wizard + dashboard) — not implemented |
| `front-end-with-svelte`    | SvelteKit (wizard + dashboard) — not implemented   |
| `back-end-with-loco`       | Rust + Loco JSON API                               |
| `back-end-with-loco-setup` | generated scaffold script                          |

Generated artefacts (XML, FHIR R5, Protocol Buffers, OpenAPI, Loco setup script) are never hand-edited; re-run the generators in [`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 6. Acceptance criteria

- `bin/test-form pre-anaesthesia-assessment` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check pre-anaesthesia-assessment` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `pre-anaesthesia-assessment.front-end-with-html.v1` (HTML)
  - `pre-anaesthesia-assessment.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form pre-anaesthesia-assessment
```
