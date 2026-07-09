# PET Scan Test Request

A UK NHS–aligned **PET-CT (positron emission tomography) scan request
(referral)** that a clinician completes to request a PET-CT examination, most
commonly an oncology FDG-PET-CT for cancer staging, restaging, or
treatment-response assessment. It records the requested tracer and scan type,
the primary indication and specific clinical question, the primary tumour site
and relevant history, the FDG patient-preparation and safety data (diabetes,
blood glucose control, pregnancy, breastfeeding, renal function), the IR(ME)R
justification, and the requested urgency — then computes a **four-axis grading**
(appropriateness, preparation safety and radiation dose, request completeness,
and triage priority) plus a set of safety-critical flags. The output is a
vetting report that supports the nuclear-medicine department's triage and
booking decision.

This form is the molecular-imaging counterpart to the repository's other
clinician-driven imaging request forms (CT, MRI, ultrasound, echocardiogram). It
is completed by a radiologist, nuclear-medicine physician, oncologist, GP,
hospital doctor, or technologist rather than by the patient, and is aligned with
the ACR Appropriateness Criteria, RCR iRefer, EANM / SNMMI FDG-PET procedure
guidelines, and IR(ME)R radiation-justification duties.

## Scope and intended users

- **Setting:** NHS nuclear-medicine / PET-CT department, oncology
  multidisciplinary team (MDT), or imaging-department triage / vetting desk.
- **Users:** radiologists, nuclear-medicine physicians, oncologists, GPs,
  hospital doctors, and technologists who request or vet PET-CT studies.
- **Patients:** patients requiring a PET-CT examination for an oncological,
  cardiac, infective / inflammatory, or neurological indication.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
unsafe to prepare, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / RCR iRefer (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preparation safety & radiation dose** | EANM / SNMMI FDG-PET prep + IR(ME)R | prep-safety: ok / caution / contraindicated; radiation-dose: low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity / urgency escalation rules | routine / urgent / emergency (+ target timeframe) |

Axis B is driven by glucose control (FDG uptake needs blood glucose typically
**below 11 mmol/L**), pregnancy status, and breastfeeding. Pregnancy or
uncontrolled glucose force the **caution** or **contraindicated** band and a
safety flag, regardless of how appropriate the request is.

### Scan type and indication

| Scan type | Typical tracer | Common indications |
| --- | --- | --- |
| FDG-PET-CT | [18F]FDG | cancer staging / restaging, treatment response, suspected recurrence, lymphoma, solitary pulmonary nodule, infection / inflammation |
| PSMA-PET | [68Ga]/[18F]PSMA | prostate cancer staging / biochemical recurrence |
| DOTATATE-PET | [68Ga]DOTATATE | neuroendocrine tumour localisation / staging |
| Amyloid-PET | [18F] amyloid tracers | neurology — dementia / Alzheimer assessment |
| Cardiac-PET | [18F]FDG / perfusion | myocardial viability, cardiac sarcoid |

### FDG patient-preparation thresholds (EANM / SNMMI)

| Parameter | Target |
| --- | --- |
| Fasting | ≥ 4–6 hours (no caloric intake; water permitted) |
| Blood glucose (EANM) | below ~7 mmol/L preferred |
| Blood glucose (SNMMI) | 7–11 mmol/L acceptable; recheck / reschedule if above ~11 mmol/L |
| Diabetes | measure and document glucose before tracer; do not treat hyperglycaemia as an absolute contraindication |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, weight, setting, site |
| 3 | Requested examination | scan type / tracer, primary indication, specific clinical question |
| 4 | Clinical context | primary tumour site, relevant history, recent chemo / radiotherapy |
| 5 | Preparation & safety | diabetes, blood glucose (mmol/L), pregnancy status, breastfeeding, eGFR, claustrophobia |
| 6 | Radiation justification | IR(ME)R justification statement, urgency |
| 7 | Triage & submit | requested-by date, requester contact, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
**pregnancy**, **breastfeeding**, **uncontrolled-glucose** (above ~11 mmol/L),
**high-radiation-dose**, **missing-indication**, **missing-clinical-question**,
**missing-glucose** (no glucose recorded for an FDG study), and **other**.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
pet-scan-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
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
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- ACR Appropriateness Criteria (1–9 rating scale; oncology FDG-PET-CT variants
  for staging, restaging, and follow-up). <https://acsearch.acr.org/list>
- Royal College of Radiologists *iRefer: Making the best use of clinical
  radiology*. <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- EANM procedure guidelines for tumour imaging with [18F]FDG PET/CT (v3.0) —
  fasting and glucose-control thresholds.
  <https://www.sciencedirect.com/science/article/pii/S3051292125000065>
- SNMMI — *18F-FDG PET and PET/CT Patient Preparation: A Review of the
  Literature* (glucose 7–11 mmol/L target). <https://tech.snmjournals.org/content/42/1/5>
- UK Ionising Radiation (Medical Exposure) Regulations — IR(ME)R 2017
  justification of medical exposures.
  <https://www.legislation.gov.uk/uksi/2017/1322/contents>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / scan-type selection.
- UK Medical Devices Regulations 2002.
- UK Ionising Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form pet-scan-test-request
```
