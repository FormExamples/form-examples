# Ambulatory Blood Pressure Test Result

A UK NHS–aligned **ambulatory blood pressure monitoring (ABPM) result
(report)** that a reporting clinician completes after a 24-hour ABPM (or home
blood pressure monitoring) period has been performed. It is the
**result/report counterpart** to *Ambulatory Blood Pressure Test Request* (a
referral): where the request captures why monitoring should be done, this form
records what the monitoring **found** and a structured **interpretation**. It
records the monitoring modality and recording adequacy, the clinical history,
the daytime / nighttime / 24-hour averaged blood pressures, the nocturnal dip
and dipper status, the narrative and structured findings, the impression, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
ABPM report.

This form is the cardiovascular-diagnostics result counterpart to the
repository's other clinician-driven result forms, and mirrors the gold template
`ct-scan-test-result`. It is completed by a GP, cardiologist, nurse,
pharmacist, or other reporting clinician rather than by the patient, and is
aligned with NICE NG136 *Hypertension in adults* and British and Irish
Hypertension Society (BIHS) / European Society of Hypertension (ESH) ABPM
guidance.

## Scope and intended users

- **Setting:** GP surgery, hypertension clinic, cardiology outpatients,
  community diagnostic service, or monitoring-service reporting workflow.
- **Users:** GPs, cardiologists, nurses, pharmacists, and other reporting
  clinicians who interpret and sign ABPM reports.
- **Patients:** any patient who has undergone an ABPM or home blood pressure
  monitoring period.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`ambulatory_blood_pressure_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets the averaged
blood pressures rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical (severe-hypertension) result.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | NICE NG136 / ESH ABPM stage banding | abnormality severity (none / minor / moderate / major) + a `reporting_category` label (the hypertension stage) |
| **C. Report completeness** | Mandatory report-section checklist (history, averages, dipping, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **severe-hypertension result** (ABPM average ≥150/95 mmHg, equivalent to
clinic ≥180/120 mmHg) **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes (NICE NG136
same-day specialist review). Choose the least-urgent band only when no rule
fires.

### ABPM thresholds (NICE NG136 / ESH)

ABPM and home averages use **lower** thresholds than clinic blood pressure
because out-of-office readings are systematically lower.

| Measure | Threshold | Meaning |
| --- | --- | --- |
| Daytime (waking) average | ≥135/85 mmHg | Confirms hypertension; stage 1 |
| Daytime (waking) average | ≥150/95 mmHg | Stage 2 |
| 24-hour average | ≥130/80 mmHg | Hypertension |
| Nighttime (asleep) average | ≥120/70 mmHg | Nocturnal hypertension |
| ABPM average ≥150/95 (clinic-equiv ≥180/120) | — | Severe — same-day specialist review |

### Nocturnal dipping (ESH)

The nocturnal dip is the percentage fall in average systolic pressure from
daytime to nighttime. ESH classifies four patterns; non-dipping and reverse
dipping carry higher cardiovascular risk.

| Pattern | Nocturnal systolic fall |
| --- | --- |
| `dipper` (normal) | >10–20 % |
| `non-dipper` | >0–10 % |
| `reverse-dipper` | ≤0 % (a nighttime rise) |
| `extreme-dipper` | >20 % |

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`hypertension_confirmed`, `white_coat_effect`, `masked_hypertension`,
`severe_hypertension`, `nocturnal_hypertension`, `normal_study`.

Key measurements: the daytime / nighttime / 24-hour systolic and diastolic
averages, `nocturnal_dip_percent` (dipper status), and
`valid_readings_percent` (recording adequacy; ABPM is generally adequate at
≥70 % valid readings).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, monitoring type, report status, performed & reported dates |
| 2 | Recording adequacy | valid readings percent, recording adequate |
| 3 | Clinical history | clinical history |
| 4 | Averaged measurements | daytime / nighttime / 24-hour systolic & diastolic averages, nocturnal dip percent, dipper status |
| 5 | Findings | findings narrative + structured finding booleans |
| 6 | Impression | comparison with previous, impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** ABPM report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
ambulatory-blood-pressure-test-result/
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

- NICE NG136 *Hypertension in adults: diagnosis and management* — ABPM daytime
  average ≥135/85 mmHg confirms hypertension; clinic BP ≥180/120 mmHg (ABPM
  equivalent ≥150/95) prompts same-day specialist review.
  <https://www.nice.org.uk/guidance/ng136/chapter/recommendations>
- NICE NG136 visual summary — ABPM / HBPM vs clinic BP thresholds.
  <https://www.nice.org.uk/guidance/ng136/resources/visual-summary-pdf-6899919517>
- British and Irish Hypertension Society (BIHS) — ABPM measurement and reporting
  guidance, validated monitor lists.
  <https://bihsoc.org/>
- European Society of Hypertension (ESH) — nocturnal dipping classification
  (dipper / non-dipper / reverse-dipper / extreme-dipper).
  <https://www.ahajournals.org/doi/10.1161/HYPERTENSIONAHA.119.14085>

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
bin/test-form ambulatory-blood-pressure-test-result
```
