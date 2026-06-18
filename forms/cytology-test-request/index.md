# Cytology Test Request

A UK NHS–aligned **cytology specimen request (referral)** that a clinician
completes to request a cytology examination of a specimen — cervical smear,
urine, sputum, serous-cavity effusion (pleural / ascitic), fine-needle
aspiration (thyroid or breast), or cerebrospinal fluid. It records the
requested specimen type and site, the clinical indication and specific
question, the cervical-screening / cytology context, the specimen-collection
(pre-analytical) details, and the requested urgency — then computes a
**four-axis grading** (appropriateness, pre-analytical specimen adequacy,
request completeness, and triage priority) plus a set of safety-critical flags.
The output is a vetting report that supports the cytology / pathology
laboratory's triage and acceptance decision.

This form is the cytopathology counterpart to the repository's other
clinician-driven request forms. It is completed by a pathologist, GP,
gynaecologist, respiratory physician, or nurse rather than by the patient, and
is aligned with the NHS Cervical Screening Programme (HPV primary screening),
RCPath cytopathology guidance, and NICE NG12 (suspected cancer recognition and
referral).

## Scope and intended users

- **Setting:** NHS outpatient clinic, GP practice, colposcopy / gynaecology
  clinic, respiratory clinic, inpatient ward, or cytology-laboratory triage /
  vetting desk.
- **Users:** pathologists, GPs, gynaecologists, respiratory physicians, and
  nurses who request and vet cytology specimens.
- **Patients:** any patient requiring a cytology examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
pre-analytically poor, incomplete, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NHS Cervical Screening Programme / indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical specimen adequacy** | Specimen collected / timing / fixation (RCPath cytopathology) | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | NICE NG12 suspected-cancer escalation rules | routine / urgent / two-week-wait (+ target timeframe) |

A suspected-cancer indication or a previous high-grade cytology result
**auto-escalates** the triage tier toward the two-week-wait pathway regardless
of the other axes.

### Specimen types

| Specimen type | Typical indication |
| --- | --- |
| Cervical smear | Cervical screening (HPV primary screen + cytology triage) |
| Urine cytology | Haematuria, suspected urothelial malignancy |
| Sputum cytology | Suspected respiratory malignancy |
| Fluid — pleural / ascitic | Serous-cavity effusion investigation |
| Fine-needle aspiration — thyroid | Thyroid nodule |
| Fine-needle aspiration — breast | Breast lump |
| CSF cytology | Suspected CNS / meningeal involvement |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested examination | specimen type, specimen site, primary indication, specific clinical question, clinical details |
| 4 | Cytology context | HPV test requested, previous abnormal cytology, last menstrual period date |
| 5 | Specimen collection | specimen collected (yes/no), collection date-time |
| 6 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, previous-high-grade-cytology, specimen-not-collected,
missing-clinical-details, missing-indication, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
cytology-test-request/
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

- NHS Cervical Screening Programme — HPV primary screening and cytology triage
  pathway.
  <https://www.gov.uk/government/publications/cervical-screening-programme-and-colposcopy-management/1-introduction-and-programme-policy>
- NHS Cervical Screening Programme — guidance for laboratories providing HPV
  testing and cytology services.
  <https://www.gov.uk/government/publications/cervical-screening-laboratory-hpv-testing-and-cytology-services/cervical-screening-guidance-for-laboratories-providing-hpv-testing-and-cytology-services-in-the-nhs-cervical-screening-programme>
- RCPath — *Tissue pathways for diagnostic cytopathology* (specimen procurement,
  preparation, fixation, and reporting for urine, effusion, CSF, FNA).
  <https://www.rcpath.org/static/b328ab3d-f574-40f1-8717c32ccfc4f7d8/G086-Tissue-pathways-for-diagnostic-cytopathology.pdf>
- RCPath — *Guidance on the reporting of thyroid cytology specimens* (Thy
  categories).
  <https://www.rcpath.org/static/7d693ce4-0091-4621-97f79e2a0d1034d6/g089_guidance_on_reporting_of_thyroid_cytology_specimens.pdf>
- NICE NG12 — *Suspected cancer: recognition and referral* (two-week-wait
  pathways). <https://www.nice.org.uk/guidance/ng12>
- The Paris System for Reporting Urinary Cytology; The International System for
  Reporting Serous Fluid Cytopathology.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / specimen acceptance.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form cytology-test-request
```
