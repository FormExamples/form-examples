---
name: form-examples-skill
description: Explains concepts, terminology, and worked examples from the form-examples medical-forms monorepo (355 clinical/administrative forms) — what a form's grading axes mean, how to read a persona or example fixture, and how forms are categorized. Use when a user asks what a form or field means, how a score/grade is computed, wants a worked/example answer for a form, or is browsing what this repo covers.
---

# Form Examples

`form-examples` is a monorepo of structured clinical assessments, patient
intake forms, cardiovascular risk calculators, administrative healthcare
documents, privacy notices, and staff training checklists — one directory per
form under `forms/<slug>/`. Each form is a single-page, step-by-step
questionnaire that applies a validated scoring or grading engine and produces
a clinical report with flagged issues. This skill is the end-user-facing
guide to the concepts and terminology; for repository implementation work,
use `form-examples-maintainer-skill` instead.

## Core concepts

- **Form / project** — one clinical instrument or document, e.g.
  `forms/apgar-score/` or `forms/allergy-skin-test-result/`. Every form has
  the same shape: a clinical spec, a SQL schema, generated data
  representations, front-ends, and a back-end API.
- **Scoring / grading engine** — the pure function that turns filled-in
  answers into a result. Simpler forms return a single score (e.g. Apgar 0–10).
  The `*-test-request` / `*-test-result` family and many assessments use a
  **four-axis grading pattern** instead:
  1. **Classification** — normal / abnormal / critical / inconclusive.
  2. **Severity** — none / minor / moderate / major, often with a free
     descriptive label.
  3. **Completeness** — 0–100% of mandatory report sections filled in.
  4. **Follow-up urgency** — routine / recommended / urgent / critical-alert,
     with a target timeframe and recommended action.
- **Flags / fired rules** — safety-relevant conditions the engine detects
  (e.g. "critical result not yet communicated", "report incomplete"), each
  with a stable rule ID shared across every implementation of that form.
- **Persona** — a realistic, named example of a filled-in form plus the exact
  grade/flags the engine must produce for it, in
  `forms/<slug>/examples/personas.json` (not every form has one yet). Read
  these to see how a form actually grades a realistic clinical scenario,
  including edge cases and any documented quirks of that engine.
- **Example fixture** — `forms/<slug>/examples/assessment.json`, a
  structurally valid but mostly blank/typed example of the form's data shape
  (paired with a FHIR R5 Bundle sample), useful for seeing the field names
  and types rather than a realistic scenario.
- **Clinical documentation** — `forms/<slug>/doc/` cites the instrument or
  regulation a form implements (e.g. the published scoring guide for a
  validated scale).
- **Living spec** — `forms/<slug>/spec/index.md` is the hand-maintained,
  authoritative description of that form's domain and engine contract; a
  form's `README.md` symlinks to `index.md` for GitHub rendering.

## Data conventions worth knowing

- An unanswered text or enum field is stored as an empty string `''`; an
  unanswered numeric, date, or time field is `null`.
- Field names are `camelCase` in TypeScript/front-end code and `snake_case`
  in SQL and Rust internals — the same field, two spellings, by layer.
- Every table has UUIDv4 primary keys and `created_at` / `updated_at` /
  `deleted_at` timestamps.
- Data can be imported/exported as JSON, XML, CSV, or TSV.

## Form categories

| Category | Examples |
| --- | --- |
| Risk scores & calculators | Framingham, QRISK3-based heart health check, PREVENT, SCORE2-Diabetes |
| Specialty assessments | Cardiology (NYHA/CCS), Oncology (ECOG), Pulmonology (GOLD), Renal (KDIGO) |
| Symptom scales | PHQ-9, GAD-7, PCL-5, DLQI, PSQI, ESAS-r, SNOT-22, DHI |
| Pre-op / peri-op | Pre-operative assessment (ASA), Anesthesiology, Post-operative report |
| Safety & safeguarding | Fall risk, Casualty card (NEWS2), Medical error report, Consent |
| Administrative | Patient intake, Medical records release, Hospital discharge, Transfer |
| Donation & eligibility | Blood donation (JPAC), Organ donation, Bone marrow, Semaglutide |
| Occupational & workplace | Workplace safety (HSE), Workplace stress, Workplace climate, Ergonomics |
| Training & certification | CPR training, First aid, EMT psychomotor, Medical language speaking |
| Privacy & legal | Care privacy notice, Code of conduct notice, Research privacy notice |
| WHO referral & emergency | Acute referral, Counter-referral, Prehospital, Emergency unit forms |
| UK statutory | DVLA B1/M1/V1, MAT B1 maternity certificate, LPA, fit-note (Med 3) |

Diagnostic tests come in request/result pairs — e.g.
`forms/blood-test-request/` (the referral) and `forms/blood-test-result/`
(the reporting clinician's interpretation of the findings); the result form
is where the four-axis grading engine lives.

## Finding an answer

1. **"What does form X measure / what fields does it have?"** — read
   `forms/<slug>/index.md` (clinical overview) and `forms/<slug>/spec/index.md`
   (the living contract).
2. **"What would this form produce for a realistic case?"** — read
   `forms/<slug>/examples/personas.json` if it exists; each entry has a plain
   description plus the exact computed `expected` output.
3. **"What's the blank/typed shape of the data?"** — read
   `forms/<slug>/examples/assessment.json`.
4. **"What clinical source is this based on?"** — read `forms/<slug>/doc/`.
5. **"What's the full list of forms?"** — see `forms/AGENTS.md` (alphabetical
   index) or the root [`index.md`](../index.md) form-categories table.
6. **General architecture / bigger picture** — see [`docs/index.md`](../docs/index.md)
   (guides) and [`docs/tutorials/`](../docs/tutorials) (hands-on walkthroughs),
   or the full [`arc42/index.md`](../arc42/index.md) architecture document.
