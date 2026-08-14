# Colonoscopy Test Result

A UK NHS–aligned **colonoscopy procedure result (report)** that a reporting
clinician (endoscopist) completes after a lower-GI endoscopy has been performed.
It is the **result/report counterpart** to *Colonoscopy Test Request* (a
referral): where the request captures why a procedure should be done, this form
records what the procedure **found** and a structured **interpretation**. It
records the performed procedure and extent reached, bowel-preparation quality and
sedation, the clinical history, the narrative and structured findings, the polyp
count and largest-polyp size, biopsy / polypectomy and any complication, the
impression and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured endoscopy report.

This form is the lower-GI-endoscopy result counterpart to the repository's other
clinician-driven result forms, modelled on the `ct-scan-test-result` gold
template. It is completed by a gastroenterologist, colorectal surgeon,
nurse-endoscopist, or other reporting clinician rather than by the patient, and
is aligned with the BSG / JAG colonoscopy key performance indicators and quality
standards, the BSG / ACPGBI / PHE polyp-surveillance guidelines, and BSG
critical-result and actionable-reporting expectations.

## Scope and intended users

- **Setting:** NHS endoscopy unit reporting workflow, gastroenterology service,
  colorectal surgical service, or endoscopy-department reporting room.
- **Users:** gastroenterologists, colorectal surgeons, nurse-endoscopists, and
  other reporting clinicians who perform, interpret, and sign colonoscopy
  reports.
- **Patients:** any patient who has undergone a colonoscopy, flexible
  sigmoidoscopy, or CT colonography.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this procedure, and is
it safe?*. A **result** form is retrospective and records *what did the procedure
find, and what does it mean?*. Accordingly the source-of-truth table here is
`colonoscopy_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | BSG actionable reporting + structured systems (e.g. a BSG / ACPGBI / PHE polyp-surveillance risk band) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, procedure / extent, findings, impression, follow-up) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (e.g. an obstructing or suspicious mass, or a perforation)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes — typically triggering
an urgent MDT / colorectal-surgical referral. Choose the least-urgent band only
when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`polyps_found`, `mass_lesion`, `diverticulosis`, `inflammation_ibd`,
`angiodysplasia`, `bleeding_source_identified`, `normal_examination`.

Key measurements: `polyp_count` and `largest_polyp_mm` (surveillance interval
determination); `extent_reached` (caecal / terminal-ileal intubation is the
completeness key performance indicator); `bowel_preparation_quality`
(examination adequacy). Tissue handling: `biopsy_taken`,
`polypectomy_performed`. Procedural `complication` (none / bleeding /
perforation / other).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician (endoscopist), originating request reference, report status, performed & reported dates |
| 2 | Procedure details | procedure, extent reached, bowel-preparation quality, sedation used |
| 3 | Clinical history | clinical history |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Polyps & tissue | polyp count, largest polyp (mm), biopsy taken, polypectomy performed, complication |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** endoscopy report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / endoscopy reporting system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
colonoscopy-test-result/
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

- BSG / ACPGBI / JAG — UK key performance indicators and quality assurance
  standards for colonoscopy (caecal intubation rate target ≥90 %, aspirational
  95 %; polyp detection rate; rectal retroversion; patient comfort). Underpins
  the completeness axis (`extent_reached`) and adequacy reporting.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC5136732/>
- BSG / ACPGBI / PHE — Post-polypectomy and post-colorectal-cancer-resection
  surveillance guidelines (2020). Risk stratification and surveillance intervals
  drive `polyp_count`, `largest_polyp_mm`, `reporting_category`, and
  `recommended_follow_up`.
  <https://www.bsg.org.uk/clinical-resource/list-of-recommendations/>
- BSG Endoscopy Quality Improvement Programme (EQIP) — endoscopy KPIs and QA
  standards.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6540284/>

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
bin/test-form colonoscopy-test-result
```
