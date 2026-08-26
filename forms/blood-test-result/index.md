# Blood Test Result

A UK NHS–aligned **blood / pathology test result (report)** that a reporting
clinician completes after a blood specimen has been analysed. It is the
**result/report counterpart** to *Blood Test Request* (a referral / test order):
where the request captures which tests should be done, this form records the
quantitative **result values** the laboratory measured and a structured
**interpretation**. It records the specimen and its condition, the clinical
history, the analyte result values across the common panels (full blood count,
urea & electrolytes / renal, liver function, inflammation, glycaemic, endocrine,
haematinics, and coagulation), the overall result status with abnormal- and
critical-value flags, the narrative and impression, and recommended follow-up —
then computes a **four-axis interpretation grade** (result classification,
abnormality severity / structured reporting, report completeness, and follow-up
urgency) plus a set of safety-critical flags including an automatic
**critical-result (panic-value) alert**. The output is a structured pathology
report.

This form is the laboratory-medicine result counterpart to the repository's
other clinician-driven result forms (it mirrors the *CT Scan Test Result* gold
template). It is completed by a pathologist, reporting biomedical or clinical
scientist, or authorizing clinician rather than by the patient, and is aligned
with the Royal College of Pathologists (RCPath) best-practice recommendations on
the communication of critical and unexpected pathology results and with UK
Pathology Harmony consensus reference ranges.

## Scope and intended users

- **Setting:** NHS pathology / clinical-biochemistry / haematology laboratory
  reporting workflow, or a clinician reviewing and authorizing results.
- **Users:** pathologists, reporting biomedical and clinical scientists, and
  authorizing clinicians who interpret and sign blood / pathology reports.
- **Patients:** any patient who has had a blood specimen analysed.

## Result semantics (not a referral)

A **request** form is prospective and asks *which tests should we do, and is it
appropriate?*. A **result** form is retrospective and records *what did the test
measure, and what does it mean?*. Accordingly the source-of-truth table here is
`blood_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets the measured values rather
than vetting a request.

## Result values

The report stores the quantitative analyte values the laboratory measured. Each
is a nullable `NUMERIC` (null when the analyte was not measured), interpreted
against laboratory reference ranges and critical (panic) values.

| Panel | Analytes (columns) |
| --- | --- |
| Full blood count | `haemoglobin_g_l`, `white_cell_count`, `platelets`, `neutrophils` |
| Urea & electrolytes / renal | `sodium_mmol_l`, `potassium_mmol_l`, `urea_mmol_l`, `creatinine_umol_l`, `egfr` |
| Liver function | `alt_u_l`, `alkaline_phosphatase`, `bilirubin_umol_l`, `albumin_g_l` |
| Inflammation | `c_reactive_protein` |
| Glycaemic | `hba1c_mmol_mol`, `glucose_mmol_l` |
| Endocrine | `tsh` |
| Haematinics | `ferritin` |
| Coagulation | `inr` |

Reference ranges and critical-value thresholds are documented in
[`doc/clinical-references.md`](doc/clinical-references.md). The authoritative
range is always the one issued by the reporting laboratory.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical value.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion against reference ranges and critical values | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | Magnitude of deviation from reference range + structured bands (e.g. eGFR CKD stage, glycaemic band) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, results, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical (panic) value** (e.g. potassium ≥6.5 mmol/L, sodium <120 mmol/L,
platelets <20 ×10⁹/L, neutrophils <0.5 ×10⁹/L) **auto-escalates** Axis A to
*critical* and Axis D to *critical-alert*, and raises the `critical-result-alert`
flag regardless of the other axes. An **abnormal-but-not-critical** result maps
to Axis A *abnormal* and Axis D *recommended*. Choose the least-urgent band only
when no rule fires.

### Overall summary fields

Captured on the result alongside the analyte values and used to drive the grade:
`overall_result_status` (normal / abnormal / critical), `abnormal_results_present`,
`critical_value_present`, and `critical_value_detail`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Specimen details | specimen type, specimen condition |
| 3 | Clinical history | clinical history |
| 4 | Result values | analyte result values across the panels |
| 5 | Interpretation summary | overall result status, abnormal-results / critical-value flags + detail, findings narrative, comparison with previous |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-specimen`,
`unexpected-finding`, `missing-impression`, `missing-result-value`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** pathology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
blood-test-result/
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

- RCPath — Best practice recommendations: The communication of critical and
  unexpected pathology results (G158). Defines critical (panic) values and the
  requirement to communicate and document them.
  <https://www.rcpath.org/static/bb86b370-1545-4c5a-b5826a2c431934f5/G158-BPR-The-communication-of-critical-and-unexpected-pathology-results.pdf>
- Pathology Harmony — UK consensus reference ranges for common biochemistry and
  haematology analytes.
  <https://www.researchgate.net/publication/230756631_The_Approach_to_Pathology_Harmony_in_the_UK>
- Example laboratory clinical decision / alert limits (Royal Berkshire NHS).
  <http://pathology.royalberkshire.nhs.uk/bdecisionlimits.php>
- Reference ranges (laboratory values), Geeky Medics.
  <https://geekymedics.com/reference-ranges/>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management.
- UK Medical Devices Regulations 2002.
- ISO 15189 (medical laboratories — quality and competence).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form blood-test-result
```
