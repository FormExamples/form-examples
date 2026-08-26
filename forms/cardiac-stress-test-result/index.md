# Cardiac Stress Test Result

A UK NHS–aligned **cardiac stress / exercise test result (report)** that a
reporting clinician completes after a stress test has been performed. It is the
**result/report counterpart** to *Cardiac Stress Test Request* (a referral):
where the request captures why a stress test should be done and whether it is
safe, this form records what the test **found** and a structured
**interpretation**. It records the performed test type and protocol, the
clinical history, the haemodynamic and exercise response (peak heart rate,
percent-predicted heart rate, exercise duration, METs, blood-pressure response),
the structured ECG / symptom / arrhythmia findings, the overall positive /
negative / inconclusive conclusion, the **Duke treadmill prognostic score**, the
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured cardiology report.

This form is the cardiac-investigations result counterpart to the repository's
other clinician-driven result forms. It is completed by a cardiologist, cardiac
physiologist, consultant, registrar, or other reporting clinician rather than by
the patient, and is aligned with the ACC/AHA exercise-testing guidance, the Duke
treadmill score risk stratification, and ESC chronic coronary syndromes guidance.

## Scope and intended users

- **Setting:** NHS cardiology department, cardiac-physiology lab, rapid-access
  chest-pain clinic, or imaging / functional-testing reporting workflow.
- **Users:** cardiologists, cardiac physiologists, consultants, registrars, and
  other reporting clinicians who interpret and sign stress-test reports.
- **Patients:** any patient who has undergone an exercise or pharmacological
  cardiac stress test.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`cardiac_stress_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical, high-risk finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion (positive / negative / inconclusive) | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | ACC/AHA prognostic stratification + Duke treadmill score risk band | abnormality severity (none / minor / moderate / major) + a `reporting_category` risk label |
| **C. Report completeness** | Mandatory report-section checklist (history, protocol, haemodynamic response, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical result** — a strongly positive test, **exertional hypotension**,
ischaemia induced at **low workload**, or a **high-risk Duke treadmill score** —
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Test types

| Test type | Notes |
| --- | --- |
| Exercise treadmill ECG | ECG stress; supports the Duke treadmill score |
| Stress echocardiography | Imaging stress; exercise or pharmacological |
| Dobutamine stress echo | Pharmacological alternative to exercise stress |
| Myocardial perfusion SPECT | Functional perfusion imaging |
| Stress cardiac MRI | High-resolution functional perfusion / viability imaging |

### Duke treadmill score

For exercise treadmill ECG, the **Duke treadmill score (DTS)** summarizes
prognosis from three measured terms:

```
DTS = exercise time (minutes) − (5 × maximal ST deviation in mm) − (4 × angina index)
```

where the angina index is 0 (none), 1 (non-limiting angina), or 2 (exercise-
limiting angina). The score runs from about **−25 (highest risk)** to **+15
(lowest risk)** and stratifies five-year survival into three bands:

| Risk band | Score | Approx. 5-year survival |
| --- | --- | --- |
| Low risk | ≥ +5 | ~97% |
| Intermediate risk | −10 to +4 | ~90% |
| High risk | ≤ −11 | ~65% |

A **high-risk** Duke score is treated as a critical result and drives the
follow-up-urgency axis and the `critical-result-alert` flag.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`ischaemic_st_changes`, `chest_pain_induced`, `arrhythmia_induced`,
`terminated_early`, `test_positive`, `test_negative`, `test_inconclusive`.

Key haemodynamic measurements: `maximum_heart_rate_bpm`,
`percent_predicted_heart_rate` (≥85% for an adequate test),
`exercise_duration_minutes`, `mets_achieved` (functional capacity),
`peak_blood_pressure`, `blood_pressure_response`, and `duke_treadmill_score`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | test type, protocol (e.g. Bruce), clinical history |
| 3 | Haemodynamic & exercise response | max heart rate, percent-predicted HR, exercise duration, METs, peak BP, BP response |
| 4 | Findings | structured finding booleans + reason for termination |
| 5 | Prognostic score | Duke treadmill score, comparison with previous |
| 6 | Impression | impression, reporting category (risk), recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** cardiology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / cardiology information system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
cardiac-stress-test-result/
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

- ACC/AHA 2002 Guideline Update for Exercise Testing (test termination,
  exertional hypotension, prognostic use of exercise testing).
  <https://www.ahajournals.org/doi/10.1161/01.cir.0000034670.06526.15>
- Mark DB et al. Use of a Prognostic Treadmill Score in Identifying Diagnostic
  Coronary Disease Subgroups (Duke treadmill score), *Circulation*, 1998.
  <https://www.ahajournals.org/doi/10.1161/01.cir.98.16.1622>
- 2024 ESC Guidelines for the management of chronic coronary syndromes
  (exercise ECG and stress imaging in the diagnostic pathway).
  <https://academic.oup.com/eurheartj/article/45/36/3415/7743115>
- ACC/AHA/ASE/ASNC/.../STS 2023 Multimodality Appropriate Use Criteria for the
  Detection and Risk Assessment of Chronic Coronary Disease.
  <https://www.jacc.org/doi/10.1016/j.jacc.2023.03.410>

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
bin/test-form cardiac-stress-test-result
```
