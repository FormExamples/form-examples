# Angiography Test Result

A UK NHS–aligned **angiography result (report)** that a reporting clinician
completes after a vascular angiographic examination has been performed. It is the
**result/report counterpart** to *Angiography Test Request* (a referral): where
the request captures why an angiogram should be done and whether it is safe, this
form records what the angiogram **found** and a structured **interpretation**. It
records the performed examination, modality and contrast, the clinical history,
the narrative and structured vascular findings, the maximum stenosis percentage
and whether an intervention was performed, the impression and a reporting
category, and recommended follow-up — then computes a **four-axis interpretation
grade** (result classification, abnormality severity / structured reporting,
report completeness, and follow-up urgency) plus a set of safety-critical flags
including an automatic **critical-result alert**. The output is a structured
vascular-imaging report.

This form is the vascular-imaging result counterpart to the repository's other
clinician-driven result forms. It is completed by an interventional radiologist,
radiologist, cardiologist, vascular surgeon, or other reporting clinician rather
than by the patient, and is aligned with the Royal College of Radiologists (RCR)
*Standards for the interpretation and reporting of imaging investigations*, the
ACR Appropriateness Criteria, established carotid- and arterial-stenosis grading
conventions (NASCET / ECST), and the UK Ionising Radiation (Medical Exposure)
Regulations — IR(ME)R 2017.

## Scope and intended users

- **Setting:** NHS radiology department reporting room, interventional-radiology
  suite, cardiology catheter lab, vascular surgery service, or teleradiology
  reporting workflow.
- **Users:** interventional radiologists, radiologists, cardiologists, vascular
  surgeons, and other reporting clinicians who interpret and sign angiography
  reports.
- **Patients:** any patient who has undergone an angiographic examination
  (coronary, cerebral, carotid, aortic, renal, peripheral, pulmonary, or
  mesenteric).

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`angiography_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | RCR actionable reporting + structured stenosis grading (e.g. NASCET / ECST stenosis-severity categories) | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, technique, comparison, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** (e.g. active contrast extravasation / active bleeding,
arterial dissection, critical stenosis or occlusion of a vital territory)
**auto-escalates** Axis D to *critical-alert* and raises the
`critical-result-alert` flag regardless of the other axes. Choose the
least-urgent band only when no rule fires.

### Modality, region, and findings

| Angiography type | Typical body regions | Common findings |
| --- | --- | --- |
| CT angiography (CTA) | aorta, peripheral-lower-limb, pulmonary, renal, mesenteric | aneurysm, stenosis, occlusion, active extravasation, thrombus |
| MR angiography (MRA) | carotid, renal, peripheral-lower-limb, aorta | stenosis, occlusion, aneurysm |
| Catheter / DSA | cerebral, peripheral-lower-limb, mesenteric, renal | stenosis, active extravasation, intervention performed |
| Coronary angiography | coronary | significant stenosis, occlusion, intervention performed |
| Peripheral angiography | peripheral-lower-limb | stenosis, occlusion, thrombus |
| Cerebral angiography | cerebral, carotid | aneurysm, stenosis, dissection |

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`significant_stenosis`, `occlusion`, `aneurysm`, `dissection`,
`active_extravasation`, `thrombus`, `normal_vessels`, `incidental_finding`.

Key measurements / facts: `max_stenosis_percent` (stenosis severity grading and
categorisation) and `intervention_performed` (whether an angioplasty, stent, or
embolisation was performed during the study).

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Examination details | angiography type, body region, contrast used, examination adequacy |
| 3 | Clinical history | clinical history, comparison with previous imaging |
| 4 | Findings | findings narrative + structured finding booleans |
| 5 | Measurements | maximum stenosis percentage, intervention performed |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `incidental-finding`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `inadequate-technique`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** vascular-imaging report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
angiography-test-result/
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

- RCR — Standards for the interpretation and reporting of imaging investigations
  (third edition). Emphasises *actionable reporting* and applies to all who
  report imaging.
  <https://www.rcr.ac.uk/our-services/all-our-publications/clinical-radiology-publications/standards-for-interpretation-and-reporting-of-imaging-investigations-third-edition/>
- NASCET / ECST carotid- and arterial-stenosis grading conventions (percentage
  luminal diameter reduction; categories <50 % / 50–69 % / 70–99 % /
  near-occlusion / occluded). NASCET % = (1 − d_narrowest / d_distal) × 100.
  <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7607093/>
- ACR Appropriateness Criteria (cardiovascular and vascular variants).
  <https://acsearch.acr.org/list>
- UK Ionising Radiation (Medical Exposure) Regulations 2017 — IR(ME)R
  (justification and dose audit for ionising-radiation angiography).
  <https://www.legislation.gov.uk/uksi/2017/1322/contents/made>

See [`doc/clinical-references.md`](doc/clinical-references.md) for the full
grounded reference set and how each source maps to the schema.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where the interpretation output drives downstream
  management.
- UK Medical Devices Regulations 2002.
- UK Ionising Radiation (Medical Exposure) Regulations 2017 (IR(ME)R).
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form angiography-test-result
```
