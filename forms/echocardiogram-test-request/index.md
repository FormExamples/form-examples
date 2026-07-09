# Echocardiogram Test Request

A UK NHS–aligned **cardiac echocardiogram request (referral)** that a clinician
completes to request an echocardiogram (echo) examination for a patient. It
records the requested echo type, the clinical indication and specific question,
relevant cardiac history, symptoms and NYHA functional class, ECG and
natriuretic-peptide findings, any previous echo, cardiotoxic-chemotherapy
status, and the requested urgency — then computes a **four-axis grading**
(appropriateness, urgency, request completeness, and clinical priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
echo / cardiac-physiology department's triage and booking decision.

This form is the cardiac-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by a cardiologist, GP, hospital
doctor, heart-failure nurse, or cardiac physiologist rather than by the patient,
and is aligned with the ACC/AHA/ASE Appropriate Use Criteria for echocardiography,
British Society of Echocardiography (BSE) referral guidance, and NICE NG106
chronic heart failure (NT-proBNP thresholds).

## Scope and intended users

- **Setting:** NHS cardiology clinic, heart-failure service, general practice,
  acute medical unit, oncology / cardio-oncology service, or echo-department
  triage / vetting desk.
- **Users:** cardiologists, GPs, hospital doctors, heart-failure specialist
  nurses, and cardiac physiologists who vet incoming requests.
- **Patients:** adults requiring a cardiac echocardiogram for any recognised
  indication.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, urgent, or low clinical priority.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACC/AHA/ASE & BSE Appropriate Use Criteria (1–9 ordinal) | appropriate (7–9) / may-be-appropriate (4–6) / rarely-appropriate (1–3) |
| **B. Urgency** | BSE referral acuity / red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | NYHA class, natriuretic peptide (NICE NG106), suspected severe pathology | low / moderate / high |

A red flag (suspected endocarditis, severe symptomatic valve disease, acute
heart failure) **auto-escalates** the urgency tier regardless of the other axes.

### Echo-type and indication map

| Echo type | Typical use |
| --- | --- |
| Transthoracic (TTE) | First-line study for nearly all indications |
| Transoesophageal (TOE) | Endocarditis, valve detail, cardiac source of embolism, pre-cardioversion thrombus |
| Stress echo | Inducible ischaemia, low-flow low-gradient aortic stenosis, viability |
| Contrast echo | Poor acoustic windows, LV opacification, suspected apical pathology |

| Indication | Notes |
| --- | --- |
| Heart failure | Confirm/characterise; LVEF; prioritised by NT-proBNP (NICE NG106) |
| Murmur / suspected valve disease | Assess severity and ventricular response |
| Breathlessness | Distinguish cardiac vs non-cardiac cause |
| Palpitations | Structural substrate assessment |
| Chest pain | Structural / functional assessment alongside ischaemia work-up |
| Hypertension | Left-ventricular hypertrophy, diastolic function |
| Cardiomyopathy | Diagnosis and surveillance |
| Endocarditis | TTE then TOE; urgent (high-priority flag) |
| Post-MI | LV function, complications |
| Pulmonary hypertension | RV function, estimated PA pressures |
| Pre-chemotherapy / cardio-oncology | Baseline and serial LVEF for cardiotoxic agents |
| Stroke / TIA source | Cardiac source of embolism |
| Congenital | Structural assessment, surveillance |
| Surveillance of known disease | Interval reassessment |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, height/weight/BMI |
| 3 | Requested examination | echo type, primary indication, specific clinical question |
| 4 | Clinical history | relevant history, relevant medications, previous echo + date, known ejection fraction |
| 5 | Symptoms & functional status | breathlessness, chest pain, palpitations, syncope, oedema, NYHA class |
| 6 | Investigations | ECG findings, BNP / NT-proBNP, known murmur, cardiotoxic chemotherapy |
| 7 | Red flags | suspected endocarditis, severe symptomatic valve disease, acute heart failure |
| 8 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected endocarditis, severe symptomatic valve disease, acute heart failure,
raised BNP / NT-proBNP, rarely-appropriate indication, missing indication,
missing clinical question, duplicate recent echo, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / cardiology
  information system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
echocardiogram-test-request/
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

- ACC/AATS/AHA/ASE/ASNC/HRS/SCAI/SCCT/SCMR/STS 2019 Appropriate Use Criteria for
  Multimodality Imaging in the Assessment of Cardiac Structure and Function in
  Nonvalvular Heart Disease (1–9 rating scale).
  <https://www.jacc.org/doi/10.1016/j.jacc.2018.10.038>
- 2017 ACC/AHA/ASE Appropriate Use Criteria for Multimodality Imaging in Valvular
  Heart Disease.
  <https://www.acc.org/>
- British Society of Echocardiography (BSE) — referral, protocols, and minimum
  datasets. <https://www.bsecho.org/>
- NICE NG106 *Chronic heart failure in adults: diagnosis and management* —
  NT-proBNP referral thresholds (>2000 ng/L urgent echo within 2 weeks;
  400–2000 ng/L echo within 6 weeks; <400 ng/L makes HF unlikely).
  <https://www.nice.org.uk/guidance/ng106/chapter/recommendations>
- ESC 2023 Guidelines for the management of endocarditis (echo in suspected
  infective endocarditis). <https://www.escardio.org/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / echo-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form echocardiogram-test-request
```
