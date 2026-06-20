# Histopathology Test Result

A UK NHS–aligned **histopathology result (report)** that a reporting clinician
completes after a tissue specimen has been examined. It is the **result/report
counterpart** to *Histopathology Test Request* (a referral): where the request
captures why a specimen should be examined, this form records what the
examination **found** and a structured **interpretation**. It records the
examined specimen and its adequacy, the clinical history, the macroscopic and
microscopic descriptions, the histopathological diagnosis, malignancy and
tumour characterisation (tumour type, histological grade, pathological TNM
stage, resection margins, lymphovascular invasion), ancillary immunohistochemistry
and SNOMED coding, the impression, and recommended follow-up — then computes a
**four-axis interpretation grade** (result classification, abnormality severity /
structured reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured pathology report.

This form is the tissue-pathology result counterpart to the repository's other
clinician-driven result forms (and mirrors the `*-test-result` gold template,
`ct-scan-test-result`). It is completed by a consultant histopathologist,
biomedical scientist, specialist registrar, or other reporting clinician rather
than by the patient, and is aligned with the Royal College of Pathologists
(RCPath) *Cancer datasets and tissue pathways*, the UICC/AJCC **TNM 8th edition**
pathological (pTNM) staging classification, and RCPath structured-reporting
guidance.

## Scope and intended users

- **Setting:** NHS histopathology / cellular-pathology laboratory reporting room,
  or a regional pathology network reporting workflow.
- **Users:** consultant histopathologists, biomedical scientists, specialist
  registrars, and other reporting clinicians who examine, interpret, and sign
  histopathology reports.
- **Patients:** any patient from whom a tissue specimen was taken for
  histopathological diagnosis.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we examine this specimen, and
is the request adequate?*. A **result** form is retrospective and records *what
did the examination find, and what does it mean?*. Accordingly the source-of-truth
table here is `histopathology_test_result`, the reporting clinician is the report
**author/signer** (not a requester), and the grade engine interprets findings
rather than vetting a request.

## Histopathology report semantics — grade and stage

A histopathology cancer report is built around the RCPath cancer-dataset **core
data items**: the diagnosis, the tumour type, the **histological grade**
(differentiation: well / moderately / poorly differentiated, or undifferentiated),
the **pathological TNM stage** (`pT`, `pN`, `pM` per the UICC/AJCC TNM 8th
edition), the **resection margin** status, and the presence of **lymphovascular
invasion**. These structured items drive cancer staging, prognosis, and
multidisciplinary-team (MDT) management decisions, and are summarised in the
free-text `reporting_category` grade/stage line (Axis B). The `snomed_code`
captures the SNOMED CT topography / morphology coding mandated by the dataset
appendices.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCPath cancer-dataset grade/stage core items (differentiation, pTNM, margins, LVI) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (clinical history, macroscopic, microscopic, diagnosis, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — an unexpected malignancy, an involved resection margin
on a curative resection, or any unexpected significant abnormality —
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Confirmed or expected
malignancy classifies the result as **abnormal** (escalating to **critical** when
unexpected), drives Axis D toward **urgent MDT** discussion, and raises the
`abnormal-requiring-action`, `urgent-referral`, and `unexpected-finding` flags as
applicable. Choose the least-urgent band only when no rule fires.

### Structured findings

Structured items captured alongside the narrative descriptions, used to drive
classification, severity, and flags:

`malignancy_present`, `tumour_type`, `histological_grade`, `tnm_pt`, `tnm_pn`,
`tnm_pm`, `resection_margins`, `lymphovascular_invasion`, `specimen_adequacy`.

Coding and comparison: `snomed_code` (SNOMED CT topography / morphology),
`immunohistochemistry` (ancillary tests), and `comparison_with_previous`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen | specimen type, specimen site, specimen adequacy |
| 3 | Clinical history | clinical history, comparison with previous histology |
| 4 | Examination | macroscopic description, microscopic description, diagnosis |
| 5 | Malignancy & staging | malignancy present, tumour type, histological grade, pTNM, resection margins, lymphovascular invasion, immunohistochemistry, SNOMED code |
| 6 | Impression | impression, reporting category (grade/stage summary), recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** pathology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
histopathology-test-result/
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

- RCPath *Cancer datasets and tissue pathways* (standardised structured
  reporting; core data items mandated for the Cancer Outcomes and Services
  Dataset, COSD).
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>
- RCPath *Dataset for histopathological reporting of colorectal cancer* (example
  cancer dataset with grade, pTNM, margins, and LVI core items).
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>
- UICC *TNM Classification of Malignant Tumours, 8th edition* — the pathological
  (pTNM) staging standard used for `tnm_pt` / `tnm_pn` / `tnm_pm`.
  <https://www.uicc.org/resources/tnm-classification-malignant-tumours-8th-edition>
- TNM Supplement: A Commentary on Uniform Use (clarifies the criteria for
  pathological pT and pN classification).
  <https://www.uicc.org/what-we-do/sharing-knowledge/tnm/publications-and-resources>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form histopathology-test-result
```
