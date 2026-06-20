# Echocardiogram Test Result

A UK NHS–aligned **echocardiogram (echo) result (report)** that a reporting
clinician completes after an echocardiogram study has been performed. It is the
**result/report counterpart** to *Echocardiogram Test Request* (a referral):
where the request captures why an echo should be done, this form records what the
study **found** and a structured **interpretation**. It records the performed
study type and image quality, the clinical history, left-ventricular function
(ejection fraction, qualitative function, LV internal diameter), valvular
stenosis and regurgitation grades, estimated pulmonary artery systolic pressure,
structured findings, the narrative and impression, a structured reporting
category, and recommended follow-up — then computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
echocardiography report.

This form is the cardiac-imaging result counterpart to the repository's other
clinician-driven result forms. It is completed by a cardiologist, cardiac
physiologist, sonographer, or other reporting clinician rather than by the
patient, and is aligned with the British Society of Echocardiography (BSE)
minimum dataset for adult transthoracic echocardiography, the ASE/EACVI
recommendations for cardiac chamber quantification, and recognised valve-disease
severity-grading conventions.

## Scope and intended users

- **Setting:** NHS echocardiography / cardiac-physiology department, cardiology
  clinic, heart-failure service, or telereporting workflow.
- **Users:** cardiologists, cardiac physiologists, sonographers, and other
  clinicians who perform, interpret, and sign echo reports.
- **Patients:** any patient who has undergone an echocardiogram study.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`echocardiogram_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Valve-disease and LV-function severity grading (ASE/EACVI, BSE) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | BSE minimum-dataset section checklist (history, LV function, valves, pulmonary pressure, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — severe valve disease, a valvular vegetation (suspected
endocarditis), a large pericardial effusion or tamponade, severe LV impairment,
or an intracardiac thrombus — **auto-escalates** Axis D to *critical-alert* and
raises the `critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Echo type and study quality

| Echo type | Typical use |
| --- | --- |
| Transthoracic (TTE) | First-line study for nearly all indications |
| Transoesophageal (TOE) | Endocarditis, valve detail, cardiac source of embolism, pre-cardioversion thrombus |
| Stress echo | Inducible ischaemia, low-flow low-gradient aortic stenosis, viability |
| Contrast echo | Poor acoustic windows, LV opacification, suspected apical pathology |

`study_quality` (good / adequate / limited / poor) records acoustic-window image
quality; a *limited* or *poor* study raises the `limited-study-quality` flag and
can drive an *inconclusive* classification.

### Structured measurements and findings

Quantitative measurements captured alongside the narrative and used to drive
classification, severity, and flags:

- `lv_ejection_fraction_percent` (LVEF) and `lv_function`
  (normal / mildly-impaired / moderately-impaired / severely-impaired).
- `lv_internal_diameter_diastole_mm` (LVIDd).
- Valve grades: `aortic_stenosis`, `aortic_regurgitation`, `mitral_stenosis`,
  `mitral_regurgitation` (none / mild / moderate / severe).
- `pulmonary_artery_systolic_pressure_mmhg` (estimated PASP).

Boolean structured findings: `lv_hypertrophy`,
`regional_wall_motion_abnormality`, `pericardial_effusion`, `vegetation`,
`intracardiac_thrombus`, `normal_study`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, echo type, report status, study quality, performed & reported dates |
| 2 | Clinical history | clinical history |
| 3 | LV function & dimensions | LVEF, qualitative LV function, LVIDd, LV hypertrophy, regional wall-motion abnormality |
| 4 | Valves & pressures | aortic / mitral stenosis & regurgitation, estimated PASP |
| 5 | Structured findings | pericardial effusion, vegetation, intracardiac thrombus, normal study |
| 6 | Findings & impression | findings narrative, comparison with previous, impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `severe-valve-disease`, `suspected-endocarditis`,
`pericardial-effusion-tamponade`, `severe-lv-impairment`,
`intracardiac-thrombus`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `limited-study-quality`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** echocardiography report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / cardiology information system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
echocardiogram-test-result/
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

- A practical guideline for performing a comprehensive transthoracic
  echocardiogram in adults: the British Society of Echocardiography minimum
  dataset (*Echo Research & Practice*, 2020).
  <https://pubmed.ncbi.nlm.nih.gov/33112828/>
- Normal reference intervals for cardiac dimensions and function for use in
  echocardiographic practice — a guideline from the British Society of
  Echocardiography. <https://pmc.ncbi.nlm.nih.gov/articles/PMC7040881/>
- Recommendations for Cardiac Chamber Quantification by Echocardiography in
  Adults — an update from the American Society of Echocardiography and the
  European Association of Cardiovascular Imaging (2015).
  <https://www.asecho.org/wp-content/uploads/2016/02/2015_ChamberQuantificationREV.pdf>
- British Society of Echocardiography — protocols, minimum datasets, and
  reporting guidance. <https://www.bsecho.org/>

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
bin/test-form echocardiogram-test-result
```
