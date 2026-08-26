# Holter Monitor Test Result

A UK NHS–aligned **ambulatory ECG (Holter) monitor result (report)** that a
reporting clinician completes after an ambulatory cardiac rhythm recording has
been performed and analysed. It is the **result/report counterpart** to *Holter
Monitor Test Request* (a referral): where the request captures why monitoring
should be done, this form records what the recording **found** and a structured
**interpretation**. It records the monitor type and recording quality, the
clinical history, the rhythm and rate summary (mean / minimum / maximum heart
rate, longest pause, ectopy burden), the structured and narrative findings, the
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured ambulatory ECG report.

This form is the ambulatory-cardiology result counterpart to the repository's
other clinician-driven result forms, and mirrors the *CT Scan Test Result* gold
template. It is completed by a cardiologist, cardiac physiologist, or other
reporting clinician rather than by the patient, and is aligned with ACC/AHA
ambulatory electrocardiography guidance, the 2017 ISHNE-HRS expert consensus on
ambulatory ECG and external cardiac monitoring, NICE NG196 atrial fibrillation
guidance, and ESC guidance on bradycardia / cardiac pacing and ventricular
arrhythmias.

## Scope and intended users

- **Setting:** NHS cardiac physiology / cardiac investigations department,
  reporting room, or telecardiology analysis workflow.
- **Users:** cardiologists, cardiac physiologists, and other reporting
  clinicians who analyse and sign ambulatory ECG reports.
- **Patients:** any patient who has undergone an ambulatory ECG (Holter, event
  recorder, or implantable loop recorder) recording.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`holter_monitor_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Actionable reporting + structured rhythm / AF-burden categories | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, rhythm summary, rate summary, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Critical rhythm findings

The following are escalated to *critical* (Axis A) / *critical-alert* (Axis D),
consistent with guidance that significant arrhythmias warrant prompt specialist
referral even when asymptomatic:

| Finding | Field(s) | Why |
| --- | --- | --- |
| Ventricular tachycardia | `ventricular_tachycardia` | sustained / rapid VT is life-threatening |
| Pause > 3 seconds | `significant_pauses`, `longest_pause_seconds` | significant pause / sinus arrest |
| High-grade AV block | `high_grade_av_block` | Mobitz II or third-degree block; pacing risk |
| Fast atrial fibrillation | `atrial_fibrillation_detected` + high `maximum_heart_rate_bpm` | uncontrolled fast ventricular response |

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`atrial_fibrillation_detected`, `significant_pauses`, `ventricular_tachycardia`,
`supraventricular_tachycardia`, `high_grade_av_block`,
`symptom_rhythm_correlation`, `normal_study`.

Key measurements: `mean_heart_rate_bpm`, `minimum_heart_rate_bpm`,
`maximum_heart_rate_bpm`, `longest_pause_seconds`, `ventricular_ectopic_percent`,
and `supraventricular_ectopic_percent`. Recording quality is captured by
`recording_duration_hours` and `analysed_percent`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, monitor type, performed & reported dates |
| 2 | Recording quality | recording duration (hours), analysed percent |
| 3 | Clinical history | clinical history, comparison with previous |
| 4 | Rhythm & rate summary | predominant rhythm, mean / min / max heart rate, longest pause, ectopy burden |
| 5 | Structured findings | AF, significant pauses, VT, SVT, high-grade AV block, symptom-rhythm correlation, normal study + narrative |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-recording`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** ambulatory ECG report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / cardiology information system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
holter-monitor-test-result/
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

- ACC/AHA Guidelines for Ambulatory Electrocardiography (1–9 ordinal scale;
  Class I for unexplained syncope, near-syncope, dizziness, and palpitations).
  <https://www.ahajournals.org/doi/10.1161/01.cir.100.8.886>
- 2017 ISHNE-HRS expert consensus statement on ambulatory ECG and external
  cardiac monitoring / telemetry.
  <https://www.heartrhythmjournal.com/article/s1547-5271(17)30415-0/fulltext>
- NICE NG196 *Atrial fibrillation: diagnosis and management* (monitor duration
  by symptom frequency; rate-control targets).
  <https://www.nice.org.uk/guidance/ng196/chapter/Recommendations>
- 2021 ESC Guidelines on cardiac pacing and cardiac resynchronization therapy
  (pauses, sinus-node disease, and AV block thresholds for pacing).
  <https://www.escardio.org/Guidelines>

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
bin/test-form holter-monitor-test-result
```
