# Blood Cross-Match Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `blood-cross-match-test-request`

## 1. Purpose

A UK NHS–aligned **blood cross-match / transfusion compatibility request
(referral)** that a clinician completes to request group-and-save, antibody
screen, crossmatch, or emergency blood for a patient. It records the requested
test type and blood component, the clinical indication, the patient's ABO/Rh
blood group, antibody and transfusion history, pre-transfusion sample collection
and two-sample (group-check) status, and the requested urgency — then computes a
**four-axis grading** (appropriateness, identity / sample safety, request
completeness, and triage priority) plus a set of safety-critical flags. The
output is a vetting report that supports the transfusion laboratory's
acceptance, query, and prioritization decision.

This form is the transfusion-compatibility counterpart to the repository's other
clinician-driven request forms. It is completed by a doctor, nurse, midwife, or
operating-department practitioner rather than by the patient, and is aligned with
NICE NG24 *Blood transfusion*, British Society for Haematology (BSH)
pre-transfusion compatibility guidance, and the Serious Hazards of Transfusion
(SHOT) recommendations on positive patient identification and the two-sample
group-check rule.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, identity-unsafe, or time-critical.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG24 restrictive thresholds + indication (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Identity / sample safety** | BSH / SHOT positive patient ID + two-sample group-check rule | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist; indication, blood group and sample status weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / emergency / stat (+ target timeframe) |

> **Note on the 1–9 scale.** There is **no single published transfusion-ordering
> score** comparable to the ACR Appropriateness Criteria for imaging. The 1–9
> appropriateness axis here is **anchored on NICE NG24 restrictive thresholds**
> (e.g. a 70 g/L red-cell threshold, 80 g/L in acute coronary syndrome) and on
> indication appropriateness, and is explicitly labelled as such throughout the
> schema and engine.

A red-flag (declared major / massive haemorrhage, haemodynamic instability,
active uncontrolled bleeding) **auto-escalates** the triage tier regardless of
the other axes.

### Request types, components, and indications

| Request type | Component | Typical indication |
| --- | --- | --- |
| Group and save | none (sample only) | elective surgery with low expected blood loss |
| Antibody screen | none (sample only) | antenatal screening, pre-transfusion workup |
| Crossmatch | red cells | surgery with expected loss, symptomatic anaemia |
| Crossmatch | platelets / FFP / cryoprecipitate | thrombocytopenia, coagulopathy, massive transfusion |
| Emergency O-negative | red cells | major haemorrhage before group is known |

| Indication | NICE NG24 anchor |
| --- | --- |
| Surgery | predicted loss + restrictive threshold |
| Acute bleeding | major haemorrhage protocol, target Hb 70–90 g/L |
| Anaemia (non-bleeding) | restrictive 70 g/L threshold; consider alternatives |
| Obstetric haemorrhage | major haemorrhage protocol; anti-D relevance |
| Chemotherapy support | individualized threshold for chronic anaemia |
| Transfusion-dependent | individual thresholds and targets |

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

- `bin/test-form blood-cross-match-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check blood-cross-match-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `blood-cross-match-test-request.front-end-with-html.v1` (HTML)
  - `blood-cross-match-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form blood-cross-match-test-request
```
