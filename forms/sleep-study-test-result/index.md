# Sleep Study Test Result

A UK NHS–aligned **sleep study / polysomnography result (report)** that a
reporting clinician completes after a sleep investigation has been performed. It
is the **result/report counterpart** to *Sleep Study Test Request* (a referral):
where the request captures why a study should be done, this form records what the
study **found** and a structured **interpretation**. It records the performed
study type and adequacy, the clinical history, the key quantitative metrics
(recording and sleep time, apnoea-hypopnoea index, oxygen desaturation index,
minimum and time-below-90% SpO2, mean heart rate), the OSA severity band, the
narrative and structured findings, the impression, and recommended follow-up —
then computes a **four-axis interpretation grade** (result classification,
abnormality severity / structured reporting, report completeness, and follow-up
urgency) plus a set of safety-critical flags including an automatic
**critical-result alert**. The output is a structured sleep-study report.

This form is the sleep-medicine result counterpart to the repository's other
clinician-driven result forms. It is completed by a respiratory physician, sleep
physician, clinical physiologist, or other reporting clinician rather than by the
patient, and is aligned with the American Academy of Sleep Medicine (AASM)
scoring manual, NICE NG202, and DVLA fitness-to-drive guidance for excessive
sleepiness.

## Scope and intended users

- **Setting:** NHS respiratory or sleep service, sleep-laboratory reporting
  room, community diagnostic centre, or home-sleep-test reporting workflow.
- **Users:** respiratory physicians, sleep physicians, clinical physiologists,
  and other reporting clinicians who interpret and sign sleep-study reports.
- **Patients:** any patient who has undergone a sleep study (home sleep apnoea
  test, polysomnography, overnight oximetry, MSLT, or actigraphy).

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this study, and is it
appropriate?*. A **result** form is retrospective and records *what did the
study find, and what does it mean?*. Accordingly the source-of-truth table here
is `sleep_study_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | AASM AHI severity bands (+ desaturation context) | abnormality severity (none / minor / moderate / major) + a `reporting_category` AHI-band label |
| **C. Report completeness** | Mandatory report-section checklist (history, study technique/adequacy, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — **severe OSA (AHI ≥ 30) with significant desaturation**,
or **nocturnal hypoventilation** — **auto-escalates** Axis D to *critical-alert*,
triggers an **urgent CPAP / ventilation review**, raises the
`critical-result-alert` flag, and notes the **occupational-driver implications**
regardless of the other axes. Choose the least-urgent band only when no rule
fires.

### AHI severity bands (AASM)

| AHI (events/hour) | OSA severity (`osa_severity`) |
| --- | --- |
| < 5 | none |
| 5 to < 15 | mild |
| 15 to < 30 | moderate |
| ≥ 30 | severe |

Severity is interpreted alongside the desaturation burden — Oxygen Desaturation
Index (ODI), nadir SpO2 (`minimum_spo2_percent`), and the percentage of time
below 90% saturation (`time_below_90_percent_spo2`, T90).

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`obstructive_sleep_apnoea`, `central_sleep_apnoea`, `periodic_limb_movements`,
`nocturnal_hypoventilation`, `significant_desaturation`, `normal_study`.

Key metrics: `apnoea_hypopnoea_index` (AHI), `oxygen_desaturation_index` (ODI),
`minimum_spo2_percent`, `time_below_90_percent_spo2` (T90),
`total_recording_time_hours`, `total_sleep_time_hours`, `mean_heart_rate_bpm`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Study details | study type, study adequacy |
| 3 | Clinical history | clinical history, comparison with previous studies |
| 4 | Metrics | recording & sleep time, AHI, ODI, minimum SpO2, T90, mean heart rate |
| 5 | Findings | OSA severity, structured finding booleans, findings narrative |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** sleep-study report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
sleep-study-test-result/
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

- AASM scoring manual — scoring of respiratory events and AHI severity
  classification (normal <5, mild 5 to <15, moderate 15 to <30, severe ≥30).
  <https://aasm.org/clinical-resources/scoring-manual/>
- NICE NG202 *Obstructive sleep apnoea/hypopnoea syndrome and obesity
  hypoventilation syndrome in over 16s* (CPAP, non-invasive ventilation for OHS,
  follow-up in line with DVLA guidance).
  <https://www.nice.org.uk/guidance/ng202>
- NICE NG202 — OSAHS chapter.
  <https://www.nice.org.uk/guidance/ng202/chapter/1-Obstructive-sleep-apnoeahypopnoea-syndrome>
- DVLA *Assessing fitness to drive* — excessive sleepiness / OSA syndrome and
  driving (occupational-driver implications).
  <https://www.gov.uk/guidance/neurological-disorders-assessing-fitness-to-drive>

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
bin/test-form sleep-study-test-result
```
