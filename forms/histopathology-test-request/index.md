# Histopathology Test Request

A UK NHS–aligned **tissue histopathology specimen request (referral)** that a
clinician completes when submitting a tissue specimen for histopathological
examination. It records the specimen (type, anatomical site, number of pots,
fixative), the clinical indication and specific question, relevant clinical
details, provisional diagnosis and previous histology, and the requested urgency
— then computes a **four-axis grading** (appropriateness, specimen quality,
request completeness, and urgency triage) plus a set of safety-critical flags.
The output is a vetting report that supports the pathology laboratory's
accessioning, triage, and reporting decisions.

This form is the tissue-pathology counterpart to the repository's other
clinician-driven request forms. It is completed by a pathologist, surgeon, GP,
dermatologist, gastroenterologist, radiologist, or other requester rather than
by the patient, and is aligned with the Royal College of Pathologists (RCPath)
cancer datasets and tissue pathways, NICE NG12 *Suspected cancer: recognition
and referral*, and RCPath specimen-handling guidance.

## Scope and intended users

- **Setting:** NHS outpatient clinic, operating theatre, endoscopy suite,
  inpatient ward, community service, or histopathology laboratory accessioning
  / vetting desk.
- **Users:** pathologists, surgeons, GPs, dermatologists, gastroenterologists,
  radiologists, and other clinicians who submit tissue for examination.
- **Patients:** any patient from whom a tissue specimen is taken for
  histopathological diagnosis.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, have a specimen-handling problem, or be urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Indication match against RCPath cancer datasets / tissue pathways (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Specimen quality** | Fixative, labelling, and specimen-integrity checks | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Urgency triage** | NICE NG12 / frozen-section escalation rules | routine / urgent / two-week-wait (+ target timeframe; frozen section → immediate) |

A two-week-wait (suspected-cancer) request or an urgent intra-operative frozen
section **auto-escalates** the triage tier regardless of the other axes.

### Specimen types and indications

| Specimen type | Typical use |
| --- | --- |
| Biopsy | Small diagnostic tissue sample |
| Excision | Local excision of a lesion |
| Resection | Larger operative resection (often cancer staging) |
| Endoscopic biopsy | GI / airway endoscopic sampling |
| Skin lesion | Punch / shave / excision of a skin lesion |
| Frozen section | Intra-operative urgent diagnosis (immediate) |
| Other | Any other specimen |

| Indication | Maps to |
| --- | --- |
| Suspected malignancy | RCPath cancer dataset; usually-appropriate |
| Cancer staging | RCPath cancer dataset resection; usually-appropriate |
| Inflammatory disease | Tissue pathway |
| Infection | Tissue pathway (± microbiology) |
| Characterise lesion | Tissue pathway |
| Margin assessment | Excision / re-excision dataset |
| Transplant monitoring | Protocol biopsy pathway |
| Other | Free-text clinical question required |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Specimen | specimen type, anatomical site, number of specimens, fixative |
| 4 | Indication & clinical context | primary indication, specific clinical question, clinical details, provisional diagnosis, previous histology |
| 5 | Urgency & red flags | urgent frozen section, two-week-wait pathway, requested urgency |
| 6 | Requester & site | site name, setting, requester contact, requested-by date, notes |
| 7 | Review & submit | computed four-axis grade, safety flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, frozen-section-urgent, specimen-fixation-issue,
mislabel-risk, missing-clinical-details, missing-indication, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with the hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
histopathology-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql-migrations/                   # PostgreSQL migrations (source of truth)
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

- RCPath *Cancer datasets and tissue pathways* (standardised reporting; core
  data items mandated for the Cancer Outcomes and Services Dataset).
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>
- RCPath *Dataset for colorectal cancer histopathology reports* (example cancer
  dataset).
  <https://www.rcpath.org/static/e94ce4a2-d722-44a7-84b9d68294134cfc/Dataset-for-colorectal-cancer-histopathology-reports-3rd-edition.pdf>
- NICE NG12 *Suspected cancer: recognition and referral* (two-week-wait
  pathway; referral timeframes by site of cancer).
  <https://www.nice.org.uk/guidance/ng12>
- Cancer Research UK — NICE NG12 summary for health professionals.
  <https://www.cancerresearchuk.org/health-professional/diagnosis/primary-care/suspected-cancer-referral-guidelines/nice-ng12>
- RCPath specimen-handling / tissue-pathway guidance underpins the
  specimen-quality (fixative, labelling, integrity) axis.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / accept-reject decisions.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form histopathology-test-request
```
