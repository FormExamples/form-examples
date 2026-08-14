# Cardiac Stress Test Request

A UK NHS–aligned **cardiac stress / exercise test request (referral)** that a
clinician completes to request a stress test for a patient with suspected or
known cardiac disease. It records the requested test modality, the clinical
indication and specific question, relevant history, presenting symptoms,
ability to exercise, and the cardiac safety factors (known CAD, recent acute
coronary syndrome, aortic stenosis, uncontrolled hypertension, beta-blocker use)
— then computes a **four-axis grading** (appropriateness, safety /
contraindication, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the cardiac
investigations department's triage and booking decision.

This form is the cardiac-investigations counterpart to the repository's other
clinician-driven request forms. It is completed by a cardiologist, GP, hospital
doctor, cardiac physiologist, or nurse rather than by the patient, and is
aligned with ACC/AHA exercise-testing and multimodality Appropriate Use Criteria
and ESC chronic coronary syndromes guidance.

## Scope and intended users

- **Setting:** NHS cardiology clinic, rapid-access chest-pain clinic, GP
  surgery, inpatient ward, or cardiac-physiology triage / vetting desk.
- **Users:** cardiologists, GPs, hospital doctors, cardiac physiologists, and
  nurses who request or vet stress tests.
- **Patients:** adults with suspected or known coronary artery disease, valve
  disease, arrhythmia, or pre-operative cardiac risk who require a stress test.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
unsafe to perform as requested, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACC/AHA Appropriate Use Criteria for stress testing (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Safety / contraindication** | ACC/AHA exercise-testing contraindications + ESC valve guidance | ok / caution / contraindicated |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety contraindication (recent acute coronary syndrome, severe symptomatic
aortic stenosis, uncontrolled hypertension, inability to exercise for an
exercise test) drives the safety axis and **auto-escalates or blocks** the
request regardless of the other axes.

### Test-type and indication map

| Test type | Typical indication | Notes |
| --- | --- | --- |
| Exercise treadmill ECG | Suspected angina, exercise tolerance | Requires ability to exercise; uninterpretable with LBBB / paced rhythm |
| Stress echocardiography | Suspected / known CAD, valve disease | Imaging stress; exercise or pharmacological |
| Dobutamine stress echo | Unable to exercise | Pharmacological alternative to exercise stress |
| Myocardial perfusion SPECT | Risk stratification, known CAD | Functional perfusion imaging |
| Stress cardiac MRI | Known CAD assessment, perfusion / viability | High-resolution functional imaging |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | test type, primary indication, specific clinical question, relevant history |
| 4 | Symptoms & exercise capacity | chest pain, breathlessness, palpitations, able to exercise, resting ECG findings |
| 5 | Cardiac safety screen | known CAD, recent ACS, aortic stenosis severity, uncontrolled hypertension, beta-blocker |
| 6 | Triage | requested urgency, requested-by date, setting |
| 7 | Review & submit | notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **recent-acs-contraindication** — recent acute coronary syndrome (absolute
  contraindication to exercise testing when very recent).
- **severe-aortic-stenosis** — severe (symptomatic) aortic stenosis; exercise
  testing contraindicated, prefer coronary angiography.
- **uncontrolled-hypertension** — relative contraindication; control BP first.
- **unable-to-exercise** — exercise test requested but patient cannot exercise;
  redirect to a pharmacological / imaging modality.
- **missing-indication** — no primary indication supplied.
- **missing-clinical-question** — no specific clinical question supplied.
- **other** — any other safety concern.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
cardiac-stress-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
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
```

## Clinical references

- ACC/AHA 2002 Guideline Update for Exercise Testing (absolute / relative
  contraindications; recent MI, unstable angina, decompensated heart failure,
  symptomatic severe aortic stenosis, uncontrolled arrhythmia).
  <https://www.ahajournals.org/doi/10.1161/01.cir.0000034670.06526.15>
- ACC/AHA/ASE/ASNC/.../STS 2023 Multimodality Appropriate Use Criteria for the
  Detection and Risk Assessment of Chronic Coronary Disease (1–9 AUC ratings).
  <https://www.jacc.org/doi/10.1016/j.jacc.2023.03.410>
- 2024 ESC Guidelines for the management of chronic coronary syndromes
  (exercise ECG, stress imaging selection by clinical likelihood).
  <https://academic.oup.com/eurheartj/article/45/36/3415/7743115>
- ESC valvular heart disease guidance — exercise testing contraindicated in
  symptomatic severe aortic stenosis.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8961810/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form cardiac-stress-test-request
```
