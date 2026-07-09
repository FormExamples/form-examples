# MRI Scan Test Request

A UK NHS–aligned **MRI scan request (referral)** that a clinician completes to
request a magnetic-resonance-imaging examination. It records the requested body
region and clinical indication, the specific clinical question, contrast and
gadolinium / renal (NSF) risk, a structured **MRI safety screen** for
ferromagnetic and electronic implants, and the requested urgency — then computes
a **four-axis grading** (appropriateness, MRI safety, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the imaging department's safety review, protocolling, and
booking decision.

This form is the cross-sectional-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by a radiologist, GP, hospital
doctor, neurologist, orthopaedic surgeon, oncologist, or radiographer rather
than by the patient, and is aligned with the ACR Appropriateness Criteria, the
ACR Manual on MR Safety, MHRA device-safety guidance, and ESUR / RCR gadolinium
guidance.

## Scope and intended users

- **Setting:** NHS radiology department, outpatient clinic, inpatient ward, or
  imaging-department triage / vetting desk.
- **Users:** radiologists, GPs, hospital doctors, neurologists, orthopaedic
  surgeons, oncologists, and radiographers who vet incoming requests.
- **Patients:** anyone requiring an MRI examination, subject to MRI safety
  screening.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, unsafe to scan, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. MRI safety** | ACR Manual on MR Safety / MHRA implant screening; gadolinium-vs-eGFR contrast-renal flag | cleared / conditional / needs-mri-physics-review / contraindicated (+ contrast-renal flag) |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question, and safety screen weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency / red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |

A positive **MRI safety** screen item (pacemaker / ICD, aneurysm clip, orbital
foreign body) drives axis B toward *needs-mri-physics-review* or
*contraindicated* regardless of the other axes, and an **emergency** indication
auto-escalates the triage tier.

### MRI safety note

MRI uses a strong static magnetic field that is always on. Ferromagnetic and
active electronic implants can heat, move, or malfunction in the bore. The
following screen items are safety-critical and must be resolved before scanning:

- **Absolute / high-risk:** cardiac pacemaker or ICD (unless MR-conditional and
  programmed for MRI), intracranial aneurysm clip of unknown / ferromagnetic
  type, metallic foreign body in the eye / orbit.
- **Conditional:** cochlear implant, programmable CSF shunt, neurostimulator,
  metal implant or prosthesis, insulin pump — each requires MR-conditional
  labelling, correct field strength, and protocol confirmation.
- **Logistical:** claustrophobia (sedation / open-bore), weight versus bore /
  table limit.

### Gadolinium and renal (NSF) risk

When IV gadolinium contrast is requested, the engine compares it with the
patient's eGFR (ESUR / RCR guidance): **eGFR < 30 mL/min/1.73 m²** is treated as
*contraindicated* (nephrogenic-systemic-fibrosis risk), **eGFR 30–60** as
*caution* (use a group II / low-risk agent only when necessary), and a previous
moderate–severe gadolinium reaction is flagged independently.

### Body regions and indications

| Body region | Typical indications |
| --- | --- |
| Brain | suspected stroke, suspected MS, epilepsy, dementia, pituitary, neurological deficit |
| Spine (cervical / thoracic / lumbar) | back pain with radiculopathy, neurological deficit, suspected malignancy |
| Head & neck | suspected malignancy, cancer staging |
| Chest / abdomen / pelvis | suspected malignancy, cancer staging, follow-up surveillance |
| Cardiac | cardiac function |
| MR angiogram | vascular assessment |
| Breast | suspected malignancy, cancer staging |
| Musculoskeletal joint | joint derangement |
| Whole body | cancer staging, surveillance |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, weight, interpreter needs |
| 3 | Requested examination | body region, primary indication, specific clinical question, relevant history |
| 4 | Contrast & renal | contrast required, eGFR, previous gadolinium reaction, pregnancy status |
| 5 | MRI safety screen | pacemaker / ICD, cochlear implant, aneurysm clip, orbital foreign body, shrapnel, shunt, neurostimulator, metal implant, insulin pump, claustrophobia, preliminary safety status |
| 6 | Prior imaging | relevant previous imaging for comparison |
| 7 | Logistics | weight versus bore limit, setting, site |
| 8 | Triage & submit | requested urgency, requested-by date, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
ferromagnetic implant, pacemaker / ICD, orbital foreign body, gadolinium–renal
risk, pregnancy, claustrophobia, missing safety screen, missing indication,
missing clinical question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
mri-scan-test-request/
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

- ACR Appropriateness Criteria (1–9 rating scale; usually-appropriate 7–9,
  may-be-appropriate 4–6, usually-not-appropriate 1–3).
  <https://acsearch.acr.org/list>
- ACR Manual on MR Safety (2024 update); MR safety zones, MR Safe / Conditional /
  Unsafe labelling, implant screening.
  <https://www.acr.org/Clinical-Resources/Radiology-Safety/MR-Safety>
- MHRA *Safety guidelines for magnetic resonance imaging equipment in clinical
  use*. <https://www.gov.uk/government/publications/safety-guidelines-for-magnetic-resonance-imaging-equipment-in-clinical-use>
- ESUR Contrast Media Safety Committee Guidelines (gadolinium, NSF, eGFR < 30
  contraindication). <https://www.esur.org/guidelines/>
- RCR *Guidance on gadolinium-based contrast agent administration to adult
  patients* (2019). <https://www.rcr.ac.uk/>
- Royal College of Radiologists *iRefer: making the best use of clinical
  radiology*. <https://www.irefer.org.uk/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives safety review / triage.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form mri-scan-test-request
```
