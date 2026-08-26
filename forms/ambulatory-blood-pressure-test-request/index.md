# Ambulatory Blood Pressure Test Request

A UK NHS–aligned **ambulatory blood pressure monitoring (ABPM) request
(referral)** that a clinician completes to request 24-hour ambulatory blood
pressure monitoring (or home blood pressure monitoring) for a patient. It
records the most recent clinic blood pressure, the clinical indication and
specific question, current antihypertensive medication, symptoms and
accuracy-affecting factors, and the requested urgency — then computes a
**four-axis grading** (appropriateness, suitability, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the monitoring service's triage and booking decision.

This form is the cardiovascular-diagnostics counterpart to the repository's
other clinician-driven request forms. It is completed by a GP, hospital doctor,
cardiologist, nurse, or pharmacist rather than by the patient, and is aligned
with NICE NG136 *Hypertension in adults* and British and Irish Hypertension
Society (BIHS) ABPM measurement guidance.

## Scope and intended users

- **Setting:** GP surgery, hypertension clinic, cardiology outpatients,
  community diagnostic service, or monitoring-service triage / vetting desk.
- **Users:** GPs, hospital doctors, cardiologists, nurses, and pharmacists who
  raise or vet incoming ABPM requests.
- **Patients:** adults with elevated or labile clinic blood pressure, or under
  antihypertensive treatment, requiring out-of-office blood pressure monitoring.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, of limited measurement suitability, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG136 (1–9 ordinal; ABPM to confirm clinic BP ≥140/90) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Suitability** | Oscillometric accuracy factors — atrial fibrillation, arm size | ok / caution / limited |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question + clinic BP weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | NICE NG136 severe-BP escalation rules | routine / urgent / emergency (+ target timeframe) |

A severe or accelerated hypertension reading (clinic BP ≥180/120 mmHg)
**auto-escalates** the triage tier to urgent / same-day specialist review,
regardless of the other axes (NICE NG136).

### Appropriateness anchors (NICE NG136)

| Scenario | Direction |
| --- | --- |
| Clinic BP ≥140/90 and <180/120, confirming a new diagnosis | usually-appropriate (ABPM is the most accurate confirmation method) |
| Suspected white-coat or masked hypertension | usually-appropriate |
| Treatment monitoring of known hypertension | may-be-appropriate |
| Clinic BP well below 140/90 with no labile / symptom indication | usually-not-appropriate |
| Clinic BP ≥180/120 | same-day specialist review takes priority over routine ABPM |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested test | test type, primary indication, specific clinical question, relevant history |
| 4 | Clinic blood pressure | clinic systolic / diastolic, on antihypertensives, current medications |
| 5 | Symptoms & accuracy factors | dizziness, headache, atrial fibrillation, pregnant |
| 6 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
severe-hypertension-urgent, accelerated-hypertension,
atrial-fibrillation-accuracy, missing-clinic-bp, missing-indication,
missing-clinical-question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
ambulatory-blood-pressure-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml/              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-with-html/         # single-page HTML wizard
  front-end-with-svelte/       # SvelteKit single-page wizard
  front-end-with-html/    # vetting dashboard (HTML table)
  front-end-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NICE NG136 *Hypertension in adults: diagnosis and management* — offer ABPM to
  confirm diagnosis when clinic BP is ≥140/90 and <180/120 mmHg; clinic BP
  ≥180/120 mmHg prompts same-day specialist review.
  <https://www.nice.org.uk/guidance/ng136/chapter/recommendations>
- NICE QS28 *Hypertension in adults* — quality statement 1: diagnosis with ABPM.
  <https://www.nice.org.uk/guidance/qs28/chapter/quality-statement-1-diagnosis-ambulatory-blood-pressure-monitoring>
- British and Irish Hypertension Society (BIHS) — *Measurement of blood pressure
  in people with atrial fibrillation* (oscillometric accuracy guidance).
  <https://www.nature.com/articles/s41371-019-0261-4>
- BIHS — validated blood pressure monitor lists and ABPM guidance.
  <https://bihsoc.org/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / appropriateness selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form ambulatory-blood-pressure-test-request
```
