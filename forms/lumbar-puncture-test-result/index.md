# Lumbar Puncture Test Result

A UK NHS–aligned **lumbar puncture (LP) / cerebrospinal-fluid (CSF) analysis
result (report)** that a reporting clinician completes after a lumbar puncture
has been performed. It is the **result/report counterpart** to *Lumbar Puncture
Test Request* (a referral): where the request captures why CSF sampling and/or
manometry should be done and whether it is safe, this form records what the
analysis **found** and a structured **interpretation**. It records the manometry
opening pressure, the CSF macroscopic appearance, the cell counts, the
biochemistry (protein, glucose, CSF:serum glucose ratio, lactate), the
microbiology (Gram stain, culture, PCR) and specialist tests (oligoclonal bands,
xanthochromia spectrophotometry), the narrative and structured findings, the
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured CSF analysis report.

This form is the neurology-procedure result counterpart to the repository's
other clinician-driven result forms, and mirrors the **gold template**
`ct-scan-test-result`. It is completed by a neurologist, hospital doctor,
microbiologist, or other reporting clinician rather than by the patient, and is
aligned with NICE NG240 (bacterial meningitis / meningococcal disease), the UK
NEQAS national guidelines for CSF bilirubin (xanthochromia) analysis in suspected
subarachnoid haemorrhage, and standard CSF interpretation thresholds.

## Scope and intended users

- **Setting:** NHS neurology service, acute medical unit, emergency department,
  inpatient ward, or microbiology / clinical-biochemistry reporting workflow.
- **Users:** neurologists, hospital doctors, microbiologists, and other
  reporting clinicians who interpret and sign CSF analysis reports.
- **Patients:** any patient who has undergone a lumbar puncture.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`lumbar_puncture_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## CSF interpretation

The CSF profile is interpreted against standard reference patterns. The form
captures the raw measurements and a set of structured interpretive booleans
(`raised_protein`, `pleocytosis`, `low_glucose`, `bacterial_meningitis_pattern`,
`viral_pattern`, `subarachnoid_haemorrhage_suggested`, `normal_csf`) that drive
classification, severity, and flags.

| Parameter | Normal adult (approx.) | Bacterial meningitis | Viral / aseptic | SAH |
| --- | --- | --- | --- | --- |
| Opening pressure (cmH₂O) | 6–25 | raised | normal / mildly raised | raised |
| Appearance | clear | cloudy / turbid | clear | blood-stained / xanthochromic |
| White cell count (/µL) | < 5 | high, neutrophil-predominant | raised, lymphocyte-predominant | mildly raised |
| Protein (g/L) | 0.15–0.45 | raised | normal / mildly raised | raised |
| CSF:serum glucose ratio | ≈ 0.6 | low (< 0.4) | normal | normal |
| Lactate (mmol/L) | < 2.1 | raised (> 3.5) | normal | normal |
| Xanthochromia | negative | negative | negative | positive (≥ 12 h after onset) |

For suspected subarachnoid haemorrhage with a negative CT brain, LP is performed
**≥ 12 h after headache onset** so CSF bilirubin (xanthochromia) can develop for
spectrophotometric detection per the UK NEQAS national guidelines.

## Interpretation grading

The engine grades each result on **four independent axes**. Axes are orthogonal:
a complete, well-structured report can still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | CSF pattern classification (bacterial / viral / SAH / inflammatory-demyelinating / normal) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, appearance, cell counts, biochemistry, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical CSF result** — a **bacterial meningitis pattern**, a **suggested
subarachnoid haemorrhage**, or a **positive culture** — **auto-escalates** Axis D
to *critical-alert* and raises the `critical-result-alert` flag regardless of the
other axes. Choose the least-urgent band only when no rule fires.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Clinical history | clinical history |
| 3 | Manometry & appearance | opening pressure (cmH₂O), CSF appearance |
| 4 | Cell counts & biochemistry | white / red cell counts, protein, glucose, CSF:serum glucose ratio, lactate |
| 5 | Microbiology & specialist tests | Gram stain, culture, PCR, oligoclonal bands, xanthochromia |
| 6 | Interpretation & impression | structured finding booleans, findings narrative, impression, reporting category, recommended follow-up |
| 7 | Sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** CSF analysis report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
lumbar-puncture-test-result/
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

- NICE NG240 *Meningitis (bacterial) and meningococcal disease: recognition,
  diagnosis and management* — CSF analysis to distinguish bacterial from viral
  meningitis; do not delay antibiotics for investigations.
  <https://www.nice.org.uk/guidance/ng240>
- UK NEQAS — *Revised national guidelines for analysis of cerebrospinal fluid
  for bilirubin in suspected subarachnoid haemorrhage*; always use
  spectrophotometry in preference to visual inspection; sample ≥ 12 h after
  headache onset.
  <https://pubmed.ncbi.nlm.nih.gov/18482910/>
- Cerebrospinal fluid (CSF) interpretation — reference patterns for bacterial,
  viral, and SAH CSF profiles.
  <https://geekymedics.com/cerebrospinal-fluid-csf-interpretation/>

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
bin/test-form lumbar-puncture-test-result
```
