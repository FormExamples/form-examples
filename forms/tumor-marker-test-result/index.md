# Tumor Marker Test Result

A UK NHS–aligned **serum tumour-marker test result (report)** that a reporting
clinician completes after one or more serum tumour markers have been measured. It
is the **result/report counterpart** to *Tumor Marker Test Request* (a referral):
where the request captures which markers to order and whether the request is
appropriate, this form records the **measured result values** and a structured
**interpretation**. It records the performed assay and specimen condition, the
clinical history and any known cancer site, the measured value of each marker, a
comparison with the previous value and trend, the interpretive narrative and
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured laboratory-medicine report.

Tumour markers are **poor screening tests** in unselected populations: most have
low specificity and are raised in benign conditions, so a result is always
interpreted in clinical context. A single mildly raised value rarely means
cancer; a **markedly elevated** value, or a **rising trend on treatment**, is the
signal that drives action. A **very high AFP or beta-hCG** suggesting a germ-cell
tumour is treated as a **critical result**.

This form is the laboratory-medicine / oncology result counterpart to the
repository's other clinician-driven result forms. It is completed by a clinical
biochemist, oncologist, or other reporting clinician rather than by the patient,
and is aligned with ACB / RCPath tumour-marker recommendations, NICE CG122 /
NG12 (CA125), and the ASCO / ACB germ-cell tumour-marker guidance.

## Scope and intended users

- **Setting:** NHS clinical-biochemistry / immunoassay laboratory, oncology
  clinic, or laboratory-medicine reporting workflow.
- **Users:** clinical biochemists, oncologists, and other reporting clinicians
  who interpret and sign tumour-marker reports.
- **Patients:** adults with suspected or known malignancy who have had serum
  tumour markers measured.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we measure these markers, and
is it appropriate?*. A **result** form is retrospective and records *what were
the measured values, and what do they mean?*. Accordingly the source-of-truth
table here is `tumor_marker_test_result`, the reporting clinician is the report
**author/signer** (not a requester), and the grade engine interprets measured
values rather than vetting a request.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical result.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion in clinical context | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Degree of elevation + trend + structured marker pattern (e.g. germ-cell AFP/βhCG/LDH pattern) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, specimen condition, measured values, comparison, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **markedly elevated** value or a **rising trend on treatment** classifies the
result as *abnormal* and escalates Axis D toward *urgent* (urgent oncology
review). A **very high AFP / beta-hCG** (suggesting a germ-cell tumour)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Measured markers

Each marker is recorded as a numeric measured value (`NULL` when not measured):

| Marker | Established interpretive use |
| --- | --- |
| PSA | Prostate cancer (informed-choice testing; not population screening) |
| CA125 | Suspected ovarian cancer (NICE CG122: ultrasound if ≥35 IU/mL) |
| CA19-9 | Pancreatic / hepatobiliary cancer (reference < 37 U/mL); not for screening |
| CEA | Colorectal cancer monitoring / recurrence surveillance |
| AFP | Hepatocellular carcinoma; germ-cell tumours (very high → germ-cell) |
| beta-hCG | Germ-cell / trophoblastic tumours (very high → germ-cell) |
| CA15-3 | Breast cancer monitoring |
| LDH | Germ-cell tumour staging; lymphoma prognosis |
| Calcitonin | Medullary thyroid carcinoma |
| Chromogranin A | Neuroendocrine tumours |

Trend fields: `previous_value`, `trend` (rising / stable / falling /
not-applicable) and `comparison_with_previous` drive the
monitoring / response interpretation.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen & context | specimen condition, clinical history, known cancer site |
| 3 | Measured values | PSA, CA125, CA19-9, CEA, AFP, beta-hCG, CA15-3, LDH, calcitonin, chromogranin A |
| 4 | Trend | previous value, trend, comparison with previous |
| 5 | Findings | findings narrative, markedly-elevated flag, overall result status |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** laboratory-medicine report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
tumor-marker-test-result/
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

- ACB / ACBI *Guidelines for the use of tumour markers* (appropriate marker
  selection and interpretation; markers are for monitoring / detecting relapse,
  not screening).
  <https://acbi.ie/wp-content/uploads/2022/12/1644913336-1602832758-Tumour-markers-5th.pdf>
- NICE CG122 *Ovarian cancer: recognition and initial management* (serum CA125;
  ultrasound if ≥35 IU/mL). <https://www.nice.org.uk/guidance/cg122>
- NICE NG12 *Suspected cancer: recognition and referral*.
  <https://www.nice.org.uk/guidance/ng12>
- ASCO *Clinical Practice Guideline on Uses of Serum Tumor Markers in Adult Males
  With Germ Cell Tumors* (AFP, beta-hCG, LDH for diagnosis, staging, prognosis,
  and monitoring). <https://ascopubs.org/doi/10.1200/JCO.2009.26.4481>
- RCPath *National Minimum Retesting Intervals in Pathology* (avoid over-testing;
  monitoring intervals for tumour markers). <https://www.rcpath.org/>

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
bin/test-form tumor-marker-test-result
```
