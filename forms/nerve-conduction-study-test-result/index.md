# Nerve Conduction Study Test Result

A UK NHS–aligned **nerve conduction study / EMG (electrodiagnostic) result
(report)** that a reporting clinician completes after a neurophysiology
examination has been performed. It is the **result/report counterpart** to
*Nerve Conduction Study Test Request* (a referral): where the request captures
why a study should be done, this form records what the study **found** and a
structured **interpretation**. It records the performed study type and region,
the clinical history, the nerve-conduction and needle-EMG findings, the
structured electrodiagnostic conclusions, the severity and pathophysiological
pattern, the impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured electrodiagnostic report.

This form is the electrodiagnostic / neurophysiology result counterpart to the
repository's other clinician-driven result forms. It is completed by a
neurologist, clinical neurophysiologist, or other reporting clinician rather
than by the patient, and is aligned with the AANEM *Recommended Policy for
Electrodiagnostic Medicine*, the AANEM standards for *Reporting the Results of
Nerve Conduction Studies and Needle EMG*, and the AANEM / AAN evidence-based
practice parameters for carpal tunnel syndrome and distal symmetric
polyneuropathy.

## Scope and intended users

- **Setting:** NHS neurophysiology department, electrodiagnostic laboratory, or
  neurology reporting workflow.
- **Users:** neurologists, clinical neurophysiologists, and other reporting
  clinicians who perform, interpret, and sign electrodiagnostic reports.
- **Patients:** any patient who has undergone a nerve conduction study, needle
  EMG, or repetitive-stimulation study.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this study, and is it
safe?*. A **result** form is retrospective and records *what did the study find,
and what does it mean?*. Accordingly the source-of-truth table here is
`nerve_conduction_study_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall electrodiagnostic conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | AANEM severity descriptors (e.g. CTS mild / moderate / severe; axonal vs demyelinating) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, study technique / adequacy, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — motor neurone disease / anterior-horn-cell features, or
a severe acute neuropathy such as a Guillain-Barré syndrome (acute inflammatory
demyelinating) pattern — **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes, because early
confirmation changes management, access to disease-modifying therapy, and the
urgency of inpatient review. Choose the least-urgent band only when no rule
fires.

### Structured findings

Boolean structured findings captured alongside the nerve-conduction and EMG
narratives, used to drive classification, severity, and flags:

`carpal_tunnel_syndrome`, `peripheral_neuropathy`, `radiculopathy`,
`motor_neurone_disease_features`, `myopathy`, `neuromuscular_junction_disorder`,
`normal_study`.

Characterisation: `severity` (mild / moderate / severe / not-applicable) and
`pattern` (demyelinating / axonal / mixed / not-applicable).

### Finding-to-interpretation mapping

| Structured finding | Typical study | Classification | AANEM / AAN basis |
| --- | --- | --- | --- |
| Carpal tunnel syndrome | Nerve conduction (± confirmatory EMG) | abnormal | Practice parameter: EDX studies in CTS; mild / moderate / severe grading |
| Peripheral neuropathy | Nerve conduction + EMG | abnormal | Practice parameter: distal symmetric polyneuropathy; axonal vs demyelinating |
| Radiculopathy | EMG (± nerve conduction) | abnormal | Needle EMG most specific for root level |
| Motor neurone disease features | Nerve conduction + EMG | critical | Widespread active + chronic denervation; expedite review |
| Severe acute neuropathy (e.g. GBS pattern) | Nerve conduction + EMG | critical | Demyelinating block / conduction failure; urgent neurology |
| Myopathy | EMG | abnormal | Needle EMG myopathic motor units |
| Neuromuscular junction disorder | Repetitive stimulation | abnormal | Decrement on repetitive stimulation |
| Normal study | Nerve conduction ± EMG | normal | No electrodiagnostic abnormality |

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Study details | study type, region, laterality, study adequacy |
| 3 | Clinical history | clinical history, comparison with previous studies |
| 4 | Findings | nerve-conduction findings, EMG findings + structured finding booleans |
| 5 | Characterisation | severity, pattern |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

A `critical-result-alert` fires for motor neurone disease features or a severe
acute neuropathy (e.g. GBS pattern); an `urgent-referral` for an abnormal result
needing expedited specialist review; `inadequate-technique` for a limited or
non-diagnostic study; and `missing-impression` when the impression is absent.

## Output

- **HTML report preview** and downloadable **PDF** electrodiagnostic report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
nerve-conduction-study-test-result/
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

- AANEM — *Recommended Policy for Electrodiagnostic Medicine* (standards for the
  performance and interpretation of NCS / needle EMG).
  <https://www.aanem.org/docs/default-source/documents/recommended-policy-2023.pdf>
- AANEM — *Reporting the Results of Nerve Conduction Studies and Needle EMG*
  (mandatory report content; published in *Muscle & Nerve*, October 2005, updated
  2014 / 2019 / 2024).
  <https://www.aanem.org/docs/default-source/documents/aanem/practice/rptresultsemgncs-pdf.pdf>
- AANEM / AAN / AAPM&R Practice Parameter: *Electrodiagnostic studies in carpal
  tunnel syndrome* (mild / moderate / severe severity grading; reaffirmed).
  <https://www.aanem.org/docs/default-source/documents/cts_reaffirmed.pdf>
- AAN / AANEM / AAPM&R Practice Parameter: *Evaluation of distal symmetric
  polyneuropathy* (axonal vs demyelinating characterisation).
  <https://www.neurology.org/doi/10.1212/01.wnl.0000336370.51010.a1>
- AANEM — *Carpal Tunnel Syndrome: an AANEM Quality Measure Set*
  (electrodiagnostic quality measures).
  <https://www.aanem.org/docs/default-source/documents/aanem/advocacy/zivkovic-et-al-2020-muscle-nerve.pdf>

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
bin/test-form nerve-conduction-study-test-result
```
