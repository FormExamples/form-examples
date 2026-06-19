# PET Scan Test Result

A UK NHS–aligned **PET-CT (positron emission tomography) scan result (report)**
that a reporting clinician completes after a PET-CT examination has been
performed, most commonly an oncology FDG-PET-CT for cancer staging, restaging, or
treatment-response assessment. It is the **result/report counterpart** to *PET
Scan Test Request* (a referral): where the request captures why a scan should be
done and whether it is safe to prepare, this form records what the scan
**found** and a structured **interpretation**. It records the tracer and
scan type, the clinical history and acquisition data (pre-injection blood
glucose, injected activity), the narrative and structured metabolic findings,
key measurements (SUVmax, largest lesion size), comparison and treatment
response, the impression, the structured-reporting category (e.g. a Deauville
score or PERCIST category), and recommended follow-up — then computes a
**four-axis interpretation grade** (result classification, abnormality severity /
structured reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured molecular-imaging report.

This form is the molecular-imaging result counterpart to the repository's other
clinician-driven result forms (CT, MRI). It is completed by a nuclear-medicine
physician, radiologist, consultant, or other reporting clinician rather than by
the patient, and is aligned with the Royal College of Radiologists (RCR)
*Standards for the interpretation and reporting of imaging investigations*, the
Lugano classification / 5-point **Deauville** score for lymphoma, the **PERCIST**
metabolic-response criteria for solid tumours, EANM / SNMMI FDG-PET reporting
guidance, and the UK Ionising Radiation (Medical Exposure) Regulations —
IR(ME)R 2017.

## Scope and intended users

- **Setting:** NHS nuclear-medicine / PET-CT department reporting room,
  teleradiology service, or oncology multidisciplinary team (MDT).
- **Users:** nuclear-medicine physicians, radiologists, consultants, and other
  reporting clinicians who interpret and sign PET-CT reports.
- **Patients:** any patient who has undergone a PET-CT examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`pet_scan_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + structured systems (Lugano / Deauville for lymphoma, PERCIST for solid tumours) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique / acquisition, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — in particular **distant metastasis** or **progressive
disease** — **auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Findings → axes mapping

The structured findings drive the classification axis directly:

| Finding(s) | Axis A classification | Typical urgency |
| --- | --- | --- |
| `no_abnormal_uptake` / `physiological_uptake_only` | **normal** | routine |
| `hypermetabolic_lesion` and/or `nodal_uptake` | **abnormal** | recommended / urgent |
| `distant_metastasis` **or** `treatment_response = progressive` | **critical** | **critical-alert** — urgent oncology review |
| `examination_adequacy = non-diagnostic` | **inconclusive** | repeat / further imaging |

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`hypermetabolic_lesion`, `nodal_uptake`, `distant_metastasis`,
`no_abnormal_uptake`, `physiological_uptake_only`, `incidental_finding`.

Key measurements: `suv_max` (most-avid reference lesion) and
`largest_lesion_size_mm` (surveillance / categorisation). Acquisition data:
`blood_glucose_mmol_l` and `injected_activity_mbq`.

### Structured reporting — Deauville and PERCIST

The `reporting_category` field carries the free-text structured-reporting label
appropriate to the study:

- **Deauville 5-point score (lymphoma).** A visual score comparing lesion FDG
  uptake to two internal reference points — the mediastinal blood pool and the
  liver: **1** no uptake above background; **2** uptake ≤ mediastinum; **3**
  uptake > mediastinum but ≤ liver; **4** uptake moderately > liver; **5**
  uptake markedly > liver and/or new lesion. Scores 1–3 are generally a complete
  metabolic response; 4–5 indicate residual or progressive metabolic disease.
  The Deauville score is the international standard incorporated into the Lugano
  classification for Hodgkin and non-Hodgkin lymphoma.
- **PERCIST (solid tumours).** A metabolic-response framework based on change in
  the lean-body-mass-corrected peak SUV (SULpeak) of a target lesion between two
  time-points: complete (CMR), partial (PMR), stable (SMD), or progressive (PMD)
  metabolic disease. PERCIST maps directly onto the `treatment_response` field
  (complete / partial / stable / progressive).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, scan type, report status, performed & reported dates |
| 2 | Clinical history & acquisition | clinical history, blood glucose (mmol/L), injected activity (MBq), examination adequacy |
| 3 | Findings | findings narrative + structured finding booleans |
| 4 | Measurements & comparison | SUVmax, largest lesion size (mm), comparison with previous, treatment response |
| 5 | Impression & structured reporting | impression, reporting category (Deauville / PERCIST), recommended follow-up |
| 6 | Critical-result communication | critical result communicated, reported to |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** molecular-imaging report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
pet-scan-test-result/
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
- Lugano classification / 5-point Deauville score for FDG-PET response in
  lymphoma (mediastinal-blood-pool and liver reference points).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6033266/>
- PET Response Criteria in Solid Tumors (PERCIST) — SULpeak-based metabolic
  response categories.
  <https://en.wikipedia.org/wiki/PET_response_criteria_in_solid_tumors>
- EANM procedure guidelines for tumour imaging with [18F]FDG PET/CT (v3.0).
  <https://www.sciencedirect.com/science/article/pii/S3051292125000065>
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
bin/test-form pet-scan-test-result
```
