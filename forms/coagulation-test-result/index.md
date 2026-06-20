# Coagulation Test Result

A UK NHS–aligned **coagulation / haemostasis test result (report)** that a
reporting clinician completes after a coagulation test has been performed. It is
the **result/report counterpart** to *Coagulation Test Request* (a referral):
where the request captures why the tests should be done and is it safe, this form
records the reported **result values** and a structured **interpretation**. It
records the performed analysis and specimen condition, the clinical history and
anticoagulant status, the coagulation result values (prothrombin time / INR,
activated partial thromboplastin time / ratio, fibrinogen, D-dimer, thrombin
time, and factor assays), the narrative and impression, and recommended
follow-up — then computes a **four-axis interpretation grade** (result
classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
haematology report.

This form is the coagulation-laboratory result counterpart to the repository's
other clinician-driven result forms. It is completed by a consultant
haematologist, biomedical scientist, or other reporting clinician rather than by
the patient, and is aligned with the Royal College of Pathologists (RCPath)
guidance on the communication of critical and unexpected pathology results,
British Society for Haematology (BSH) haemostasis guidance, and BSH oral
anticoagulation management (including reversal at high INR).

## Scope and intended users

- **Setting:** NHS haematology / coagulation laboratory, haematology day unit,
  anticoagulation clinic, or hospital reporting workflow.
- **Users:** consultant haematologists, biomedical scientists, and other
  reporting clinicians who interpret, authorise, and sign coagulation reports.
- **Patients:** any patient who has undergone a coagulation / haemostasis test.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`coagulation_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets the reported
result values rather than vetting a referral.

## Reported result values

| Value | Column | Typical use |
| --- | --- | --- |
| Prothrombin time (PT) | `prothrombin_time_seconds` | Extrinsic / common pathway; warfarin, liver disease, DIC |
| INR | `inr` | Standardised PT for warfarin monitoring and reversal decisions |
| APTT | `activated_partial_thromboplastin_time_seconds` | Intrinsic / common pathway; heparin, factor deficiency, inhibitors |
| APTT ratio | `aptt_ratio` | Patient APTT ÷ mean normal APTT |
| Fibrinogen (Clauss) | `fibrinogen_g_l` | DIC, major haemorrhage, liver disease (g/L) |
| D-dimer | `d_dimer` | Fibrin degradation; VTE rule-out, DIC |
| Thrombin time (TT) | `thrombin_time_seconds` | Fibrinogen function; heparin / dabigatran effect |
| Factor assays | `factor_assays` | Factor levels, von Willebrand panel, lupus anticoagulant, anti-Xa |

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical value.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion against reference ranges and critical thresholds | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCPath actionable reporting + structured pattern labels (anticoagulant-effect, DIC-picture, isolated-APTT-prolongation) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, result values, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical value** (e.g. INR > 8, fibrinogen < 1.0 g/L, or a DIC picture)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Critical-value thresholds (examples)

| Critical value | Why it is critical | Action |
| --- | --- | --- |
| INR > 8 | High bleeding risk; BSH oral-anticoagulation reversal threshold | Communicate immediately; consider vitamin K |
| Fibrinogen < 1.0 g/L | Major-haemorrhage / DIC marker | Communicate immediately; consider cryoprecipitate / fibrinogen concentrate |
| DIC picture (low fibrinogen + high D-dimer + prolonged PT/APTT) | Consumptive coagulopathy | Communicate immediately; treat underlying cause |

`critical_value_present` captures whether any such threshold is breached;
`critical_value_detail` records which one and the value.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen & context | specimen condition, clinical history, on anticoagulant + agent |
| 3 | Result values | PT, INR, APTT, APTT ratio, fibrinogen, D-dimer, thrombin time, factor assays |
| 4 | Findings | findings narrative, overall result status, critical value present + detail |
| 5 | Comparison | comparison with previous results, reporting category |
| 6 | Impression | impression, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `specimen-quality-issue`,
`unexpected-finding`, `missing-impression`, `missing-result-value`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** haematology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
coagulation-test-result/
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

- RCPath — The communication of critical and unexpected pathology results.
  Anchors the critical-value alerting, the `critical_result_communicated` /
  `reported_to` fields, and the `critical-result-alert` flag.
  <https://www.rcpath.org/static/bb86b370-1545-4c5a-b5826a2c431934f5/The-communication-of-critical-and-unexpected-pathology-results.pdf>
- BSH — Guidelines on oral anticoagulation with warfarin (and updates): high-INR
  management and reversal thresholds (e.g. INR > 8) underpin the INR critical
  rule. <https://b-s-h.org.uk/guidelines/>
- BSH — Diagnosis and management of disseminated intravascular coagulation (DIC):
  combination of low fibrinogen, raised D-dimer, and prolonged PT/APTT.
  <https://b-s-h.org.uk/guidelines/>
- NICE NG158 *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing* (D-dimer interpretation). <https://www.nice.org.uk/guidance/ng158>

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
bin/test-form coagulation-test-result
```
