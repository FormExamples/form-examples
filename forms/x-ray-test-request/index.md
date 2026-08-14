# X-Ray Test Request

A UK NHS–aligned **plain-radiograph (X-ray) imaging request (referral)** that a
clinician completes to request a plain X-ray examination for a patient. It
records the requested body region and laterality, the clinical indication and
specific question, relevant history, radiation-safety details (pregnancy status
and recent similar exposure), the patient's mobility, and the requested urgency
— then computes a **four-axis grading** (appropriateness, radiation safety,
request completeness, and triage priority) plus a set of safety-critical flags.
The output is a vetting report that supports the imaging department's triage and
booking decision.

This form is the plain-radiograph counterpart to the repository's other
clinician-driven imaging-request forms (CT, MRI, ultrasound). It is completed by
a radiologist, GP, hospital doctor, surgeon, emergency physician, or radiographer
rather than by the patient, and is aligned with the ACR Appropriateness
Criteria, the Royal College of Radiologists *iRefer* guidelines, and the UK
Ionizing Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).

## Scope and intended users

- **Setting:** NHS outpatient clinic, emergency department, inpatient ward,
  community diagnostic centre, or imaging-department triage / vetting desk.
- **Users:** radiologists, GPs, hospital doctors, surgeons, emergency
  physicians, and radiographers who request or vet plain X-rays.
- **Patients:** any patient requiring a plain-radiograph examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
incomplete, carry a radiation-safety concern, or be urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / RCR *iRefer* (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Radiation safety** | IR(ME)R 2017 justification + relative effective-dose banding | safe / caution / contraindicated (+ dose band low / moderate / high) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity / red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |

A radiation-safety concern (pregnancy or possible pregnancy, an unjustified
exposure, or a recent duplicate of the same region) **does not auto-accept** —
it forces the *caution* or *contraindicated* band and raises a flag for the
vetting clinician, independent of the other axes.

### Body region and indication

| Body region | Typical indications | Dose band |
| --- | --- | --- |
| Chest | chest-infection, suspected-pneumothorax, line-position-check, pre-operative | low |
| Abdomen | abdominal-obstruction, swallowed-object, foreign-body | moderate |
| Spine (cervical / thoracic / lumbar) | trauma-fracture, arthritis, follow-up | moderate–high |
| Pelvis / hip | trauma-fracture, joint-pain, arthritis | moderate |
| Knee / ankle-foot / shoulder / wrist-hand | trauma-fracture, joint-pain, foreign-body | low |
| Skull | trauma-fracture, foreign-body | low |
| Dental | arthritis, foreign-body, follow-up | low |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | body region, laterality, primary indication |
| 4 | Clinical detail | specific clinical question, relevant history |
| 5 | Radiation safety | pregnancy status, recent similar X-ray, IR(ME)R justification |
| 6 | Practicalities | mobility, setting, requested-by date |
| 7 | Triage & submit | requested urgency, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
**pregnancy**, **repeat-recent-imaging**, **unjustified-exposure**,
**wrong-laterality-risk**, **missing-indication**, **missing-clinical-question**,
and **other**.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
x-ray-test-request/
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

- ACR Appropriateness Criteria (1–9 rating scale; plain-radiograph variants).
  <https://acsearch.acr.org/list>
- Royal College of Radiologists *iRefer: Making the best use of clinical
  radiology*. <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- The Ionizing Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
  <https://www.legislation.gov.uk/uksi/2017/1322/made>
- GOV.UK *Guidance to the Ionising Radiation (Medical Exposure) Regulations
  2017*. <https://www.gov.uk/government/publications/ionising-radiation-medical-exposure-regulations-2017-guidance/guidance-to-the-ionising-radiation-medical-exposure-regulations-2017>
- Care Quality Commission — IR(ME)R duty-holder responsibilities.
  <https://www.cqc.org.uk/guidance-providers/ionising-radiation/ionising-radiation-medical-exposure-regulations-irmer>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / appropriateness vetting.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form x-ray-test-request
```
