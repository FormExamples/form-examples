# X-Ray Test Result

A UK NHS–aligned **plain-radiograph (X-ray) result (report)** that a reporting
clinician completes after a plain X-ray examination has been performed. It is the
**result/report counterpart** to *X-Ray Test Request* (a referral): where the
request captures why a radiograph should be done, this form records what the
radiograph **found** and a structured **interpretation**. It records the
performed examination and the projections acquired, the clinical history, the
narrative and structured findings, the impression and a structured reporting
category, and recommended follow-up — then computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
radiology report.

This form is the plain-radiograph result counterpart to the repository's other
clinician-driven result forms (CT, MRI, ultrasound) and mirrors the *CT Scan Test
Result* gold template. It is completed by a radiologist, reporting radiographer,
consultant, registrar, or other reporting clinician rather than by the patient,
and is aligned with the Royal College of Radiologists (RCR) *Standards for the
interpretation and reporting of imaging investigations*, the RCR *Standards for
the communication of critical, urgent and unexpected significant radiological
findings*, and the UK Ionizing Radiation (Medical Exposure) Regulations 2017
(IR(ME)R).

## Scope and intended users

- **Setting:** NHS radiology department reporting room, teleradiology service,
  emergency-department hot reporting, or imaging-department reporting workflow.
- **Users:** radiologists, reporting radiographers, consultants, registrars, and
  other reporting clinicians who interpret and sign plain-radiograph reports.
- **Patients:** any patient who has undergone a plain X-ray examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`x_ray_test_result`, the reporting clinician is the report **author/signer** (not
a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + a structured category | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, projections/technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (e.g. **pneumothorax**, **free intraperitoneal air**, an
**unstable fracture**) **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`fracture`, `dislocation`, `consolidation`, `pneumothorax`, `pleural_effusion`,
`foreign_body`, `free_air`, `bony_lesion`, `incidental_finding`.

The `reporting_category` free-text label (e.g. normal / abnormal-acute /
abnormal-chronic) summarizes the structured conclusion for Axis B.

### Body region and structured findings

| Body region | Typical structured findings |
| --- | --- |
| Chest | consolidation, pneumothorax, pleural-effusion, foreign-body |
| Abdomen | free-air, foreign-body, obstruction-pattern |
| Spine (cervical / thoracic / lumbar) | fracture, dislocation, bony-lesion |
| Pelvis / hip | fracture, dislocation, bony-lesion |
| Knee / ankle-foot / shoulder / wrist-hand | fracture, dislocation, foreign-body |
| Skull | fracture, foreign-body |
| Dental | bony-lesion, foreign-body |

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | body region, laterality, projections, examination adequacy |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Impression | impression, reporting category |
| 6 | Follow-up | recommended follow-up |
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
x-ray-test-result/
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
  Emphasizes *actionable reporting* and applies to all who report imaging,
  including plain radiographs.
  <https://www.rcr.ac.uk/media/wlsf4ufl/ppqi_reporting-standards-guidance.pdf>
- RCR — Standards for the communication of critical, urgent and unexpected
  significant radiological findings (second edition).
  <https://rad-alert.co.uk/Standards.pdf>
- RCR — Alerts and notification of imaging reports: recommendations (October
  2022).
  <https://www.rcr.ac.uk/media/44sfqlbi/rcr-publications_alerts-and-notification-of-imaging-reports-recommendations_october-2022.pdf>
- UK Ionizing Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose context carried from the request).
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
bin/test-form x-ray-test-result
```
