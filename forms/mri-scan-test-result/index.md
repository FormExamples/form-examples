# MRI Scan Test Result

A UK NHS–aligned **MRI (magnetic resonance imaging) scan result (report)** that
a reporting clinician completes after an MRI examination has been performed. It
is the **result/report counterpart** to *MRI Scan Test Request* (a referral):
where the request captures why a scan should be done and whether it is safe to
scan, this form records what the scan **found** and a structured
**interpretation**. It records the performed examination and pulse sequences, the
clinical history, the narrative and structured findings, the largest-lesion
measurement, the impression and a structured-reporting category — then computes a
**four-axis interpretation grade** (result classification, abnormality severity /
structured reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured radiology report.

This form is the cross-sectional-imaging result counterpart to the repository's
other clinician-driven result forms, modelled on the sibling *CT Scan Test
Result* gold template. It is completed by a radiologist, reporting radiographer,
consultant, registrar, or other reporting clinician rather than by the patient,
and is aligned with the Royal College of Radiologists (RCR) *Standards for the
interpretation and reporting of imaging investigations*, the ACR reporting and
data systems for structured MRI reporting (PI-RADS for prostate MRI, BI-RADS for
breast MRI), the ACR Appropriateness Criteria, and the ACR Manual on MR Safety.

## Scope and intended users

- **Setting:** NHS radiology department reporting room, teleradiology service,
  or imaging-department reporting workflow.
- **Users:** radiologists, reporting radiographers, consultants, registrars, and
  other reporting clinicians who interpret and sign MRI reports.
- **Patients:** any patient who has undergone an MRI examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`mri_scan_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral or running the MRI safety screen (that belongs to the request form).

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + structured systems (PI-RADS prostate, BI-RADS breast, Likert) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, sequences/technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — e.g. **spinal-cord / cauda-equina compression**, a large
or acute **haemorrhage**, or another unexpected significant abnormality —
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured reporting category (Axis B)

MRI uses recognised structured assessment-and-data systems whose category label
is stored in `reporting_category` as free text:

- **PI-RADS** (Prostate Imaging Reporting and Data System) — a 1–5 assessment for
  multiparametric prostate MRI, scoring T2-weighted, diffusion-weighted, and
  dynamic contrast-enhanced sequences, where 5 is most likely to represent
  clinically significant cancer.
- **BI-RADS** (Breast Imaging Reporting and Data System) — a 0–6 assessment for
  breast MRI conveying an approximate risk of malignancy and the recommended
  management.
- A **Likert** score where a region-specific data system is not used.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`mass_or_lesion`, `haemorrhage`, `infarct`, `demyelination`, `disc_herniation`,
`cord_compression`, `infection_inflammation`, `incidental_finding`.

Key measurement: `largest_lesion_size_mm` (surveillance / categorisation).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | body region, contrast used, sequences performed, examination adequacy |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Measurements & category | largest lesion size (mm), structured-reporting category (PI-RADS / BI-RADS / Likert) |
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
mri-scan-test-result/
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
  (third edition). Emphasises *actionable reporting*, mandatory report sections,
  and prompt communication of critical / urgent / unexpected findings; applies to
  all who report imaging.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- ACR Prostate Imaging Reporting & Data System (PI-RADS) — structured 1–5
  assessment for multiparametric prostate MRI.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/PI-RADS>
- ACR Breast Imaging Reporting & Data System (BI-RADS) — standardised breast
  imaging terminology and 0–6 assessment, including breast MRI.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS>
- ACR Appropriateness Criteria. <https://acsearch.acr.org/list>
- ACR Manual on MR Safety (context carried from the request form).
  <https://www.acr.org/Clinical-Resources/Radiology-Safety/MR-Safety>

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
bin/test-form mri-scan-test-result
```
