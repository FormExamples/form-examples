# Mammography Test Request

A UK NHS–aligned **breast mammography imaging request (referral)** that a
clinician completes to request a mammogram for a patient. It records the
requested examination, the clinical indication and specific question, breast
symptoms, breast history and risk factors, and the requested urgency — then
computes a **four-axis grading** (appropriateness, cancer-pathway urgency,
request completeness, and clinical priority) plus a set of safety-critical
flags. The output is a vetting report that supports the imaging department's
triage and booking decision.

This form is the breast-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by a radiologist, GP,
breast-surgeon, oncologist, hospital doctor, or radiographer rather than by the
patient, and is aligned with the ACR Appropriateness Criteria (breast), the NHS
Breast Screening Programme (NHSBSP), and NICE NG12 suspected-cancer recognition
and referral.

## Scope and intended users

- **Setting:** NHS breast clinic, GP practice, breast-surgery outpatients,
  oncology clinic, breast-screening unit, or imaging-department triage /
  vetting desk.
- **Users:** radiologists, GPs, breast surgeons, oncologists, hospital doctors,
  and radiographers who vet incoming requests.
- **Patients:** people requiring a screening, diagnostic, symptomatic, or
  surveillance mammogram.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) / NHS Breast Screening Programme | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Cancer-pathway urgency** | NICE NG12 suspected-cancer criteria | triage tier routine / urgent / two-week-wait / emergency (+ target timeframe, two-week-wait eligibility + rationale) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Symptom + risk escalation rules | low / moderate / high |

A NICE NG12 trigger (unexplained breast lump aged ≥ 30, suspicious nipple or
skin change aged ≥ 50, etc.) **auto-escalates** the triage tier to two-week-wait
regardless of the other axes.

### Exam types and indications

| Exam type | Typical indication | Notes |
| --- | --- | --- |
| Screening | routine-screening, family-history | Asymptomatic; NHSBSP age range or high-risk surveillance |
| Diagnostic | breast-lump, recall-from-screening | Targeted work-up, usually with ultrasound |
| Symptomatic | breast-pain, nipple-discharge, skin-change | One-stop symptomatic clinic |
| Surveillance | follow-up-known-cancer, post-treatment-surveillance | Known disease, interval follow-up |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | exam type, primary indication, laterality, specific clinical question, relevant history |
| 4 | Symptoms | lump, pain, nipple discharge, skin change, nipple inversion |
| 5 | Breast history & risk | previous mammogram + date, family history, breast implants, pregnancy / lactating, HRT |
| 6 | Triage | requested urgency, requested-by date, setting, site, notes |
| 7 | Review & submit | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, breast-lump, bloody-nipple-discharge, age-below-screening,
pregnancy-lactating, missing-indication, missing-clinical-question, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
mammography-test-request/
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

- ACR Appropriateness Criteria® *Palpable Breast Masses* (2022 update; 1–9
  rating scale: usually-not-appropriate 1–3, may-be-appropriate 4–6,
  usually-appropriate 7–9). <https://acsearch.acr.org/list>
  / <https://www.jacr.org/article/S1546-1440(17)30216-8/fulltext>
- NICE NG12 *Suspected cancer: recognition and referral* (breast: two-week-wait
  referral for unexplained breast lump aged ≥ 30; nipple/skin changes aged ≥ 50).
  <https://www.nice.org.uk/guidance/ng12>
  / <https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer>
- NHS Breast Screening Programme (NHSBSP) — routine screening age range and
  high-risk surveillance.
  <https://www.gov.uk/topic/population-screening-programmes/breast>
- ACR BI-RADS® Atlas — reporting and data system for breast imaging.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / pathway selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.
- IR(ME)R 2017 — justification of medical exposure to ionising radiation.

## Verify

```sh
bin/test-form mammography-test-request
```
