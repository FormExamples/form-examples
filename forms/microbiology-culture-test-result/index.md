# Microbiology Culture Test Result

A UK NHS–aligned **microbiology culture / MC&S result (report)** that a reporting
clinician completes after a clinical specimen has been processed. It is the
**result/report counterpart** to *Microbiology Culture Test Request* (a
referral): where the request captures why a culture should be done and triages
it, this form records what the culture **found** and a structured
**interpretation**. It records the specimen and its condition, the clinical
history, the Gram-stain and culture results, the organism(s) isolated and colony
count, antibiotic sensitivities and key resistance markers (MRSA / ESBL / CPE),
specialized tests (C. difficile toxin, acid-fast bacilli, PCR), the narrative
findings, the impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured microbiology report.

This form is the microbiology-laboratory result counterpart to the repository's
other clinician-driven result forms, and mirrors the `ct-scan-test-result` gold
template. It is completed by a consultant microbiologist, biomedical scientist,
or infection specialist rather than by the patient, and is aligned with the
UKHSA / RCPath **UK Standards for Microbiology Investigations (UK SMIs)** and the
Royal College of Pathologists best-practice recommendation on the **communication
of critical and unexpected pathology results**.

## Scope and intended users

- **Setting:** NHS microbiology laboratory reporting / authorization workflow.
- **Users:** consultant microbiologists, biomedical scientists, and infection
  specialists who interpret, authorize, and sign microbiology reports.
- **Patients:** any patient whose clinical specimen has undergone culture.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`microbiology_culture_test_result`, the reporting clinician is the report
**author/signer** (not a requester), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical result.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Infection significance + resistance markers (MRSA / ESBL / CPE) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, specimen, microscopy/culture, sensitivities, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical organism** (positive blood culture, CSF isolate, carbapenemase-
producing Enterobacterales (CPE), or any record flagged `critical_organism`)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes — mirroring the RCPath
requirement to actively (usually telephonically) communicate critical and
unexpected results to the requesting / infection team. Choose the least-urgent
band only when no rule fires.

### Structured findings

Result fields captured alongside the narrative, used to drive classification,
severity, and flags:

- `culture_result` (no-growth / mixed-growth / significant-growth / positive),
  `organism_isolated`, `second_organism_isolated`, `colony_count`.
- Resistance markers: `resistance_mrsa`, `resistance_esbl`, `resistance_cpe`.
- Specialized tests: `c_difficile_toxin`, `acid_fast_bacilli`, `pcr_result`.
- Alert flag: `critical_organism`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen | specimen type, site detail, specimen condition |
| 3 | Clinical history | clinical history |
| 4 | Microscopy & culture | Gram stain, culture result, organism(s) isolated, colony count |
| 5 | Sensitivities & resistance | antibiotic sensitivities, MRSA / ESBL / CPE, C. difficile toxin, acid-fast bacilli, PCR |
| 6 | Findings & impression | critical organism, findings narrative, impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** microbiology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation + Specimen) exportable for
  integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
microbiology-culture-test-result/
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

- UKHSA / RCPath *UK Standards for Microbiology Investigations (UK SMIs)* —
  specimen processing, microscopy, culture, identification, and antimicrobial
  susceptibility testing; B 37 *Investigation of blood cultures*; S 12 *Sepsis
  and systemic or disseminated infection*.
  <https://www.rcpath.org/profession/publications/standards-for-microbiology-investigations.html>
- RCPath *The communication of critical and unexpected pathology results*
  (best-practice recommendation) — positive blood cultures and CSF results
  warrant immediate (telephonic) communication to the requesting team.
  <https://www.rcpath.org/static/bb86b370-1545-4c5a-b5826a2c431934f5/The-communication-of-critical-and-unexpected-pathology-results.pdf>
- UKHSA — carbapenemase-producing Enterobacterales (CPE) as a high-consequence
  alert organism (detection assays guidance).
  <https://assets.publishing.service.gov.uk/media/637befee8fa8f53f41348974/commercial-assays-for-the-detection-of-acquired-carbapenemases.pdf>

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
bin/test-form microbiology-culture-test-result
```
