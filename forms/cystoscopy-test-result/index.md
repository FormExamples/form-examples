# Cystoscopy Test Result

A UK NHS–aligned **cystoscopy (bladder endoscopy) result (report)** that an
operating clinician completes after a cystoscopic examination of the lower
urinary tract has been performed. It is the **result/report counterpart** to
*Cystoscopy Test Request* (a referral): where the request captures why a
cystoscopy should be done, this form records what the procedure **found** and a
structured **interpretation**. It records the performed procedure and
anaesthesia, the clinical history, the narrative and structured endoscopic
findings, tumour / lesion detail, any complication, the impression, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert** when a bladder tumour or
suspicious lesion is seen. The output is a structured cystoscopy report.

This form is the lower-urinary-tract endoscopy result counterpart to the
repository's other clinician-driven result forms. It is completed by a
urologist, nurse cystoscopist, or other operating clinician rather than by the
patient, and is aligned with BAUS / BAUN flexible-cystoscopy guidance and NICE
NG2 *Bladder cancer: diagnosis and management*.

## Scope and intended users

- **Setting:** NHS urology clinic, one-stop haematuria clinic, day-case
  endoscopy / cystoscopy suite, or surveillance-cystoscopy list.
- **Users:** urologists, nurse cystoscopists, and other operating clinicians who
  perform, interpret, and sign cystoscopy reports.
- **Patients:** any patient who has undergone a cystoscopic examination of the
  bladder and urethra.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`cystoscopy_test_result`, the operating clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | BAUS actionable reporting + structured systems (e.g. EAU NMIBC risk group, suspected-tumour category) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, procedure, findings, impression, follow-up) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — a **bladder tumour or suspicious lesion**, or another
unexpected significant abnormality — **auto-escalates** Axis D to *critical-alert*,
drives a `specialist-referral` / `urgent-review` recommendation, and raises the
`critical-result-alert` flag (suggested action: urgent TURBT / MDT referral)
regardless of the other axes. Choose the least-urgent band only when no rule
fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`bladder_tumour`, `inflammation_cystitis`, `bladder_stones`,
`urethral_stricture`, `trabeculation`, `prostatic_enlargement`,
`normal_examination`.

Tumour / lesion detail: `tumour_size_mm` (categorization / surveillance),
`tumour_appearance` (papillary / solid / flat / not-applicable), and
`biopsy_taken`. Procedure safety is captured by `complication`
(none / bleeding / perforation / uti / other).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | operating clinician, originating request reference, report status, performed & reported dates |
| 2 | Procedure details | procedure, anaesthesia |
| 3 | Clinical history | clinical history |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Tumour & complication | tumour size (mm), tumour appearance, biopsy taken, complication |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** cystoscopy report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
cystoscopy-test-result/
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

- NICE NG2 *Bladder cancer: diagnosis and management* — risk-stratified
  cystoscopic surveillance intervals for non-muscle-invasive bladder cancer
  (low / intermediate / high risk).
  <https://www.nice.org.uk/guidance/ng2>
- BAUN / BAUS *Flexible Cystoscopy* guidelines — complete examination of the
  bladder urothelium, identification of bladder landmarks, and a report of the
  procedure and findings with an action plan for follow-up.
  <https://www.baus.org.uk/_userfiles/pages/files/Publications/FlexiGuidelines.pdf>
- NICE NG2 recommendations (full guidance).
  <https://www.nice.org.uk/guidance/ng2/chapter/Recommendations>

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
bin/test-form cystoscopy-test-result
```
