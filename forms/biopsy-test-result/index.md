# Biopsy Test Result

A UK NHS–aligned **biopsy histopathology result (report)** that a reporting
pathologist completes after a tissue or cytology specimen has been examined. It
is the **result/report counterpart** to *Biopsy Test Request* (a referral):
where the request captures why a biopsy should be done and how to triage it, this
form records what the specimen **showed** and a structured **interpretation**. It
records the specimen and procedure, the clinical history, the macroscopic and
microscopic descriptions, the definitive diagnosis with malignancy status,
tumour type, histological grade, resection-margin status and lymphovascular
invasion, immunohistochemistry and molecular results, the impression, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
histopathology report.

This form is the tissue-diagnostics result counterpart to the repository's other
clinician-driven result forms, and mirrors the `ct-scan-test-result` gold
template. It is completed by a consultant histopathologist, cytopathologist,
specialist registrar, or biomedical scientist rather than by the patient, and is
aligned with the Royal College of Pathologists (RCPath) *Standards and datasets
for reporting cancers*, the TNM Classification of Malignant Tumours (8th
edition, UICC), and the International Collaboration on Cancer Reporting (ICCR)
core-data recommendations.

## Scope and intended users

- **Setting:** NHS cellular-pathology / histopathology laboratory, cytology
  laboratory, or multidisciplinary-team (MDT) reporting workflow.
- **Users:** consultant histopathologists, cytopathologists, specialist
  registrars, and reporting biomedical scientists who interpret and sign biopsy
  reports.
- **Patients:** any patient who has undergone a tissue biopsy or cytology
  sampling.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this biopsy, and is it
safe?*. A **result** form is retrospective and records *what did the specimen
show, and what does it mean?*. Accordingly the source-of-truth table here is
`biopsy_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets the diagnosis rather than
vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCPath cancer-dataset core items + TNM8 / ICCR structured grading | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, macroscopic, microscopic, diagnosis, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (an unexpected malignancy, an involved resection margin,
or any other unexpected significant abnormality) **auto-escalates** Axis D to
*critical-alert* and raises the `critical-result-alert` flag regardless of the
other axes. Choose the least-urgent band only when no rule fires.

### Grade note (Axis B differentiation)

The histological grade describes tumour differentiation and feeds Axis B
severity. The mapping is:

| Histological grade | Differentiation | Axis B severity weight |
| --- | --- | --- |
| well-differentiated | Grade 1 | minor |
| moderately-differentiated | Grade 2 | moderate |
| poorly-differentiated | Grade 3 | major |
| undifferentiated | Grade 4 | major |
| not-applicable | benign / non-neoplastic | none |

`malignancy_present`, an `involved` resection margin, or an unexpected malignancy
escalate the result toward **abnormal** or **critical** and drive Axis D toward
**urgent MDT** review with the corresponding safety flags.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen & procedure | biopsy site, biopsy method, specimen adequacy |
| 3 | Clinical history | clinical history, comparison with previous histopathology |
| 4 | Description | macroscopic description, microscopic description |
| 5 | Diagnosis & grading | diagnosis, malignancy present, tumour type, histological grade, resection margins, lymphovascular invasion, immunohistochemistry, molecular results, SNOMED code |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** histopathology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
biopsy-test-result/
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

- RCPath — Standards and datasets for reporting cancers (cancer datasets and
  tissue pathways). Define the core (required) and non-core (recommended) data
  items for histopathological cancer reporting.
  <https://www.rcpath.org/profession/guidelines/cancer-datasets-and-tissue-pathways.html>
- TNM Classification of Malignant Tumours, 8th edition (UICC, 2017) — staging
  framework incorporated across RCPath cancer datasets.
  <https://www.uicc.org/resources/tnm>
- International Collaboration on Cancer Reporting (ICCR) — internationally
  standardised, evidence-based pathology-reporting datasets (specimen adequacy,
  resection margins, lymphovascular invasion as core / non-core items).
  <https://www.iccr-cancer.org/publications/>
- SNOMED CT — morphology / topography coding of the diagnosis.
  <https://www.snomed.org/>

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
bin/test-form biopsy-test-result
```
