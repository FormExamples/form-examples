# 1. Introduction and Goals

## 1.1 What the system is

The Medical Forms monorepo is a collection of **286 form projects** under
`forms/<slug>/`, each a self-contained, full-stack implementation of a single
clinical or administrative form. Every form:

- collects structured clinical or administrative data through a **single-page,
  step-by-step questionnaire** (a wizard on one URL — never a multi-page form);
- applies a **validated scoring or grading engine**;
- emits a **report** (HTML preview, PDF download, FHIR R5 Bundle, XML) with
  **safety-critical flags** raised by rule firing;
- carries **compliance attestations** for medical-device classification.

The domains span risk calculators (Framingham, QRISK3, PREVENT, SCORE2),
specialty assessments (cardiology NYHA/CCS, oncology ECOG, pulmonology GOLD,
renal KDIGO), symptom scales (PHQ-9, GAD-7, PCL-5), peri-operative records,
safety and safeguarding forms, administrative intake and release documents,
donation eligibility, occupational and workplace surveys, training checklists,
privacy notices, WHO referral and emergency forms, and UK statutory forms (DVLA,
MAT B1, LPA, fit-note).

The monorepo's reason to exist is a thesis: **one shared design — schema,
validation, accessibility contract, scoring-engine layout, and generation
pipeline — works uniformly across more than a hundred distinct domains.** The
value is in the uniformity, not in any single form.

Each form is delivered as:

- SQL migrations (Liquibase-style, PostgreSQL) — the **source of truth** for data shape;
- generated XML + DTD, FHIR HL7 R5 JSON, Protocol Buffers, and OpenAPI 3.1 per SQL entity;
- two front-ends (a wizard and a dashboard) in **HTML + Lily** and in **SvelteKit + Lily**;
- one back-end Rust JSON API crate (axum + Loco).

## 1.2 Quality goals

In priority order, the qualities that shape the architecture:

| # | Quality goal | What it means here |
| - | ------------ | ------------------ |
| 1 | **Uniformity** | Every form has the same directory layout, the same engine file structure, the same UI class vocabulary, the same API surface. A reviewer who knows one form knows all 286. |
| 2 | **Correctness & verifiability** | Grading engines are pure and unit-tested; every derived artefact is regenerated from source and checked for zero drift; every migration set applies cleanly to a fresh database. Correctness is *demonstrated by gates*, not asserted. |
| 3 | **Accessibility (WCAG 2 AA)** | Every front-end conforms to the Lily headless contract: labelled inputs, `aria-invalid`/`aria-describedby` wiring, an error summary that takes focus, a skip link, keyboard-operable wizard, AA colour contrast. |
| 4 | **Interoperability** | The same schema is projected to FHIR HL7 R5, XML/DTD, Protocol Buffers, and OpenAPI 3.1 so each form can exchange data with external health-IT systems. |
| 5 | **Spec-driven maintainability** | The spec is read before code is written; code changes *because* the spec changed. Generated artefacts are never hand-edited, so the source of truth stays singular. |

## 1.3 Stakeholders

| Stakeholder | Concern |
| ----------- | ------- |
| **Patients / self-reporting users** | Fill patient-facing intake and self-assessment wizards; need an accessible, understandable, resumable form. |
| **Clinicians / assessors** | Fill clinician-facing assessments; vet submissions on the dashboard; rely on the report, scores, and safety flags. |
| **Form authors / maintainers** | Add and evolve forms; depend on the uniform layout, the scaffolding tools, and the drift gates to keep 286 forms consistent. |
| **Integrators** | Consume the JSON API, FHIR bundles, OpenAPI specs, XML, and Protocol Buffers to connect forms to external systems. |
| **Regulatory / compliance reviewers** | Verify medical-device classification attestations (MDR/IVDR, UK MDR 2002, ISO/IEC/IEEE 26514, MHRA). |
| **AI coding agents** | Operate the repo through the `AGENTS.md` / `CLAUDE.md` instructions and the `bin/` toolchain. |
