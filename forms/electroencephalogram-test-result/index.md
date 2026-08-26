# Electroencephalogram Test Result

A UK NHS–aligned **electroencephalogram (EEG) result (report)** that a reporting
clinician completes after an EEG recording has been performed. It is the
**result/report counterpart** to *Electroencephalogram Test Request* (a
referral): where the request captures why a recording should be done, this form
records what the recording **found** and a structured **interpretation**. It
records the performed recording (EEG type, duration, technical quality), the
clinical history, the background rhythm and structured neurophysiological
findings, the narrative interpretation and clinical correlation, the impression,
and recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
neurophysiology report.

This form is the neurophysiology result counterpart to the repository's other
clinician-driven result forms. It is completed by a neurologist, clinical
neurophysiologist, or clinical physiologist rather than by the patient, and is
aligned with the joint IFCN / ILAE minimum recording standards, the ILAE /
IFCN reporting practice for routine, sleep, ambulatory, and video-EEG, the
Standardized Computer-based Organized Reporting of EEG (SCORE) framework, and
the ACNS standardized critical-care EEG terminology.

## Scope and intended users

- **Setting:** NHS clinical neurophysiology department reporting room,
  teleneurophysiology service, or neurophysiology reporting workflow.
- **Users:** neurologists, clinical neurophysiologists, and clinical
  physiologists who interpret and sign EEG reports.
- **Patients:** any patient who has undergone an EEG recording (routine awake,
  sleep-deprived, ambulatory 24-hour, or video-telemetry).

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
appropriate?*. A **result** form is retrospective and records *what did the test
find, and what does it mean?*. Accordingly the source-of-truth table here is
`electroencephalogram_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Background-rhythm grading + structured systems (e.g. a SCORE category, epileptiform-discharge classification) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — **status epilepticus** (including non-convulsive
status), a **recorded seizure**, or **frequent epileptiform discharges** —
**auto-escalates** Axis D to *critical-alert*, classifies the result as
*critical* on Axis A, and raises the `critical-result-alert` flag regardless of
the other axes. Choose the least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`epileptiform_discharges`, `focal_slowing`, `generalised_slowing`,
`seizure_recorded`, `status_epilepticus`, `photoparoxysmal_response`,
`normal_eeg`.

Background rhythm is graded with `background_rhythm`
(normal / excess-slow / asymmetric / abnormal). Recording context is captured by
`recording_duration_minutes` and `recording_quality`
(good / adequate / limited).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Recording details | EEG type, recording duration (minutes), recording quality |
| 3 | Clinical history | clinical history, comparison with previous EEG |
| 4 | Findings | background rhythm + structured finding booleans, findings narrative |
| 5 | Interpretation | clinical correlation, reporting category |
| 6 | Impression | impression, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** neurophysiology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
electroencephalogram-test-result/
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

- Routine and sleep EEG: minimum recording standards of the International
  Federation of Clinical Neurophysiology (IFCN) and the International League
  Against Epilepsy (ILAE) — Peltola et al., *Epilepsia*, 2023.
  <https://onlinelibrary.wiley.com/doi/abs/10.1111/epi.17448>
- Joint ILAE and IFCN minimum standards for recording routine and sleep EEG.
  <https://www.ilae.org/files/dmfile/eeg-minimum-standards.pdf>
- ILAE — minimum standards for long-term video-EEG monitoring (joint ILAE /
  IFCN clinical practice guideline).
  <https://www.ilae.org/guidelines/guidelines-and-reports/proposed-guideline-minimum-standards-for-long-term-video-eeg-monitoring>
- SCORE — Standardized Computer-based Organized Reporting of EEG (structured
  reporting from predefined elements per EEG feature), *Clinical
  Neurophysiology*.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3759702/>
- ACNS — Standardized Critical Care EEG Terminology, 2021 version (background,
  rhythmic, and periodic patterns; non-convulsive status).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC8135051/>

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
bin/test-form electroencephalogram-test-result
```
