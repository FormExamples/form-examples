# Eye Vision Test Result

A UK NHS–aligned **ophthalmic / optometric eye examination result (report)** that
a reporting clinician completes after an eye vision test has been performed. It
is the **result/report counterpart** to *Eye Vision Test Request* (a referral):
where the request captures why an eye examination should be done, this form
records what the examination **found** and a structured **interpretation**. It
records the performed test type, the clinical history, the visual-acuity,
intraocular-pressure and visual-field measurements, the narrative and structured
findings (including diabetic-retinopathy grading), the impression, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
ophthalmic report.

This form is the eye-examination result counterpart to the repository's other
clinician-driven result forms. It is completed by an ophthalmologist,
optometrist, orthoptist, or other reporting clinician rather than by the
patient, and is aligned with Royal College of Ophthalmologists (RCOphth)
reporting and acute-eye guidance, NICE NG81 *Glaucoma: diagnosis and
management*, and the NHS Diabetic Eye Screening Programme retinal-grading
criteria.

## Scope and intended users

- **Setting:** NHS hospital eye service, community optometry practice, emergency
  eye clinic, diabetic eye screening service, or eye-care reporting workflow.
- **Users:** ophthalmologists, optometrists, orthoptists, and other reporting
  clinicians who interpret and sign eye examination reports.
- **Patients:** any patient who has undergone an ophthalmic eye vision test.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`eye_vision_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCOphth actionable reporting + structured systems (e.g. NHS diabetic eye screening grade) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, measurements, findings, impression, follow-up) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (sudden visual loss, acutely raised intraocular pressure,
signs of giant cell arteritis, retinal detachment, or proliferative diabetic
retinopathy) **auto-escalates** Axis D to *critical-alert*, sets the
recommendation to *urgent-review* (urgent ophthalmology), and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`reduced_visual_acuity`, `visual_field_defect`, `raised_intraocular_pressure`,
`diabetic_retinopathy`, `optic_disc_abnormality`, `macular_abnormality`,
`normal_examination`.

Key measurements: `visual_acuity_right` / `visual_acuity_left` (e.g. 6/6),
`intraocular_pressure_right_mmhg` / `intraocular_pressure_left_mmhg`, the
`visual_field_result` (full / defect-right / defect-left / bilateral-defect),
and the diabetic-retinopathy `retinopathy_grade` (none / background /
pre-proliferative / proliferative / maculopathy / not-applicable).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, test type, performed & reported dates |
| 2 | Clinical history | clinical history / the question the test answered |
| 3 | Measurements | visual acuity (right / left), intraocular pressure (right / left, mmHg), visual-field result |
| 4 | Findings | findings narrative + structured finding booleans + retinopathy grade |
| 5 | Impression | impression, reporting category, recommended follow-up |
| 6 | Critical-result communication | critical result communicated, reported to |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** ophthalmic report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / ophthalmic EPR.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
eye-vision-test-result/
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

- Royal College of Ophthalmologists (RCOphth) — clinical guidelines and
  acute-eye / emergency guidance; sudden visual loss, central retinal artery
  occlusion, acute angle-closure glaucoma, retinal detachment, and giant cell
  arteritis are ophthalmic emergencies. <https://www.rcophth.ac.uk/>
- NICE NG81 *Glaucoma: diagnosis and management* — single 24 mmHg intraocular
  pressure referral/treatment threshold and optic-nerve-head assessment.
  <https://www.nice.org.uk/guidance/ng81>
- NHS Diabetic Eye Screening Programme — grading definitions for referable
  disease (R0/R1/R2/R3 retinopathy and M0/M1 maculopathy grades).
  <https://www.gov.uk/government/publications/diabetic-eye-screening-retinal-image-grading-criteria>
- College of Optometrists — clinical management guidelines and referral
  pathways. <https://www.college-optometrists.org/>

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
bin/test-form eye-vision-test-result
```
