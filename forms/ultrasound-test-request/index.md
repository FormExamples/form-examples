# Ultrasound Test Request

A UK NHS–aligned **general (non-obstetric) diagnostic ultrasound request
(referral)** that a clinician completes to request an ultrasound examination —
abdominal, pelvic, renal-tract, hepatobiliary, small-parts (thyroid, scrotum,
breast), soft-tissue, vascular (Doppler, DVT, carotid), or musculoskeletal. It
records the requested examination, the clinical indication and specific
question, relevant history, preparation requirements, and the requested urgency
— then computes a **four-axis grading** (appropriateness, preparation /
technical suitability, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the imaging
department's triage and booking decision.

This form is the general-imaging counterpart to the repository's obstetric
`pregnancy-ultrasound-test-request` and the other clinician-driven request
forms. It is completed by a radiologist, GP, hospital doctor, surgeon, or
sonographer rather than by the patient, and is aligned with the ACR
Appropriateness Criteria and the Royal College of Radiologists' iRefer
referral guidelines.

## Scope and intended users

- **Setting:** NHS radiology / ultrasound department, outpatient clinic,
  inpatient ward, community diagnostic centre, or emergency department, and the
  imaging-department triage / vetting desk.
- **Users:** radiologists, GPs, hospital doctors, surgeons, and sonographers who
  vet incoming requests.
- **Patients:** any patient requiring a general diagnostic ultrasound
  examination (this form is explicitly **not** for obstetric scanning).

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, technically limited, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preparation / technical suitability** | Prep checklist (fasting / full bladder) + body-habitus caveats | ok / caution / limited (+ prep requirements) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |

A red-flag (suspected DVT, suspected testicular torsion, suspected AAA)
**auto-escalates** the triage tier regardless of the other axes.

## Body region and indication map

| Body region | Typical indications | Prep |
| --- | --- | --- |
| Abdomen | abdominal-pain, palpable-mass, suspected-aaa | Fasting (upper abdomen) |
| Liver-biliary | suspected-gallstones, abnormal-lfts, abdominal-pain | Fasting |
| Renal-tract | renal-impairment, haematuria, abdominal-pain | Full bladder (lower tract) |
| Pelvis | palpable-mass, abdominal-pain | Full bladder |
| Thyroid-neck | thyroid-nodule, palpable-mass | None |
| Scrotum-testes | testicular-pain, palpable-mass | None |
| Breast | palpable-mass, follow-up | None |
| Soft-tissue / msk-joint | palpable-mass, follow-up | None |
| Vascular-doppler / carotid | follow-up, suspected-aaa | None |
| Dvt-leg | suspected-dvt | None |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | body region, laterality, primary indication |
| 4 | Clinical detail | specific clinical question, relevant history |
| 5 | Preparation | fasting required, full bladder required |
| 6 | Triage & submit | requested urgency, requested-by date, setting, site, notes |
| 7 | Review | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-dvt-urgent, suspected-testicular-torsion, suspected-aaa, prep-not-met,
missing-indication, missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
ultrasound-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml-representations/              # XML + DTD per SQL table (generated)
  fhir-r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-form-with-html/         # single-page HTML wizard
  front-end-form-with-svelte/       # SvelteKit single-page wizard
  front-end-dashboard-with-html/    # vetting dashboard (HTML table)
  front-end-dashboard-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
```

## Clinical references

- ACR Appropriateness Criteria (1–9 ordinal rating scale; 7–9 usually
  appropriate, 4–6 may be appropriate, 1–3 usually not appropriate).
  <https://acsearch.acr.org/list>
- ACR Appropriateness Criteria® *Right Upper Quadrant Pain* — ultrasound is the
  initial imaging modality of choice for suspected acute cholecystitis /
  gallstones. <https://www.jacr.org/article/S1546-1440(19)30153-X/fulltext>
- ACR Appropriateness Criteria® *Screening for Abdominal Aortic Aneurysm* —
  abdominal aortic ultrasound is the primary modality for AAA screening.
  <https://www.jacr.org/article/S1546-1440(24)00268-0/abstract>
- Royal College of Radiologists *iRefer: Making the best use of clinical
  radiology* (referral appropriateness guidance). <https://www.rcr.ac.uk/>
- BMUS *Guidelines for the use of ultrasound* and AIUM practice parameters for
  abdominal, pelvic, scrotal, thyroid, and vascular ultrasound.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / examination selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form ultrasound-test-request
```
