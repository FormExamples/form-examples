# Fluoroscopy Test Result

A UK NHS–aligned **fluoroscopy / contrast-study result (report)** that a
reporting clinician completes after a fluoroscopic examination has been
performed — barium studies (swallow, meal, follow-through, enema), a
water-soluble contrast swallow, defecating proctogram, hysterosalpingogram,
micturating cystourethrogram, arthrogram, or a fluoroscopy-guided procedure. It
is the **result/report counterpart** to *Fluoroscopy Test Request* (a referral):
where the request captures why a study should be done, this form records what the
study **found** and a structured **interpretation**. It records the performed
examination and contrast used, screening time, the clinical history, the
narrative and structured findings, the impression and structured-reporting
category, and recommended follow-up — then computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
radiology report.

This form is the contrast-fluoroscopy result counterpart to the repository's
other clinician-driven result forms. It is completed by a radiologist,
consultant, or reporting radiographer rather than by the patient, and is aligned
with the Royal College of Radiologists (RCR) *Standards for the interpretation
and reporting of imaging investigations*, the ACR practice parameter for the
performance of esophagrams and upper-GI examinations, and the UK Ionizing
Radiation (Medical Exposure) Regulations — IR(ME)R 2017.

## Scope and intended users

- **Setting:** NHS radiology / fluoroscopy department reporting room,
  teleradiology service, or imaging-department reporting workflow.
- **Users:** radiologists, consultants, and reporting radiographers who interpret
  and sign fluoroscopy reports.
- **Patients:** any patient who has undergone a fluoroscopic contrast
  examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this study, and is it
safe?*. A **result** form is retrospective and records *what did the study find,
and what does it mean?*. Accordingly the source-of-truth table here is
`fluoroscopy_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + a structured `reporting_category` label | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (perforation or contrast leak, or high-grade
obstruction) **auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`stricture`, `reflux`, `obstruction`, `perforation_or_leak`, `fistula`,
`filling_defect`, `dysmotility`, `normal_study`, `incidental_finding`.

Key measurement: `screening_time_minutes` (fluoroscopy dose audit).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | study type, contrast used, examination adequacy, screening time |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Impression | impression, reporting category, recommended follow-up |
| 6 | Critical communication | critical-result communicated, reported to |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, signature |

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
fluoroscopy-test-result/
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
  (third edition). Emphasizes *actionable reporting* and applies to all who
  report imaging.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- ACR–SPR–SAR Practice Parameter for the Performance of Esophagrams and Upper
  Gastrointestinal Examinations.
  <https://gravitas.acr.org/PPTS/DownloadPreviewDocument?DocId=46>
- Suspected perforation: water-soluble contrast preferred first-line over barium
  (free barium causes mediastinitis / peritonitis). Esophageal perforation:
  comparison of aqueous and barium-containing contrast media, *Radiology*.
  <https://pubs.rsna.org/doi/abs/10.1148/radiology.202.3.9051016>
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose audit; screening time recorded per study).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management.
- UK Medical Devices Regulations 2002.
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form fluoroscopy-test-result
```
