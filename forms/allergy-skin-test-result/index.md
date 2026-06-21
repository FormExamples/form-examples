# Allergy Skin Test Result

A UK NHS–aligned **allergy skin test result (report)** that a reporting clinician
completes after an allergy test has been performed. It is the **result/report
counterpart** to *Allergy Skin Test Request* (a referral): where the request
captures why testing should be done and whether it is safe, this form records
what the test **found** and a structured **interpretation**. It records the
performed test type, the clinical history, the pre-analytic validity controls
(antihistamine washout and positive histamine control), the allergens tested and
their measured weal sizes or specific-IgE (sIgE) results, the sensitised
allergens and a structured reaction summary, the clinical interpretation and
impression, and recommended follow-up — then computes a **four-axis
interpretation grade** (result classification, abnormality severity / structured
reporting, report completeness, and follow-up urgency) plus a set of
safety-critical flags including an automatic **critical-result alert**. The
output is a structured allergy report.

This form is the allergy-diagnostics result counterpart to the repository's other
clinician-driven result forms, and mirrors the `ct-scan-test-result` gold
template. It is completed by an allergist-immunologist, dermatologist, or nurse
rather than by the patient, and is aligned with BSACI and EAACI skin-test and
specific-IgE interpretation guidance — including the ≥3 mm positive-weal
threshold, the requirement for a valid positive histamine control, and the
essential distinction between **sensitisation** and **clinically relevant
allergy**.

## Scope and intended users

- **Setting:** NHS allergy clinic, immunology service, dermatology clinic, or
  hospital outpatient testing room.
- **Users:** allergist-immunologists, dermatologists, and nurses who perform,
  interpret, and sign allergy test reports.
- **Patients:** any patient who has undergone allergy skin testing or
  specific-IgE testing.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`allergy_skin_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical reaction.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | EAACI / BSACI reaction interpretation + structured sensitisation pattern | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, validity controls, allergens / weal sizes, interpretation, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

**Clinically relevant sensitisation** classifies the result as *abnormal*. A
**systemic / anaphylactic reaction during the test** classifies it as *critical*,
**auto-escalates** Axis D to *critical-alert*, and raises the
`critical-result-alert` flag regardless of the other axes. An **invalid test**
(antihistamines not withheld, absent positive control, dermographism) classifies
the result as *inconclusive*. Choose the least-urgent band only when no rule
fires.

### Sensitisation versus clinical allergy

Skin-prick and specific-IgE tests have a good negative predictive value but a
positive predictive value that can be as low as ~50 %. A positive result
demonstrates **sensitisation**, not necessarily clinical allergy, and must be
interpreted against a convincing clinical history. Only clinically relevant
sensitisation is graded *abnormal*.

### Structured reaction summary

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`positive_reactions`, `sensitisation_confirmed`, `anaphylaxis_during_test`,
`all_negative`, `test_invalid`.

Validity controls: `antihistamines_withheld` (washout) and
`positive_control_valid` (histamine control). Measured reactions: `wheal_sizes`
(per allergen, mm) and `specific_ige_results` (per allergen, kUA/L).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, test type, report status, performed & reported dates |
| 2 | Clinical history | clinical history / question |
| 3 | Validity controls | antihistamines withheld, positive control valid |
| 4 | Allergens & reactions | allergens tested, weal sizes, specific-IgE results, sensitised allergens |
| 5 | Reaction summary | positive reactions, sensitisation confirmed, anaphylaxis during test, all negative, test invalid |
| 6 | Interpretation & impression | interpretation, impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `anaphylaxis-during-test`,
`clinically-relevant-sensitisation`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `invalid-test`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** allergy report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
allergy-skin-test-result/
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

- The skin prick test — European standards (EAACI). Positive weal ≥3 mm over
  the negative control, read at 15–20 minutes; validity requires a positive
  histamine control. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3565910/>
- Measurement and interpretation of skin prick test results, *Clinical and
  Translational Allergy*. <https://pmc.ncbi.nlm.nih.gov/articles/PMC4763448/>
- Skin Prick Tests and specific IgE tests, BSACI — sensitisation versus
  clinically relevant allergy; positive predictive value limitations.
  <https://www.bsaci.org/resources/allergy-management/food-allergy/investigations/skin-prick-tests-and-specific-ige-tests/>
- BSACI Standard Operating Procedure for skin-prick testing — antihistamine
  washout before testing.
  <https://www.bsaci.org/wp-content/uploads/2019/12/paedSPTnew.pdf>
- EAACI Guideline: Anaphylaxis (2021 update) — reactions during testing,
  resuscitation readiness.
  <https://onlinelibrary.wiley.com/doi/10.1111/all.15032>

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
bin/test-form allergy-skin-test-result
```
