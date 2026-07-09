# CT Scan Test Request

A UK NHS–aligned **CT (computed tomography) scan request (referral)** that a
clinician completes to request a CT examination for a patient. It records the
requested body region, the clinical indication and specific question, relevant
history, the contrast and radiation-safety factors (renal function, allergy,
metformin, pregnancy), the IR(ME)R radiation justification, and the requested
urgency — then computes a **four-axis grading** (appropriateness, radiation /
contrast safety, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the imaging
department's triage and protocolling decision.

This form is the cross-sectional-imaging counterpart to the repository's other
clinician-driven request forms (e.g. *Pregnancy Ultrasound Test Request*). It is
completed by a radiologist, GP, hospital doctor, surgeon, oncologist, emergency
physician, or radiographer rather than by the patient, and is aligned with the
ACR Appropriateness Criteria, the Royal College of Radiologists (RCR) *iRefer*
guidance, ESUR contrast-media safety guidelines, and the UK Ionising Radiation
(Medical Exposure) Regulations — IR(ME)R 2017.

## Scope and intended users

- **Setting:** NHS radiology department, outpatient clinic, inpatient ward,
  emergency department, or imaging-department triage / vetting desk.
- **Users:** radiologists, GPs, hospital doctors, surgeons, oncologists,
  emergency physicians, and radiographers who vet incoming requests.
- **Patients:** any patient requiring a CT examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
unsafe for contrast, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Radiation & contrast safety** | RCR *iRefer* / ESUR contrast guidelines + IR(ME)R | contrast-safety band (safe / caution / contraindicated), estimated-dose band (low / moderate / high), renal-risk flag |
| **C. Request completeness** | Mandatory-field checklist; indication, clinical question + IR(ME)R justification weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety condition (pregnancy with planned exposure, severe contrast allergy,
low eGFR with IV contrast) **auto-escalates** the relevant flag and can move the
contrast-safety band to *contraindicated* regardless of the other axes.

### Estimated radiation dose by study (illustrative)

| Study | Typical effective dose band |
| --- | --- |
| CT head | low |
| CT cervical spine / neck | low–moderate |
| CT chest / CT pulmonary angiogram | moderate |
| CT abdomen–pelvis | moderate–high |
| CT colonography | moderate–high |
| Whole-body / multi-phase CT | high |

## Body region and indication

| Body region | Common indications |
| --- | --- |
| Head | suspected-stroke, trauma, headache |
| Neck | suspected-malignancy, infection-abscess |
| Chest | pulmonary-embolism, suspected-malignancy, cancer-staging |
| Abdomen / pelvis / abdomen-pelvis | abdominal-pain, renal-colic, infection-abscess, cancer-staging |
| Spine | trauma, pre-surgical-planning |
| CT angiogram | pulmonary-embolism, trauma |
| CT colonography | suspected-malignancy, follow-up-surveillance |
| Whole-body | cancer-staging, trauma |
| Extremity | trauma, pre-surgical-planning |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, weight, interpreter needs |
| 3 | Requested examination | body region, primary indication, specific clinical question |
| 4 | Clinical context | relevant history, relevant previous imaging |
| 5 | Contrast & renal safety | contrast required, eGFR, iodine contrast allergy, previous contrast reaction, metformin, diabetes, renal impairment |
| 6 | Radiation safety | pregnancy status, IR(ME)R justification |
| 7 | Triage & setting | urgency, setting, requested-by date |
| 8 | Submit | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
pregnancy, contrast-allergy, renal-impairment, metformin-contrast,
high-radiation-dose, unjustified-exposure, missing-indication,
missing-clinical-question, missing-egfr, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
ct-scan-test-request/
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

- ACR Appropriateness Criteria (ordinal 1–9 rating scale: usually-appropriate
  7–9, may-be-appropriate 4–6, usually-not-appropriate 1–3).
  <https://acsearch.acr.org/list>
- Royal College of Radiologists (RCR) *iRefer: Making the best use of clinical
  radiology*. <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- ESUR Contrast Media Safety Committee guidelines (iodinated contrast and renal
  function; eGFR < 45 mL/min/1.73m² as the IV CIN risk threshold; metformin
  continued at eGFR ≥ 30 and withheld below). <https://www.esur.org/guidelines/>
- UK Ionising Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification of every medical exposure).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>
- ACR Manual on Contrast Media. <https://www.acr.org/Clinical-Resources/Contrast-Manual>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / protocolling.
- UK Medical Devices Regulations 2002.
- UK Ionising Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form ct-scan-test-request
```
