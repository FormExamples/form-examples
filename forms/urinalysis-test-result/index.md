# Urinalysis Test Result

A UK NHS–aligned **urinalysis result (report)** that a reporting clinician
completes after one or more urine investigations have been performed. It is the
**result/report counterpart** to *Urinalysis Test Request* (an order): where the
request captures which urine tests to run and why, this form records what the
investigation **found** and a structured **interpretation**. It records the
specimen and its condition, the clinical history, the dipstick (reagent strip)
results, microscopy, culture and antibiotic sensitivities, then computes a
**four-axis interpretation grade** (result classification, abnormality severity /
structured reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured pathology report.

This form is the urine-pathology result counterpart to the repository's other
clinician-driven result forms, and mirrors the gold-template *CT Scan Test
Result*. It is completed by a biomedical scientist, microbiologist, reporting
clinician, or GP rather than by the patient, and is aligned with the UK Standards
for Microbiology Investigations (UK SMI) B41 *Investigation of urine* (UKHSA),
the Royal College of Pathologists (RCPath) standards for the communication of
critical and unexpected pathology results, and NICE NG109 (lower UTI).

## Scope and intended users

- **Setting:** NHS microbiology / pathology laboratory, near-patient testing
  point, GP surgery, or ward reporting workflow.
- **Users:** biomedical scientists, microbiologists, reporting clinicians, and
  GPs who interpret and sign urinalysis reports.
- **Patients:** any patient who has had a urine investigation performed.

## Result semantics (not a referral)

A **request** form is prospective and asks *which tests should we run, and is the
specimen suitable?*. A **result** form is retrospective and records *what did the
investigation find, and what does it mean?*. Accordingly the source-of-truth
table here is `urinalysis_test_result`, the reporting clinician is the report
**author/signer** (not a requester), and the grade engine interprets findings
rather than vetting an order.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Significance of bacteriuria + structured systems (UK SMI B41 colony-count significance, asymptomatic-bacteriuria categories) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (clinical history, specimen, dipstick, microscopy/culture, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** **auto-escalates** Axis D to *critical-alert* and raises
the `critical-result-alert` flag regardless of the other axes. Examples that map
to *critical* / *abnormal* status plus Axis D escalation and the appropriate
flags:

- **Significant growth in pregnancy** — significant bacteriuria (including
  asymptomatic bacteriuria) in a pregnant patient warrants treatment and
  expedited communication.
- **Critical organism** — an organism requiring prompt action (e.g. a result
  likely to change management within 24 hours per RCPath critical-results
  guidance).
- **Findings suggesting urosepsis or visible haematuria** — escalate and consider
  onward referral.

Choose the least-urgent band only when no rule fires.

### Result fields

Dipstick (reagent strip): `leucocytes`, `nitrites`, `protein`, `blood`,
`glucose`, `ketones`, `bilirubin`, plus `ph` and `specific_gravity` (numeric).
Microscopy: `red_cell_count`, `white_cell_count`, `epithelial_cells`, `casts`,
`organisms_seen`, `crystals`. Culture: `culture_result` (no-growth /
mixed-growth-likely-contaminant / significant-growth), `organism_isolated`,
`colony_count_cfu_ml`, `antibiotic_sensitivities`. Interpretation:
`overall_result_status` (normal / abnormal / critical), `findings_narrative`,
`impression`, `reporting_category`, `recommended_follow_up`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen | specimen type, specimen condition, clinical history |
| 3 | Dipstick | leucocytes, nitrites, protein, blood, glucose, ketones, bilirubin, pH, specific gravity |
| 4 | Microscopy | red/white cell counts, epithelial cells, casts, organisms seen, crystals |
| 5 | Culture & sensitivities | culture result, organism isolated, colony count, antibiotic sensitivities |
| 6 | Interpretation | overall result status, findings narrative, impression, reporting category, recommended follow-up |
| 7 | Sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** pathology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
urinalysis-test-result/
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

- UK Standards for Microbiology Investigations (UK SMI) B41 *Investigation of
  urine* (UKHSA) — significance of bacteriuria and colony counts, contamination
  (mixed growth), and reporting of culture and sensitivities.
  <https://www.gov.uk/government/collections/standards-for-microbiology-investigations-smi>
- RCPath *The communication of critical and unexpected pathology results* —
  defines a critical result as one likely to affect patient management within 24
  hours; drives the `critical_result_communicated` / `reported_to` fields and the
  `critical-result-alert` flag.
  <https://www.rcpath.org/profession/guidelines/the-communication-of-critical-and-unexpected-pathology-results.html>
- NICE NG109 *Urinary tract infection (lower): antimicrobial prescribing* —
  midstream urine culture and sensitivity for pregnant women and men; bacteriuria
  in pregnancy.
  <https://www.nice.org.uk/guidance/ng109/chapter/recommendations>
- NICE NG12 *Suspected cancer: recognition and referral* — visible haematuria
  referral pathway context.
  <https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer>

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
bin/test-form urinalysis-test-result
```
