# Pulmonary Function Test Result

A UK NHS–aligned **pulmonary function test (lung-function / spirometry) result
(report)** that a reporting clinician completes after a lung-function test has
been performed. It is the **result/report counterpart** to *Pulmonary Function
Test Request* (a referral): where the request captures why a test should be done,
this form records what the test **found** and a structured **interpretation**. It
records the performed test type and ATS/ERS quality grade, the clinical history,
the measured spirometry and gas-transfer values (FEV1, FVC, FEV1/FVC ratio, PEF,
DLCO), the structured ventilatory interpretation (pattern, severity,
bronchodilator reversibility), the narrative and structured findings, the
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured lung-function report.

This form is the respiratory-diagnostics result counterpart to the repository's
other clinician-driven result forms. It is completed by a respiratory physician,
clinical physiologist, or other reporting clinician rather than by the patient,
and is aligned with the ERS/ATS technical standard on interpretive strategies for
routine lung function tests (2022), the ARTP statement on pulmonary function
testing, GOLD / NICE NG115 (COPD), and NICE NG80 (asthma).

## Scope and intended users

- **Setting:** NHS lung-function department, respiratory physiology laboratory,
  respiratory clinic, or teleporting / remote-reporting workflow.
- **Users:** respiratory physicians, clinical (respiratory) physiologists, and
  other reporting clinicians who interpret and sign lung-function reports.
- **Patients:** any patient who has undergone spirometry or wider pulmonary
  function testing.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`pulmonary_function_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical impairment.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | ATS/ERS z-score severity grading + GOLD percent-predicted banding | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, measured values, interpretation, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (severe or very-severe airflow obstruction or restriction,
marked decline in FEV1 versus a previous study, or another unexpected significant
abnormality) **auto-escalates** Axis D to *critical-alert*, raises the
`critical-result-alert` flag, and recommends urgent respiratory review regardless
of the other axes. Choose the least-urgent band only when no rule fires.

### Ventilatory pattern and severity

The interpretation distils the measured values into a single ventilatory
pattern, a severity band, and a bronchodilator-reversibility result:

| Field | Domain |
| --- | --- |
| `ventilatory_pattern` | normal / obstructive / restrictive / mixed |
| `severity` | none / mild / moderate / severe / very-severe |
| `bronchodilator_reversibility` | positive / negative / not-tested |

**Airflow obstruction** is defined by a post-bronchodilator FEV1/FVC ratio < 0.70
(NICE NG115 / GOLD). GOLD then bands obstruction by FEV1 % predicted: GOLD 1 mild
(≥ 80 %), GOLD 2 moderate (50–79 %), GOLD 3 severe (30–49 %), GOLD 4 very-severe
(< 30 %). The ATS/ERS 2022 standard instead grades severity by z-score (mild
−1.65 to −2.5, moderate −2.51 to −4, severe < −4.1); either banding may be
stored as the free-text `reporting_category` label.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`airflow_obstruction`, `restriction`, `reduced_gas_transfer`,
`significant_reversibility`, `normal_spirometry`.

Key measurements: `fev1_litres`, `fev1_percent_predicted`, `fvc_litres`,
`fvc_percent_predicted`, `fev1_fvc_ratio`, `peak_expiratory_flow`,
`dlco_percent_predicted`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, test type, report status, performed & reported dates |
| 2 | Test quality | ATS/ERS acceptability / repeatability grade, clinical history |
| 3 | Measured values | FEV1, FVC, FEV1/FVC ratio, PEF, DLCO (litres + percent predicted) |
| 4 | Interpretation | ventilatory pattern, severity, bronchodilator reversibility + structured finding booleans |
| 5 | Findings | findings narrative, comparison with previous |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** lung-function report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
pulmonary-function-test-result/
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

- ERS/ATS technical standard on interpretive strategies for routine lung function
  tests (Stanojevic et al., *Eur Respir J* 2022) — z-score-based severity grading.
  <https://publications.ersnet.org/content/erj/60/1/2101499>
- ARTP statement on pulmonary function testing (2020).
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC7337892/>
- NICE NG115 *Chronic obstructive pulmonary disease in over 16s* (post-bronchodilator
  FEV1/FVC < 0.70 confirms airflow obstruction). <https://www.nice.org.uk/guidance/ng115>
- NICE NG80 *Asthma: diagnosis, monitoring and chronic asthma management*
  (spirometry, bronchodilator reversibility, FeNO). <https://www.nice.org.uk/guidance/ng80>
- GOLD — Global Initiative for Chronic Obstructive Lung Disease (FEV1 %-predicted
  severity bands GOLD 1–4). <https://goldcopd.org/>

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
bin/test-form pulmonary-function-test-result
```
