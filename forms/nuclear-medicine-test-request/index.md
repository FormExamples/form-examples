# Nuclear Medicine Test Request

A UK NHS–aligned **nuclear medicine (radionuclide imaging) request (referral)**
that a clinician completes to request a radionuclide study — for example a bone
scan, myocardial perfusion scan, V/Q lung scan, thyroid uptake, renal DMSA /
MAG3, gallium / octreotide, white-cell, or sentinel-node study. It records the
requested scan, the clinical indication and specific question, relevant history,
and the radiation-safety governance (pregnancy and breastfeeding status, renal
function, recent radionuclide exposure, weight) — then computes a **four-axis
grading** (appropriateness, preparation & radiation safety, request
completeness, and triage priority) plus a set of safety-critical flags. The
output is a vetting report that supports the nuclear-medicine department's
justification, triage, and booking decisions.

This form is the nuclear-medicine counterpart to the repository's other
clinician-driven imaging request forms. It is completed by a radiologist,
nuclear-medicine physician, oncologist, cardiologist, GP, or technologist rather
than by the patient, and is aligned with the ACR Appropriateness Criteria, RCR
iRefer, ARSAC guidance, the Ionizing Radiation (Medical Exposure) Regulations
IR(ME)R, and EANM / SNMMI procedure guidelines.

## Scope and intended users

- **Setting:** NHS nuclear-medicine department, cardiology, oncology, renal or
  respiratory clinic, GP referral, or imaging-department triage / vetting desk.
- **Users:** radiologists, nuclear-medicine physicians, oncologists,
  cardiologists, GPs, and technologists who vet incoming requests.
- **Patients:** patients of any age requiring a radionuclide imaging
  examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
unsafe to perform now, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / RCR iRefer (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preparation & radiation safety** | ARSAC / IR(ME)R / ICRP / EANM–SNMMI | prep_safety_band: ok / caution / contraindicated; radiation_dose_band: low / moderate / high |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety rule (confirmed or possible pregnancy, breastfeeding with a
long-retention radiopharmaceutical, recent interfering radionuclide study) drives
the **prep_safety_band** toward caution or contraindicated regardless of the
other axes, and a high-acuity indication auto-escalates the triage tier.

### Scan-type / indication map

| Scan type | Typical indication | Radiation dose band |
| --- | --- | --- |
| Bone scan (Tc-99m MDP) | suspected bone metastases | moderate |
| Myocardial perfusion (Tc-99m / Tl-201) | cardiac ischaemia | moderate–high |
| V/Q lung scan | pulmonary embolism | low |
| Thyroid uptake (I-123 / Tc-99m) | thyroid function | low |
| Renal DMSA | renal cortical assessment | low |
| Renal MAG3 | renal function / drainage | low |
| Gallium / octreotide (Ga-68 / In-111) | tumour or infection localization | high |
| White-cell scan | infection localization | moderate |
| Sentinel-node | sentinel-node mapping | low |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, weight |
| 3 | Requested examination | scan type, primary indication, specific clinical question, relevant history |
| 4 | Radiation safety | pregnancy status, breastfeeding, eGFR, recent other nuclear scan |
| 5 | IR(ME)R justification | justification statement, supervising consultant |
| 6 | Triage | requested urgency, requested-by date, setting, site |
| 7 | Review & submit | notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
pregnancy, breastfeeding, high-radiation-dose, recent-radionuclide-interference,
missing-indication, missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
nuclear-medicine-test-request/
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

- ACR Appropriateness Criteria (1–9 rating scale; nuclear-medicine variants).
  <https://acsearch.acr.org/list>
- RCR *iRefer: Making the best use of clinical radiology*.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- ACCF/ASNC/ACR/AHA/ASE/SCCT/SCMR/SNM Appropriate Use Criteria for Cardiac
  Radionuclide Imaging. <https://www.ahajournals.org/doi/10.1161/circulationaha.109.192519>
- ARSAC *Notes for guidance on the clinical administration of radiopharmaceuticals
  and use of sealed radioactive sources*.
  <https://www.gov.uk/government/publications/arsac-notes-for-guidance>
- Ionizing Radiation (Medical Exposure) Regulations 2017 (IR(ME)R) — justification,
  pregnancy and breastfeeding status.
  <https://www.legislation.gov.uk/uksi/2017/1322/contents>
- ICRP radiation protection of the pregnant patient in nuclear medicine; IAEA RPOP.
  <https://www.iaea.org/resources/rpop/health-professionals/nuclear-medicine/pregnant-women>
- EANM / SNMMI procedure guidelines and SNMMI Appropriate Use Criteria.
  <https://www.eanm.org/publications/guidelines/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / scan-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form nuclear-medicine-test-request
```
