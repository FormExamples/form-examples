# CT Scan Test Result

A UK NHS–aligned **CT (computed tomography) scan result (report)** that a
reporting clinician completes after a CT examination has been performed. It is
the **result/report counterpart** to *CT Scan Test Request* (a referral): where
the request captures why a scan should be done, this form records what the scan
**found** and a structured **interpretation**. It records the performed
examination and technique, the clinical history, the narrative and structured
findings, key measurements and radiation dose (dose-length product, DLP), the
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured radiology report.

This form is the cross-sectional-imaging result counterpart to the repository's
other clinician-driven result forms, and is the **gold template** for the
sibling `*-test-result` forms. It is completed by a radiologist, reporting
radiographer, consultant, registrar, or other reporting clinician rather than by
the patient, and is aligned with the Royal College of Radiologists (RCR)
*Standards for the interpretation and reporting of imaging investigations*, the
ACR Appropriateness Criteria, ACR Lung-RADS, the ACR Incidental Findings
Committee white papers, and the UK Ionising Radiation (Medical Exposure)
Regulations — IR(ME)R 2017.

## Scope and intended users

- **Setting:** NHS radiology department reporting room, teleradiology service,
  or imaging-department reporting workflow.
- **Users:** radiologists, reporting radiographers, consultants, registrars, and
  other reporting clinicians who interpret and sign CT reports.
- **Patients:** any patient who has undergone a CT examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`ct_scan_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + structured systems (e.g. ACR Lung-RADS, incidental-findings categories) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (e.g. haemorrhage, large new infarct, unexpected
significant abnormality) **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`acute_finding`, `mass_or_lesion`, `haemorrhage`, `infarct`, `fracture`,
`infection_inflammation`, `obstruction`, `incidental_finding`.

Key measurements: `largest_lesion_size_mm` (surveillance / categorisation) and
`radiation_dose_dlp` (dose audit).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | body region, contrast used, technique, examination adequacy |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Measurements | largest lesion size (mm), radiation dose (DLP) |
| 6 | Impression | impression, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** radiology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
ct-scan-test-result/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  spec/                             # living spec
  doc/                              # clinical reference documentation
  sql/                              # PostgreSQL migrations (source of truth)
  xml/                              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  typespec/                         # TypeSpec API definitions (generated)
  front-end-with-svelte/            # SvelteKit single-page wizard
  back-end-with-loco/               # Rust axum + Loco JSON API
```

## Clinical references

- RCR — Standards for the interpretation and reporting of imaging investigations
  (third edition). Emphasises *actionable reporting* and applies to all who
  report imaging.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- ACR Lung-RADS (structured assessment-and-management categories for lung CT).
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Lung-Rads>
- Managing Incidental Findings on Thoracic CT: Lung Findings — A White Paper of
  the ACR Incidental Findings Committee, *JACR*, September 2021.
  <https://www.jacr.org/article/S1546-1440(21)00376-8/abstract>
- ACR Appropriateness Criteria. <https://acsearch.acr.org/list>
- UK Ionising Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (dose audit; DLP recorded per study).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management.
- UK Medical Devices Regulations 2002.
- UK Ionising Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form ct-scan-test-result
```
