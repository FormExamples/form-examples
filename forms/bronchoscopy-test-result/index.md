# Bronchoscopy Test Result

A UK NHS–aligned **bronchoscopy (airway endoscopy) result (procedure report)**
that an operating clinician completes after a bronchoscopy has been performed. It
is the **result/report counterpart** to *Bronchoscopy Test Request* (a referral):
where the request captures why a bronchoscopy should be done and whether it is
safe, this form records what the procedure **found** and a structured
**interpretation**. It records the performed procedure and sedation, the extent
of the airway examined, the clinical history, the narrative and structured
findings, the samples taken, any procedural complication, the impression, and
recommended follow-up — then computes a **four-axis interpretation grade**
(result classification, abnormality severity / structured reporting, report
completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
bronchoscopy report.

This form is the airway-endoscopy result counterpart to the repository's other
clinician-driven result forms. It is completed by a respiratory physician,
thoracic surgeon, or other operating clinician rather than by the patient, and is
aligned with the British Thoracic Society (BTS) Quality Standards for Flexible
Bronchoscopy in Adults, the BTS guideline for diagnostic flexible bronchoscopy,
the National Optimal Lung Cancer Pathway, and NICE NG122 (lung cancer: diagnosis
and management).

## Scope and intended users

- **Setting:** NHS bronchoscopy suite, respiratory or thoracic-surgery
  department, or teleradiology / reporting workflow for airway endoscopy.
- **Users:** respiratory physicians, thoracic surgeons, and other operating
  clinicians who perform, interpret, and sign bronchoscopy reports.
- **Patients:** any patient who has undergone a bronchoscopy examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this procedure, and is
it safe?*. A **result** form is retrospective and records *what did the procedure
find, and what does it mean?*. Accordingly the source-of-truth table here is
`bronchoscopy_test_result`, the operating clinician is the report
**author/signer** (not a referrer), and the grade engine interprets findings
rather than vetting a referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | BTS actionable reporting + structured endobronchial findings / lung-cancer-pathway category | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, procedure / extent, findings, samples, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (e.g. a suspected endobronchial tumour, massive
haemoptysis, or a procedural pneumothorax) **auto-escalates** Axis D to
*critical-alert*, raises the `critical-result-alert` flag, and triggers an urgent
lung-cancer MDT referral where appropriate — regardless of the other axes. Choose
the least-urgent band only when no rule fires.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`endobronchial_lesion`, `mucosal_abnormality`, `extrinsic_compression`,
`bleeding`, `foreign_body`, `secretions_purulent`, `normal_examination`.

Supporting fields: `lesion_location` (anatomical site of the abnormality),
`samples_taken` (biopsy / BAL / brushings / EBUS-TBNA), and `complication`
(none / bleeding / pneumothorax / hypoxia / other).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | operating clinician, originating request reference, report status, performed & reported dates |
| 2 | Procedure details | procedure, sedation used, extent examined |
| 3 | Clinical history | clinical history |
| 4 | Findings | findings narrative + structured finding booleans + lesion location |
| 5 | Samples & complications | samples taken, complication |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** bronchoscopy report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
bronchoscopy-test-result/
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

- BTS Quality Standards for Flexible Bronchoscopy in Adults (waiting times,
  safety, outcome and diagnostic-sensitivity standards).
  <https://www.brit-thoracic.org.uk/quality-improvement/quality-standards/flexible-bronchoscopy/>
- British Thoracic Society guideline for diagnostic flexible bronchoscopy in
  adults (Du Rand et al., *Thorax* 2013; NICE-accredited).
  <https://pubmed.ncbi.nlm.nih.gov/23860341/>
- British Thoracic Society guideline for advanced diagnostic and therapeutic
  flexible bronchoscopy in adults (2011; EBUS / central-airway obstruction).
  <https://pubmed.ncbi.nlm.nih.gov/21987439/>
- National Optimal Lung Cancer Pathway (NOLCP) — MDT-coordinated diagnostic and
  staging pathway.
  <https://rmpartners.nhs.uk/wp-content/uploads/2024/09/national-optimal-lung-cancer-pathway_v4_01jan2024.pdf>
- NICE NG122 *Lung cancer: diagnosis and management* (multimodality staging,
  MDT coordination).
  <https://www.nice.org.uk/guidance/ng122>

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
bin/test-form bronchoscopy-test-result
```
