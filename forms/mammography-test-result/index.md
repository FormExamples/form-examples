# Mammography Test Result

A UK NHS–aligned **breast mammography result (report)** that a reporting
clinician completes after a mammography examination has been performed. It is the
**result/report counterpart** to *Mammography Test Request* (a referral): where
the request captures why a mammogram should be done, this form records what the
mammogram **found** and a structured **interpretation**. It records the performed
examination and laterality, the clinical history, the narrative and structured
findings, the breast density (ACR A–D), the largest lesion measurement, the
impression, and — as the key structured score — the **ACR BI-RADS final
assessment category**, then computes a **four-axis interpretation grade** (result
classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
breast-imaging report.

Mammography is the classic **BI-RADS** use case: the Breast Imaging Reporting and
Data System gives every mammogram a single standardised final assessment
category that determines management. This form is completed by a radiologist,
consultant, or reporting radiographer rather than by the patient, and is aligned
with the ACR BI-RADS Atlas, the Royal College of Radiologists (RCR) breast
imaging guidance, and the NHS Breast Screening Programme (NHSBSP).

## Scope and intended users

- **Setting:** NHS breast-imaging / breast-screening unit reporting room,
  symptomatic breast clinic, or teleradiology reporting workflow.
- **Users:** radiologists, consultants, and reporting radiographers who
  interpret and sign mammography reports.
- **Patients:** any patient who has undergone a screening, diagnostic,
  symptomatic, or surveillance mammogram.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`mammography_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion, driven by the BI-RADS category | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | ACR BI-RADS final assessment category (0–6) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label carrying the BI-RADS category |
| **C. Report completeness** | Mandatory report-section checklist (history, technique/adequacy, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | BI-RADS management pathway + acuity escalation | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

The **BI-RADS final assessment category** is the key structured score, recorded
on the main table as `bi_rads_category`. A **BI-RADS 4 or 5** assessment, or any
unexpected significant finding, **auto-escalates** Axis D and raises the
`abnormal-requiring-action` / `urgent-referral` flags regardless of the other
axes. Choose the least-urgent band only when no rule fires.

### BI-RADS → axes mapping

The ACR BI-RADS final assessment category drives Axis A (classification) and
Axis D (follow-up urgency). Only BI-RADS 0/1/2 may be assigned to a screening
study; 3/4/5/6 require a complete diagnostic work-up.

| BI-RADS | Meaning | Likelihood of malignancy | Axis A classification | Axis D follow-up urgency | Typical management |
| --- | --- | --- | --- | --- | --- |
| **0** | Incomplete — need additional imaging | n/a | inconclusive | recommended | Additional imaging / prior comparison (further-imaging) |
| **1** | Negative | essentially 0 % | normal | routine | Routine screening interval |
| **2** | Benign | essentially 0 % | normal | routine | Routine screening interval |
| **3** | Probably benign | ≤ 2 % | abnormal | recommended | Short-interval (typically 6-month) follow-up |
| **4a** | Suspicious — low | > 2 % to ≤ 10 % | abnormal | urgent | Tissue diagnosis / biopsy referral |
| **4b** | Suspicious — intermediate | > 10 % to ≤ 50 % | abnormal | urgent | Tissue diagnosis / biopsy referral |
| **4c** | Suspicious — moderate | > 50 % to < 95 % | critical | urgent | Tissue diagnosis / biopsy referral |
| **5** | Highly suggestive of malignancy | ≥ 95 % | critical | urgent | Biopsy + breast MDT referral |
| **6** | Known biopsy-proven malignancy | 100 % (known) | abnormal | recommended | Per agreed oncology / surgical management |

### Breast density (ACR composition)

`breast_density` records the ACR BI-RADS breast composition: **a** = almost
entirely fatty, **b** = scattered fibroglandular, **c** = heterogeneously dense,
**d** = extremely dense. Dense breasts (c/d) lower mammographic sensitivity and
may prompt supplemental imaging.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`mass`, `calcifications`, `architectural_distortion`, `asymmetry`,
`skin_or_nipple_change`, `lymphadenopathy`, `incidental_finding`.

Key measurement: `largest_lesion_size_mm` (surveillance / categorisation).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | exam type, laterality, examination adequacy, breast density |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Measurements | largest lesion size (mm) |
| 6 | Impression | impression, BI-RADS category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.
A BI-RADS 4 or 5 final assessment raises `abnormal-requiring-action` and
`urgent-referral`.

## Output

- **HTML report preview** and downloadable **PDF** breast-imaging report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
mammography-test-result/
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

- ACR BI-RADS® Atlas — Breast Imaging Reporting and Data System: standardised
  breast-imaging lexicon and final assessment categories 0–6 plus breast-density
  categories a–d.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS>
- BI-RADS classification and management (StatPearls).
  <https://www.ncbi.nlm.nih.gov/books/NBK459169/>
- RCR — Guidance on screening and symptomatic breast imaging.
  <https://www.rcr.ac.uk/media/043jyjqj/guidance-on-screening-and-symptomatic-breast-imaging-2025.pdf>
- NHS Breast Screening Programme (NHSBSP) — routine screening and high-risk
  surveillance.
  <https://www.gov.uk/topic/population-screening-programmes/breast>

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
bin/test-form mammography-test-result
```
