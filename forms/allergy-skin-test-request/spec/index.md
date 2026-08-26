# Allergy Skin Test Request — specification

This file is the **living domain spec** for this form. It captures the contract each implementation (SQL schema, generated representations, front-ends, and Rust backend) must satisfy. Treat it as the source of truth for behaviour — update the spec before changing code.

Slug: `allergy-skin-test-request`

## 1. Purpose

A UK NHS–aligned **allergy testing request (referral)** that a clinician
completes to request allergy diagnostic testing — skin-prick testing,
intradermal testing, patch testing, specific-IgE blood testing, or a
drug-provocation challenge — for a patient with suspected allergic disease. It
records the requested test type, the allergen panels of interest, the clinical
indication and specific question, the relevant clinical history, and the
validity-and-safety history (antihistamines, beta-blockers, active skin disease,
prior anaphylaxis) — then computes a **four-axis grading** (appropriateness,
validity and safety, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the allergy
service's triage and booking decision.

This form is the allergy-diagnostics counterpart to the repository's other
clinician-driven request forms. It is completed by an allergist-immunologist,
GP, dermatologist, hospital doctor, or nurse rather than by the patient, and is
aligned with BSACI and EAACI skin-test and specific-IgE guidance — including the
requirement to withhold antihistamines for an appropriate washout before skin
testing.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, scoring engine, four front-ends (form + dashboard, each in HTML and SvelteKit), and the Rust full-stack crate listed in §5. Out of scope: hosted deployment, authentication, multi-tenancy.

## 3. Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
invalid (e.g. the patient is on antihistamines), incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | BSACI / EAACI indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Validity and safety** | Antihistamine, beta-blocker, anaphylaxis, and skin-disease rules | ok / caution / contraindicated |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question, and allergen selection weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency escalation rules | routine / urgent (+ target timeframe) |

The validity-and-safety axis encodes the most important pre-analytic rule in
allergy diagnostics: **antihistamines suppress the weal-and-flare response and
invalidate skin-prick and intradermal tests**, so they must be withheld for an
appropriate washout (typically five half-lives) before testing. A **beta-blocker
with a history of anaphylaxis** raises a caution because adrenaline may be less
effective if a systemic reaction occurs during testing. **Active skin disease**
at the test site (eczema, dermographism) can invalidate or distort the result.

### Test types, allergen panels, and indications

| Test type | Typical use |
| --- | --- |
| Skin-prick test | First-line for IgE-mediated food, aeroallergen, venom, latex allergy |
| Intradermal test | Drug and venom allergy when skin-prick is negative |
| Patch test | Delayed-type contact dermatitis (contact allergens) |
| Specific-IgE blood | When skin testing is unsafe / invalid (antihistamines, skin disease, anaphylaxis risk) |
| Drug-provocation challenge | Gold standard for confirming / excluding drug allergy, supervised setting |

| Allergen panel | Examples |
| --- | --- |
| Aeroallergens | Pollens, house dust mite, animal dander, moulds |
| Food | Milk, egg, peanut, tree nut, fish, shellfish, wheat, soy |
| Drug | Beta-lactams, NSAIDs, perioperative agents |
| Venom | Bee, wasp / Vespula venom |
| Latex | Natural rubber latex |
| Contact | Nickel, fragrances, preservatives (patch-test series) |

| Primary indication | Notes |
| --- | --- |
| Suspected food allergy | Skin-prick / specific-IgE first-line |
| Suspected drug allergy | Skin / intradermal / provocation; specialist setting |
| Rhinitis / asthma | Aeroallergen skin-prick / specific-IgE |
| Anaphylaxis investigation | Identify trigger; resuscitation-ready |
| Venom allergy | Skin-prick then intradermal; specific-IgE |
| Contact dermatitis | Patch testing |
| Urticaria | Targeted testing only where a trigger is suspected |

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

- `bin/test-form allergy-skin-test-request` exits cleanly.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md))
  and pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).
- `bin/lily-html-refactor --check allergy-skin-test-request` reports no drift.
- LocalStorage keys preserve draft state across reloads:
  - `allergy-skin-test-request.front-end-with-html.v1` (HTML)
  - `allergy-skin-test-request.front-end-with-svelte.v1` (SvelteKit)

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
bin/test-form allergy-skin-test-request
```
