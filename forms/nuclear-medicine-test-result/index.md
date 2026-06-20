# Nuclear Medicine Test Result

A UK NHS–aligned **nuclear medicine (radionuclide scan) result (report)** that a
reporting clinician completes after a radionuclide examination has been
performed. It is the **result/report counterpart** to *Nuclear Medicine Test
Request* (a referral): where the request captures why a scan should be done,
this form records what the scan **found** and a structured **interpretation**.
It records the performed examination, the radiopharmaceutical and injected
activity, the clinical history, the narrative and structured findings, key
quantitative measurements (ejection fraction, split renal function), the
impression and a structured reporting category (for example a V/Q PE
probability), and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured nuclear medicine report.

This form is the radionuclide-imaging result counterpart to the repository's
other clinician-driven result forms, and mirrors the gold-template
*CT Scan Test Result*. It is completed by a nuclear-medicine physician,
radiologist, consultant, or other reporting clinician rather than by the
patient, and is aligned with the British Nuclear Medicine Society (BNMS)
clinical guidelines, the European Association of Nuclear Medicine (EANM) and
Society of Nuclear Medicine and Molecular Imaging (SNMMI) procedure guidelines,
the Royal College of Radiologists (RCR) *Standards for the interpretation and
reporting of imaging investigations*, and the UK Ionising Radiation (Medical
Exposure) Regulations — IR(ME)R 2017.

## Scope and intended users

- **Setting:** NHS nuclear medicine department reporting room, PET/CT or SPECT
  reporting workflow, or molecular-imaging reporting service.
- **Users:** nuclear-medicine physicians, radiologists, consultants, and other
  reporting clinicians who interpret and sign radionuclide-scan reports.
- **Patients:** any patient who has undergone a nuclear medicine examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`nuclear_medicine_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + structured systems (e.g. V/Q PE probability, bone-scan metastatic pattern) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (e.g. a high-probability pulmonary embolism on a V/Q
study, a widespread metastatic pattern on a bone scan, or an unexpected
significant abnormality) **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`abnormal_uptake`, `metastatic_pattern`, `perfusion_defect`, `photopenic_area`,
`no_significant_abnormality`, `incidental_finding`.

Key quantitative measurements: `ejection_fraction_percent` (gated cardiac
studies), `split_function_left_percent` / `split_function_right_percent`
(differential renal function), and `injected_activity_mbq` (dose audit / DRL
comparison).

## Scan types

`bone-scan`, `myocardial-perfusion`, `vq-lung-scan`, `thyroid-uptake`,
`renal-dmsa`, `renal-mag3`, `gallium-octreotide`, `white-cell-scan`,
`sentinel-node`, `other`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | scan type, radiopharmaceutical, injected activity (MBq), examination adequacy |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Measurements | ejection fraction, split renal function (left / right) |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** nuclear medicine report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
nuclear-medicine-test-result/
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

- BNMS — British Nuclear Medicine Society clinical guidelines (UK reporting and
  procedure standards; endorses EANM procedure guidelines).
  <https://www.bnms.org.uk/page/BNMSClinicalGuidelines>
- EANM guideline for ventilation/perfusion SPECT for the diagnosis of pulmonary
  embolism — the diagnostic cut-off for a positive V/P study is one segmental or
  two subsegmental mismatched defects.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6813289/>
- SNM Practice Guideline for Lung Scintigraphy 4.0 (modified PIOPED II reporting
  categories: high probability, normal, very low, non-diagnostic/intermediate).
  <https://tech.snmjournals.org/content/40/1/57>
- RCR — Standards for the interpretation and reporting of imaging investigations
  (third edition). Emphasises *actionable reporting* and applies to all who
  report imaging.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- UK Ionising Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (dose audit; administered activity recorded per study).
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
bin/test-form nuclear-medicine-test-result
```
