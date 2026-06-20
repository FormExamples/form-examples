# Electrocardiogram Test Result

A UK NHS–aligned **electrocardiogram (ECG) test result (report)** that a
reporting clinician completes after an ECG examination has been recorded. It is
the **result/report counterpart** to *Electrocardiogram Test Request* (a
referral): where the request captures why an ECG should be done, this form
records what the ECG **found** and a structured **interpretation**. It records
the recorded ECG type and trace quality, the clinical history, the ventricular
rate, the dominant rhythm and the PR / QRS / QT / QTc intervals and cardiac
axis, the structured electrophysiological findings (ST elevation / depression,
T-wave inversion, pathological Q waves, LVH, bundle branch block, ischaemia,
normal), the narrative interpretation and impression, and recommended follow-up
— then computes a **four-axis interpretation grade** (result classification,
abnormality severity / structured reporting, report completeness, and follow-up
urgency) plus a set of safety-critical flags including an automatic
**critical-result alert**. The output is a structured cardiology report.

This form is the cardiology-diagnostics result counterpart to the repository's
other clinician-driven result forms. It is completed by a cardiologist, cardiac
physiologist, or other reporting clinician rather than by the patient, and is
aligned with the AHA/ACCF/HRS *Recommendations for the Standardization and
Interpretation of the Electrocardiogram*, the *Fourth Universal Definition of
Myocardial Infarction* (2018) STEMI criteria, and recognised QTc-prolongation
thresholds.

## Scope and intended users

- **Setting:** NHS cardiology clinic, cardiac-physiology / ECG reporting room,
  acute medical unit, emergency department, or telecardiology reporting service.
- **Users:** cardiologists, cardiac physiologists, and other reporting
  clinicians who interpret and sign ECG reports.
- **Patients:** any patient who has undergone an ECG examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`electrocardiogram_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | AHA/ACCF/HRS interpretation statements + structured categories | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, rate/rhythm, intervals, interpretation, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — ST-segment elevation (STEMI / acute injury pattern),
ventricular tachycardia, complete (third-degree) heart block, or a markedly
prolonged QTc (≥ 500 ms) — **auto-escalates** Axis D to *critical-alert* and
raises the `critical-result-alert` flag regardless of the other axes, implying
an **urgent same-hour** communication to the responsible team. Choose the
least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`st_elevation`, `st_depression`, `t_wave_inversion`, `pathological_q_waves`,
`left_ventricular_hypertrophy`, `bundle_branch_block`, `ischaemia`, `normal_ecg`.

Key measurements: ventricular rate (`ventricular_rate_bpm`), the PR, QRS, QT and
rate-corrected QTc intervals (milliseconds), the dominant `rhythm`, and the
frontal-plane `cardiac_axis`.

### Interval reference context

| Interval | Typical normal | Significance |
| --- | --- | --- |
| PR | ~120–200 ms | Prolongation indicates AV conduction delay / heart block |
| QRS | < 120 ms | Widening indicates bundle branch block or ventricular origin |
| QTc (Bazett) | < 450 ms (men), < 460 ms (women) | ≥ 500 ms is markedly prolonged with torsades-de-pointes risk |

STEMI ST-elevation criteria (Fourth Universal Definition of MI): ≥ 1 mm in two
contiguous leads (excluding V2–V3), with age- and sex-specific thresholds in
V2–V3, in the absence of LVH and bundle branch block.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, ECG type, report status, performed & reported dates, recording quality |
| 2 | Clinical history | clinical history, comparison with previous ECGs |
| 3 | Rate, rhythm & intervals | ventricular rate, rhythm, PR / QRS / QT / QTc, cardiac axis |
| 4 | Findings | structured finding booleans (ST elevation / depression, T-wave inversion, Q waves, LVH, BBB, ischaemia, normal) |
| 5 | Interpretation | narrative interpretation, reporting category |
| 6 | Impression | impression, recommended follow-up |
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
electrocardiogram-test-result/
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

- AHA/ACCF/HRS — Recommendations for the Standardization and Interpretation of
  the Electrocardiogram (standardized diagnostic statements and modifiers).
  <https://www.ahajournals.org/doi/10.1161/circulationaha.106.180200>
- AHA/ACCF/HRS Part VI: Acute Ischemia/Infarction (ST-segment and ischaemia
  interpretation).
  <https://www.jacc.org/doi/10.1016/j.jacc.2008.12.016>
- Fourth Universal Definition of Myocardial Infarction (2018) — STEMI ECG
  criteria.
  <https://www.ahajournals.org/doi/10.1161/CIR.0000000000000617>
- Acute ST-Segment Elevation Myocardial Infarction (STEMI) — StatPearls.
  <https://www.ncbi.nlm.nih.gov/books/NBK532281/>
- QT interval / QTc prolongation reference (LITFL ECG library).
  <https://litfl.com/qt-interval-ecg-library/>

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
bin/test-form electrocardiogram-test-result
```
