# Electrocardiogram Test Request

A UK NHS–aligned **electrocardiogram (ECG) test request (referral)** that a
clinician completes to request a cardiac ECG examination for a patient. It
records the requested ECG type, the clinical indication and specific question,
relevant cardiac history and medications, symptoms and red flags, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
urgency, request completeness, and clinical priority) plus a set of
safety-critical flags. The output is a vetting report that supports the cardiac
physiology department's triage and booking decision.

This form is the cardiology-diagnostics counterpart to the repository's other
clinician-driven request forms. It is completed by a cardiologist, GP, hospital
doctor, nurse, physiologist, or emergency physician rather than by the patient,
and is aligned with AHA/ACC ECG-use guidance and NICE chest-pain (CG95) and
acute coronary syndrome (ACS) pathways.

## Scope and intended users

- **Setting:** NHS cardiology clinic, GP surgery, acute medical unit, emergency
  department, pre-operative assessment clinic, or cardiac-physiology triage /
  vetting desk.
- **Users:** cardiologists, GPs, hospital doctors, nurses, cardiac
  physiologists, and emergency physicians who raise or vet incoming requests.
- **Patients:** people of any age requiring a cardiac ECG examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | AHA/ACC ECG-use guidance + indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | Red-flag escalation (NICE CG95 / ACS pathway) | triage tier routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Composite acuity band | low / moderate / high |

Any red flag — suspected ACS, active chest pain, syncope, or suspected VT —
**auto-escalates** the triage tier and clinical priority regardless of the other
axes. Suspected ACS or active chest pain implies an **emergency, same-hour**
12-lead ECG.

### ECG type and indication matching

| ECG type | Typical indications | Notes |
| --- | --- | --- |
| Resting 12-lead | chest pain, suspected MI/ACS, pre-operative, hypertension, screening | Fastest, first-line; same-hour for suspected ACS (NICE CG95) |
| Exercise stress | suspected stable angina, exercise-induced symptoms | Increasingly superseded by imaging; check local pathway |
| Ambulatory Holter 24h | palpitations, suspected arrhythmia (≥ daily) | Continuous capture for frequent symptoms |
| Ambulatory 48h | palpitations, suspected arrhythmia (every 1–2 days) | Longer continuous capture |
| Event recorder | infrequent palpitations / syncope | Patient-triggered for sporadic symptoms |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested examination | ECG type, primary indication, specific clinical question, relevant history |
| 4 | Symptoms & red flags | chest pain, palpitations, syncope, breathlessness, dizziness, currently symptomatic, suspected ACS, known arrhythmia |
| 5 | Medications | relevant medications (QT-prolonging / rate-controlling) |
| 6 | Triage | requested urgency, requested-by date, setting, site |
| 7 | Review & submit | notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected ACS, active chest pain, syncope red flag, suspected VT, missing
indication, missing clinical question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / cardiology
  information system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
electrocardiogram-test-request/
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

- AHA/ACC Guidelines for Ambulatory Electrocardiography (Holter / event
  monitoring indications).
  <https://www.ahajournals.org/doi/10.1161/01.cir.100.8.886>
- ACC/AHA Clinical Competence Statement on Electrocardiography and Ambulatory
  Electrocardiography (resting 12-lead ECG as first-line diagnostic).
  <https://www.ahajournals.org/doi/10.1161/circ.104.25.3169>
- NICE CG95 *Recent-onset chest pain of suspected cardiac origin: assessment and
  diagnosis* (resting 12-lead ECG as soon as possible; STEMI / NSTEMI pathway).
  <https://www.nice.org.uk/guidance/cg95/chapter/recommendations>
- NICE *Acute coronary syndromes* (NG185) — same-hour ECG and troponin pathway.
  <https://www.nice.org.uk/guidance/ng185>
- Holter Monitor — StatPearls / NCBI Bookshelf (ambulatory monitoring overview).
  <https://www.ncbi.nlm.nih.gov/books/NBK538203/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form electrocardiogram-test-request
```
