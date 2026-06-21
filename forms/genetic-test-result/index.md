# Genetic Test Result

A UK NHS–aligned **genetic / genomic test result (report)** that a reporting
clinician completes after a genomic test has been performed and analysed. It is
the **result/report counterpart** to *Genetic Test Request* (a referral): where
the request captures why a genomic test should be done and is it appropriate,
this form records what the test **found** and a structured **interpretation**. It
records the performed test and the genes analysed, the clinical history and
inheritance pattern, the detected variants and their **ACMG/AMP (ACGS) five-tier
classification** and zygosity, the structured findings, the interpretation and
impression, the ACMG reporting category, recommended cascade testing and
follow-up — then computes a **four-axis interpretation grade** (result
classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
genomic report.

This form is the clinical-genomics result counterpart to the repository's other
clinician-driven result forms. It is completed by a clinical geneticist, genetic
counsellor, or clinical scientist rather than by the patient, and is aligned with
the ACMG/AMP standards and guidelines for the interpretation of sequence
variants, the ACGS UK best-practice guidelines for variant classification, and
the NHS Genomic Medicine Service / National Genomic Test Directory.

## Scope and intended users

- **Setting:** NHS Genomic Laboratory Hub, clinical genetics service, genomic
  reporting workflow, or mainstreamed reporting.
- **Users:** clinical geneticists, genetic counsellors, and clinical scientists
  who interpret and sign genomic reports.
- **Patients:** any patient (proband or relative) who has undergone a genomic
  test.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
appropriate?*. A **result** form is retrospective and records *what did the test
find, and what does it mean?*. Accordingly the source-of-truth table here is
`genetic_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## ACMG/AMP (ACGS) variant classification

Each clinically relevant variant is classified on the **ACMG/AMP five-tier
scale**: **pathogenic**, **likely pathogenic**, **variant of uncertain
significance (VUS)**, **likely benign**, and **benign** — plus
**no-variant-detected** for a negative result. The scale is the joint consensus
recommendation of the American College of Medical Genetics and Genomics (ACMG)
and the Association for Molecular Pathology (AMP), implemented in the UK with the
ACGS best-practice specialisations (e.g. REVEL thresholds, CanVIG-UK cancer-gene
specifications). The form stores the overall `variant_classification` and a free
`reporting_category` ACMG class label, and drives interpretation, severity, and
flags from it:

- **Pathogenic / likely-pathogenic** actionable variant → result classification
  *abnormal* or *critical*, Axis D follow-up urgency *urgent / critical-alert*,
  with urgent genetics MDT / counselling and cascade-testing flags.
- **VUS** → result classification *inconclusive*, follow-up urgency
  *recommended* (re-contact / reclassification), and a VUS flag.
- **Likely-benign / benign / no-variant-detected** → result classification
  *normal*, severity *none*, follow-up *routine*.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a pathogenic variant.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion driven by variant classification | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | ACMG/AMP (ACGS) variant class mapped to severity | abnormality severity (none / minor / moderate / major) + a `reporting_category` ACMG class label |
| **C. Report completeness** | Mandatory report-section checklist (clinical history, test details, variants, interpretation, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Actionability / cascade escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **pathogenic / likely-pathogenic actionable variant** (or a secondary
actionable finding) **auto-escalates** the result classification toward *abnormal
or critical* and Axis D toward *urgent / critical-alert*, and raises the
`critical-result-alert` / `pathogenic-variant-found` flags regardless of the
other axes. Choose the least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`pathogenic_variant_found`, `vus_found`, `carrier_status_positive`,
`secondary_finding`, `no_clinically_significant_variant`.

Key fields: `variant_classification` (ACMG/AMP five-tier), `zygosity`
(heterozygous / homozygous / hemizygous / not-applicable),
`recommended_cascade_testing`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Test details | test type, genes tested, sample type |
| 3 | Clinical context | clinical history, inheritance pattern |
| 4 | Findings | variants detected, variant classification, zygosity, structured finding booleans |
| 5 | Interpretation | interpretation, impression, reporting category (ACMG class) |
| 6 | Follow-up | recommended cascade testing, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Test types

diagnostic-single-gene, gene-panel, whole-exome, whole-genome,
chromosomal-microarray, karyotype, predictive-presymptomatic, carrier-testing,
pharmacogenomic, prenatal, other.

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `pathogenic-variant-found`, `secondary-finding`,
`variant-uncertain-significance`, `cascade-testing-recommended`,
`discrepancy-with-request`, `abnormal-requiring-action`, `urgent-referral`,
`missing-impression`, `missing-classification`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** genomic report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
genetic-test-result/
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

- Richards S, et al. Standards and guidelines for the interpretation of sequence
  variants: a joint consensus recommendation of the ACMG and the AMP. *Genetics
  in Medicine*, 2015 (the five-tier P / LP / VUS / LB / B scale).
  <https://pubmed.ncbi.nlm.nih.gov/25741868/>
- ACGS — Best Practice Guidelines for Variant Classification in Rare Disease 2024
  (UK specialisation of the ACMG/AMP guidelines).
  <https://www.genomicseducation.hee.nhs.uk/wp-content/uploads/2024/08/ACGS-2024_UK-practice-guidelines-for-variant-classification.pdf>
- CanVIG-UK — Consensus specifications for cancer-susceptibility genes of the
  ACGS best-practice variant-classification guidelines.
  <https://www.cangene-canvaruk.org/canvig-uk-guidance>
- NHS England — The National Genomic Test Directory / Genomic Medicine Service.
  <https://www.england.nhs.uk/genomics/the-national-genomic-test-directory/>

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
bin/test-form genetic-test-result
```
