# Cytology Test Result

A UK NHS–aligned **cytology test result (report)** that a reporting clinician
completes after a cytology specimen has been examined microscopically. It is the
**result/report counterpart** to *Cytology Test Request* (a referral): where the
request captures why a specimen should be examined, this form records what the
specimen **showed** and a structured **interpretation**. It records the examined
specimen and its adequacy, the clinical history, the cytology result category
and HPV status, the microscopic description and diagnosis, the impression, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
cytopathology report.

This form is the cytopathology result counterpart to the repository's other
clinician-driven result forms, and mirrors the `*-test-result` gold template. It
is completed by a consultant cytopathologist, biomedical scientist, specialist
registrar, or other reporting clinician rather than by the patient, and is
aligned with the NHS Cervical Screening Programme (HPV primary screening with
British Society for Clinical Cytology / Bethesda dyskaryosis terminology), the
RCPath cytopathology reporting guidance, and the RCPath Thy (thyroid) and breast
C (C1–C5) reporting categories.

## Scope and intended users

- **Setting:** NHS cytology / cytopathology laboratory reporting room or
  pathology reporting workflow.
- **Users:** consultant cytopathologists, biomedical scientists, specialist
  registrars, and other reporting clinicians who interpret and sign cytology
  reports.
- **Patients:** any patient who has had a cytology specimen examined.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we examine this specimen, and
is it appropriate?*. A **result** form is retrospective and records *what did
the specimen show, and what does it mean?*. Accordingly the source-of-truth
table here is `cytology_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets the cellular
findings rather than vetting a referral.

## Cytology grading systems

The free-text `cytology_result_category` and the structured `reporting_category`
hold the **recognized grading category** for the specimen type. Different
specimen types use different validated reporting systems:

| Specimen type | Reporting system | Category values |
| --- | --- | --- |
| Cervical smear | NHS Cervical Screening Programme (BSCC dyskaryosis terminology; aligns with the Bethesda system) | negative / borderline / low-grade dyskaryosis / high-grade dyskaryosis (moderate / severe) / glandular neoplasia |
| Thyroid FNA | RCPath *Thy* terminology | Thy1 (non-diagnostic) / Thy2 (benign) / Thy3 (atypia / follicular) / Thy4 (suspicious of malignancy) / Thy5 (malignant) |
| Breast FNA | Breast cytology *C* categories | C1 (inadequate) / C2 (benign) / C3 (atypia, probably benign) / C4 (suspicious of malignancy) / C5 (malignant) |
| Urine | The Paris System for Reporting Urinary Cytology | negative / atypical / suspicious / high-grade urothelial carcinoma |
| Serous fluid (pleural / ascitic) | The International System for Reporting Serous Fluid Cytopathology | non-diagnostic / negative / atypical / suspicious / malignant |

The boolean `malignancy_present` and `dysplasia_present` summarize the headline
finding so the engine can classify and flag independently of the free-text
category.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCPath / NHS cervical-screening grading category | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, specimen adequacy, microscopic description, diagnosis, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — high-grade dyskaryosis, malignant cells
(`malignancy_present`), Thy5, or breast C5 — **auto-escalates** Axis D to
*critical-alert* and raises the `critical-result-alert` flag (with axis D
recommending urgent colposcopy / MDT referral) regardless of the other axes.
Choose the least-urgent band only when no rule fires.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen details | specimen type, specimen adequacy |
| 3 | Clinical history | clinical history, comparison with previous |
| 4 | Findings | cytology result category, HPV result, malignancy present, dysplasia present, microscopic description, diagnosis |
| 5 | Diagnosis & category | diagnosis, reporting (grading) category |
| 6 | Impression | impression, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** cytopathology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
cytology-test-result/
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

- NHS Cervical Screening Programme — HPV primary screening and cytology triage;
  reporting using British Society for Clinical Cytology (BSCC) dyskaryosis
  terminology (negative / borderline / low-grade / high-grade dyskaryosis /
  glandular), which aligns with the Bethesda system.
  <https://www.gov.uk/government/publications/cervical-screening-programme-and-colposcopy-management/1-introduction-and-programme-policy>
- RCPath — *Guidance on the reporting of thyroid cytology specimens* (the Thy1–
  Thy5 categories).
  <https://www.rcpath.org/static/7d693ce4-0091-4621-97f79e2a0d1034d6/g089_guidance_on_reporting_of_thyroid_cytology_specimens.pdf>
- RCPath — *Tissue pathways for diagnostic cytopathology* (specimen adequacy,
  preparation, and reporting for urine, effusion, CSF, FNA; breast C1–C5
  categories).
  <https://www.rcpath.org/static/b328ab3d-f574-40f1-8717c32ccfc4f7d8/G086-Tissue-pathways-for-diagnostic-cytopathology.pdf>
- The Paris System for Reporting Urinary Cytology; The International System for
  Reporting Serous Fluid Cytopathology.

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
bin/test-form cytology-test-result
```
