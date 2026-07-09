# Biopsy Test Request

A UK NHS–aligned **tissue-biopsy procedure / pathology request (referral)** that
a clinician completes to request a diagnostic biopsy for a patient. It records
the requested procedure (biopsy site, method, laterality), the clinical
indication and specific question, the lesion description, the patient's bleeding
and coagulation status (anticoagulants, antiplatelets, INR, platelet count,
bleeding disorder, immunosuppression), and the requested urgency — then computes
a **four-axis grading** (appropriateness, periprocedural bleeding risk, request
completeness, and urgency / cancer-pathway triage) plus a set of safety-critical
flags. The output is a vetting report that supports the pathology / interventional
department's triage and booking decision.

This form is the tissue-diagnostics counterpart to the repository's other
clinician-driven request forms. It is completed by a pathologist, surgeon,
radiologist, gastroenterologist, dermatologist, oncologist, or GP rather than by
the patient, and is aligned with the ACR Appropriateness Criteria, RCR / RCPath
biopsy guidance, BSG / ESGE periprocedural antithrombotic guidance, and NICE
NG12 suspected-cancer recognition and referral.

## Scope and intended users

- **Setting:** NHS outpatient clinic, day-case unit, interventional radiology
  suite, endoscopy unit, inpatient ward, or pathology-department triage / vetting
  desk.
- **Users:** pathologists, surgeons, radiologists, gastroenterologists,
  dermatologists, oncologists, and GPs who raise or vet incoming requests.
- **Patients:** people of any age requiring a diagnostic tissue biopsy.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
high bleeding-risk, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) / RCR–RCPath biopsy guidance | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Bleeding risk** | BSG / ESGE & BSIR periprocedural antithrombotic stratification | low / moderate / high (+ anticoagulant action) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Urgency / cancer pathway** | NICE NG12 suspected-cancer & escalation rules | routine / urgent / two-week-wait / emergency (+ target timeframe, 2WW eligibility) |

A suspected-malignancy or cancer-staging indication makes the request
**two-week-wait eligible** and escalates the triage tier. A high bleeding-risk
combination (anticoagulant / antiplatelet on board, raised INR, low platelets,
or a known bleeding disorder) drives the bleeding-risk axis and an explicit
periprocedural anticoagulant action.

### Biopsy site, method, and indication

| Biopsy site | Typical method | Common indication |
| --- | --- | --- |
| Skin | punch / excision / incision | suspected-malignancy, characterise-lesion |
| Breast | core-needle / fine-needle-aspiration | suspected-malignancy, cancer-staging |
| Lymph node | core-needle / excision / fine-needle-aspiration | lymphadenopathy, cancer-staging |
| Liver | core-needle / image-guided | characterise-lesion, transplant-monitoring |
| Kidney | core-needle / image-guided | inflammatory-disease, transplant-monitoring |
| Prostate | core-needle / image-guided | suspected-malignancy |
| Lung | core-needle / image-guided | suspected-malignancy, suspected-infection |
| Bone marrow | core-needle / aspiration | suspected-malignancy, characterise-lesion |
| GI tract | endoscopic | suspected-malignancy, inflammatory-disease |
| Thyroid | fine-needle-aspiration / image-guided | characterise-lesion, suspected-malignancy |
| Soft tissue | core-needle / image-guided / incision | suspected-malignancy, characterise-lesion |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested procedure | biopsy site, method, laterality, imaging-guidance required, site / setting |
| 4 | Indication & question | primary indication, specific clinical question, relevant history |
| 5 | Lesion description | size, location, imaging correlate, previous finding |
| 6 | Bleeding & coagulation | anticoagulant + agent, antiplatelet + agent, INR, platelet count, bleeding disorder, immunosuppressed |
| 7 | Risk & safety review | computed bleeding-risk band + anticoagulant action, safety flags |
| 8 | Triage & submit | requested urgency, requested-by date, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, high-bleeding-risk-anticoag, coagulopathy,
thrombocytopenia, immunosuppression, missing-indication,
missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
biopsy-test-request/
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

- ACR Appropriateness Criteria (1–9 rating scale; Soft-Tissue Masses and
  image-guided / percutaneous needle biopsy variants).
  <https://acsearch.acr.org/list>
- ACR Appropriateness Criteria® Soft-Tissue Masses.
  <https://www.jacr.org/article/S1546-1440(18)30337-5/fulltext>
- Royal College of Radiologists (RCR) / Royal College of Pathologists (RCPath)
  guidance on tissue-pathway and image-guided biopsy.
  <https://www.rcr.ac.uk/> · <https://www.rcpath.org/>
- BSG / ESGE *Endoscopy in patients on antiplatelet or anticoagulant therapy,
  including direct oral anticoagulants* (periprocedural bleeding-risk
  stratification; diagnostic biopsy = low bleeding risk).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC4789831/> ·
  <https://pubmed.ncbi.nlm.nih.gov/34362780/>
- BSIR / CIRSE standards on percutaneous image-guided biopsy and periprocedural
  coagulation thresholds.
- NICE NG12 *Suspected cancer: recognition and referral* (two-week-wait
  pathway). <https://www.nice.org.uk/guidance/ng12> ·
  <https://www.cancerresearchuk.org/health-professional/diagnosis/primary-care/suspected-cancer-referral-guidelines/nice-ng12>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / cancer-pathway selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form biopsy-test-request
```
