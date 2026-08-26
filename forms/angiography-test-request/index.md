# Angiography Test Request

A UK NHS–aligned **vascular angiography request (referral)** that a clinician
completes to request a CT, MR, or catheter angiographic examination of an
arterial territory. It records the requested modality and body region, the
clinical indication and specific question, contrast and renal safety, bleeding
and anticoagulation status, pregnancy / radiation considerations, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
contrast / radiation safety, request completeness, and triage priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
imaging or vascular department's triage and booking decision.

This form is the vascular-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by a radiologist, interventional
radiologist, cardiologist, vascular surgeon, or GP rather than by the patient,
and is aligned with the ACR Appropriateness Criteria, RCR iRefer, ESUR Contrast
Media Safety guidance, and the UK IR(ME)R radiation regulations.

## Scope and intended users

- **Setting:** NHS imaging department, interventional-radiology suite,
  cardiology catheter lab, vascular surgery clinic, or imaging-department triage
  / vetting desk.
- **Users:** radiologists, interventional radiologists, cardiologists, vascular
  surgeons, GPs, and the vetting clinicians who triage incoming requests.
- **Patients:** adults requiring arterial angiographic imaging (coronary,
  cerebral, carotid, aortic, renal, peripheral, pulmonary, or mesenteric).

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a highly appropriate request can still be
unsafe for contrast, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) / RCR iRefer | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Contrast / radiation safety** | ESUR Contrast Media Safety + IR(ME)R | ok / caution / contraindicated (eGFR, contrast allergy, anticoagulation, pregnancy, metformin) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / emergency (+ target timeframe) |

A safety-critical condition (eGFR < 30 with iodinated contrast, severe contrast
allergy, active bleeding on anticoagulation, or pregnancy with ionizing
radiation) drives the safety band toward **contraindicated** and is surfaced as
a high-priority flag regardless of the other axes.

### Modality, region, and indication

| Angiography type | Typical body regions | Common indications |
| --- | --- | --- |
| CT angiography (CTA) | aorta, peripheral-lower-limb, pulmonary, renal, mesenteric | aneurysm, peripheral-arterial-disease, suspected-pulmonary-embolism, gi-bleeding |
| MR angiography (MRA) | carotid, renal, peripheral-lower-limb, aorta | stenosis, peripheral-arterial-disease, pre-intervention-planning |
| Catheter / DSA | cerebral, peripheral-lower-limb, mesenteric, renal | gi-bleeding, stenosis, pre-intervention-planning |
| Coronary angiography | coronary | suspected-coronary-disease |
| Peripheral angiography | peripheral-lower-limb | peripheral-arterial-disease |
| Cerebral angiography | cerebral, carotid | suspected-stroke, aneurysm |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | angiography type, body region, primary indication, specific clinical question, relevant history |
| 4 | Contrast & renal safety | contrast required, eGFR, contrast allergy, diabetes, metformin |
| 5 | Bleeding & anticoagulation | anticoagulant + agent, antiplatelet, bleeding disorder |
| 6 | Pregnancy & radiation | pregnancy status, IR(ME)R justification |
| 7 | Triage & submit | urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
contrast-allergy, renal-impairment, high-bleeding-risk-anticoag, pregnancy,
metformin-contrast, missing-indication, missing-clinical-question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
angiography-test-request/
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

- ACR Appropriateness Criteria (1–9 rating scale; cardiovascular and vascular
  variants, e.g. lower-extremity arterial claudication 2022 update; asymptomatic
  patient at risk for coronary artery disease 2021 update).
  <https://acsearch.acr.org/list>
- Royal College of Radiologists *iRefer: Making the best use of clinical
  radiology*. <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/irefer/>
- ESUR Contrast Media Safety Committee Guidelines (iodinated and gadolinium
  contrast; eGFR thresholds; metformin and post-contrast acute kidney injury).
  <https://www.esur.org/esur-guidelines-on-contrast-agents/>
- ACR–NKF consensus on intravenous iodinated contrast media in patients with
  kidney disease (eGFR ≥ 30 generally safe; < 30 individualized).
  <https://pubs.rsna.org/doi/full/10.1148/radiol.2019192094>
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  justification of every radiation exposure.
  <https://www.legislation.gov.uk/uksi/2017/1322/contents>
- NICE NG12 / cardiology and vascular pathways for indication appropriateness.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / contrast-safety decisions.
- UK Medical Devices Regulations 2002.
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form angiography-test-request
```
