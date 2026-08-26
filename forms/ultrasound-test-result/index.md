# Ultrasound Test Result

A UK NHS–aligned **general (non-obstetric) ultrasound result (report)** that a
reporting clinician completes after a diagnostic ultrasound examination has been
performed. It is the **result/report counterpart** to *Ultrasound Test Request*
(a referral): where the request captures why a scan should be done, this form
records what the scan **found** and a structured **interpretation**. It records
the performed examination (body region and laterality), diagnostic adequacy, the
clinical history, the narrative and structured findings, the largest lesion
measurement, the impression, an optional structured-reporting category, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
ultrasound report.

This form is the general-imaging result counterpart to the repository's
obstetric `pregnancy-ultrasound-test-request` and the other clinician-driven
result forms. It is completed by a sonographer, radiologist, consultant, or other
reporting clinician rather than by the patient, and is aligned with the Royal
College of Radiologists (RCR) *Standards for the interpretation and reporting of
imaging investigations*, the BMUS/AIUM practice guidelines for diagnostic
ultrasound, and structured-reporting systems such as ACR TI-RADS (thyroid) and
the breast U-classification. It is explicitly **not** for obstetric scanning.

## Scope and intended users

- **Setting:** NHS radiology / ultrasound department reporting room, community
  diagnostic centre, outpatient clinic, or teleradiology / tele-reporting
  service.
- **Users:** sonographers, radiologists, consultants, and other reporting
  clinicians who perform / interpret and sign ultrasound reports.
- **Patients:** any patient who has undergone a general (non-obstetric)
  diagnostic ultrasound examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`ultrasound_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + structured systems (e.g. ACR TI-RADS thyroid level, breast U-classification) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique/adequacy, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (DVT present on venous Doppler, ruptured or large
abdominal aortic aneurysm, sonographic signs of testicular torsion)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`mass_or_lesion`, `cyst`, `gallstones`, `hydronephrosis`, `free_fluid`,
`dvt_present`, `aneurysm`, `organ_enlargement`, `incidental_finding`.

Key measurement: `largest_lesion_size_mm` (surveillance / categorization). The
free-text `reporting_category` carries a structured-reporting label where
applicable (e.g. an ACR TI-RADS level TR1–TR5 for thyroid nodules, or a breast
U-classification U1–U5).

## Body region map

| Body region | Typical findings |
| --- | --- |
| Abdomen | mass-or-lesion, free-fluid, organ-enlargement |
| Liver-biliary | gallstones, mass-or-lesion, organ-enlargement |
| Renal-tract | hydronephrosis, cyst, mass-or-lesion |
| Pelvis | cyst, mass-or-lesion, free-fluid |
| Thyroid-neck | mass-or-lesion, cyst (ACR TI-RADS category) |
| Scrotum-testes | mass-or-lesion, cyst; torsion signs (critical) |
| Breast | mass-or-lesion, cyst (U-classification) |
| Soft-tissue / msk-joint | mass-or-lesion, free-fluid |
| Vascular-doppler / carotid | aneurysm, stenosis |
| Dvt-leg | dvt-present (critical) |

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | body region, laterality, examination adequacy |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Measurements | largest lesion size (mm) |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** ultrasound report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
ultrasound-test-result/
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

- RCR — Standards for the interpretation and reporting of imaging investigations.
  Emphasizes *actionable reporting*, mandatory report sections, and the
  communication of critical, urgent, and unexpected significant findings; applies
  to all who interpret and report imaging, including sonographers and reporting
  radiographers.
  <https://www.rcr.ac.uk/media/wlsf4ufl/ppqi_reporting-standards-guidance.pdf>
- ACR Thyroid Imaging, Reporting and Data System (TI-RADS) — structured TR1–TR5
  categorization of thyroid nodules driving FNA / surveillance management; an
  example value stored in the grade's `reporting_category` field.
  <https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/TI-RADS>
- ACR TI-RADS White Paper of the ACR TI-RADS Committee, *JACR*.
  <https://www.jacr.org/article/s1546-1440(17)30186-2/fulltext>
- BMUS *Guidelines for professional ultrasound practice* and AIUM practice
  parameters for abdominal, pelvic, scrotal, thyroid, breast, and vascular
  ultrasound. <https://www.bmus.org/>

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
bin/test-form ultrasound-test-result
```
