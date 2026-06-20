# Blood Cross-Match Test Result

A UK NHS–aligned **blood cross-match / transfusion compatibility result
(report)** that a reporting clinician completes after pre-transfusion testing has
been performed in the transfusion laboratory. It is the **result/report
counterpart** to *Blood Cross-Match Test Request* (a referral): where the request
captures why testing should be done and whether it is safe to proceed, this form
records what the testing **found** and a structured **interpretation**. It
records the ABO/RhD group, the antibody screen and any antibodies identified, the
crossmatch / compatibility outcome and component availability, the identity-safety
checks (two-sample group-check rule, historical-group concordance), special
component requirements, the overall result status, narrative findings, the
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured transfusion-compatibility report.

This form is the transfusion-compatibility result counterpart to the
repository's other clinician-driven result forms. It is completed by a biomedical
scientist, transfusion practitioner, or consultant haematologist rather than by
the patient, and is aligned with British Society for Haematology (BSH)
pre-transfusion compatibility guidance, NICE NG24 *Blood transfusion*, and the
Serious Hazards of Transfusion (SHOT) recommendations on positive patient
identification, the two-sample group-check rule, and the prevention of ABO-
incompatible transfusion and Wrong Blood in Tube (WBIT).

## Scope and intended users

- **Setting:** NHS hospital transfusion laboratory or transfusion-practitioner
  reporting workflow.
- **Users:** biomedical scientists, transfusion practitioners, and consultant
  haematologists who interpret and sign compatibility reports.
- **Patients:** any patient who has undergone group-and-save, antibody screen,
  crossmatch, or emergency-issue testing.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`blood_cross_match_test_result`, the reporting clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical, incompatible result.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall compatibility conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | BSH antibody-significance + compatibility-status categorisation | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (clinical history, grouping, antibody screen, crossmatch, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical result** — an **incompatible crossmatch**, **clinically-significant
antibodies**, an **ABO discrepancy** (historical-group non-concordance), or an
**unmet two-sample group-check rule** — **auto-escalates** Axis D to
*critical-alert*, classifies the result *abnormal* or *critical*, and raises the
`critical-result-alert` and `discrepancy-with-request` flags regardless of the
other axes. Choose the least-urgent band only when no rule fires.

### Structured findings

Key result fields captured alongside the narrative, used to drive classification,
severity, and flags:

`abo_group`, `rhd_group`, `antibody_screen_result`, `antibodies_identified`,
`crossmatch_result`, `component`, `units_crossmatched`, `units_available`,
`two_sample_rule_met`, `special_requirements`, `historical_group_concordant`,
`overall_result_status`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates, request type |
| 2 | Clinical context | clinical history |
| 3 | Grouping | ABO group, RhD group, historical-group concordance |
| 4 | Antibody screen | antibody screen result, antibodies identified |
| 5 | Crossmatch & components | crossmatch result, component, units crossmatched, units available, special requirements |
| 6 | Identity & overall result | two-sample rule met, overall result status, findings narrative, impression |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, recommended follow-up, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** transfusion-compatibility report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
blood-cross-match-test-result/
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

- British Society for Haematology (BSH) *Guidelines for pre-transfusion
  compatibility procedures in blood transfusion laboratories* (Milkins et al.) —
  ABO/D grouping, antibody screening and identification, crossmatch, electronic
  issue, and sample validity.
  <https://b-s-h.org.uk/guidelines/guidelines/guidelines-for-pre-transfusion-compatibility-procedures-in-blood-transfusion-laboratories>
- BSH *Administration of blood components* (Robinson et al., 2018) — positive
  patient identification and the two-sample (group-check) requirement.
  <https://onlinelibrary.wiley.com/doi/full/10.1111/tme.12481>
- Serious Hazards of Transfusion (SHOT) annual reports — ABO-incompatible red
  cell transfusion and Wrong Blood in Tube (WBIT). <https://www.shotuk.org/>
- NICE NG24 *Blood transfusion* (restrictive thresholds; component-specific
  guidance carried from the request). <https://www.nice.org.uk/guidance/ng24>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  transfusion / issue management.
- UK Medical Devices Regulations 2002.
- Blood Safety and Quality Regulations 2005 (UK BSQR).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form blood-cross-match-test-result
```
