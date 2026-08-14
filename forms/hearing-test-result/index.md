# Hearing Test Result

A UK NHS–aligned **hearing test result (report)** that a reporting clinician
completes after an audiological examination has been performed. It is the
**result/report counterpart** to *Hearing Test Request* (a referral): where the
request captures why a hearing test should be done, this form records what the
test **found** and a structured **interpretation**. It records the performed
test and its reliability, the clinical history, the pure-tone averages and the
per-ear interpretation (loss type and severity), tympanometry types, the
narrative and structured findings, the impression, and recommended follow-up —
then computes a **four-axis interpretation grade** (result classification,
abnormality severity / structured reporting, report completeness, and follow-up
urgency) plus a set of safety-critical flags including an automatic
**critical-result alert**. The output is a structured audiology report.

This form is the audiology result counterpart to the repository's other
clinician-driven result forms (CT Scan Test Result being the gold template). It
is completed by an audiologist, ENT surgeon, hearing therapist, or other
reporting clinician rather than by the patient, and is aligned with the British
Society of Audiology (BSA) recommended procedures and audiometric descriptors,
NICE NG98 (hearing loss in adults), NICE Quality Standard QS185, and ENT-UK /
BAO-HNS sudden sensorineural hearing loss guidance.

## Scope and intended users

- **Setting:** NHS audiology clinic, ENT outpatient department, community
  hearing service, or audiology reporting workflow.
- **Users:** audiologists, ENT surgeons, hearing therapists, and other
  reporting clinicians who interpret and sign hearing test reports.
- **Patients:** adults and (for newborn hearing screening) infants who have
  undergone an audiological examination.

## Result semantics (not a referral)

A **request** form is prospective and asks *should we do this test, and is it
safe?*. A **result** form is retrospective and records *what did the test find,
and what does it mean?*. Accordingly the source-of-truth table here is
`hearing_test_result`, the reporting clinician is the report **author/signer**
(not a referrer), and the grade engine interprets findings rather than vetting a
referral.

## Interpretation grading

The engine grades each result on **four independent axes**, each citable to a
recognized body. Axes are orthogonal: a complete, well-structured report can
still describe a critical finding.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Result classification** | Overall reporting conclusion | normal / abnormal / critical / inconclusive |
| **B. Severity & structured reporting** | BSA audiometric descriptors + actionable reporting | abnormality severity (none / minor / moderate / major) + a `reporting_category` label |
| **C. Report completeness** | Mandatory report-section checklist (history, test reliability, measurements, findings, impression) | 0–100 % complete |
| **D. Follow-up urgency** | Acuity / action escalation rules | routine / recommended / urgent / critical-alert (+ target timeframe + recommended action) |

A **critical finding** — **sudden sensorineural hearing loss** (an otological
emergency) or a **marked asymmetry** between ears (red flag for retrocochlear
pathology such as vestibular schwannoma) — **auto-escalates** Axis D to
*critical-alert* and raises the `critical-result-alert` flag regardless of the
other axes. Choose the least-urgent band only when no rule fires.

### Hearing-loss severity bands (BSA descriptors)

Per-ear severity is recorded using the British Society of Audiology audiometric
descriptors, derived from the pure-tone average (PTA, dB HL):

| Descriptor | Pure-tone average (dB HL) |
| --- | --- |
| Normal | ≤ 20 |
| Mild | 21–40 |
| Moderate | 41–70 |
| Moderately-severe | (within the moderate–severe band) |
| Severe | 71–95 |
| Profound | > 95 |

The BSA five-frequency average is taken across the standard frequencies; where
no response is obtained at a frequency, that reading is given a value of
130 dB HL.

### Structured findings

Boolean structured findings captured alongside the narrative, used to drive
classification, severity, and flags:

`hearing_loss_present`, `asymmetric_loss`, `sudden_sensorineural_loss`,
`conductive_component`, `normal_hearing`.

Per-ear interpretation: `hearing_loss_type_{right,left}` (none / conductive /
sensorineural / mixed), `hearing_loss_severity_{right,left}` (BSA descriptors),
`tympanometry_type_{right,left}` (Jerger A / As / Ad / B / C), and pure-tone
averages `pure_tone_average_{right,left}_db`.

## Wizard steps

Completed in order on a single continuous single-page wizard (~7 sections).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Report identification | reporting clinician, originating request reference, report status, performed & reported dates |
| 2 | Test details | test type, test reliability |
| 3 | Clinical history | clinical history |
| 4 | Audiometry & interpretation | pure-tone averages, loss type & severity per ear, tympanometry types |
| 5 | Findings | findings narrative + structured finding booleans |
| 6 | Impression | impression, reporting category, recommended follow-up |
| 7 | Interpretation & sign-off | computed four-axis grade, flags, recommendation, critical-result communication, signature |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
`critical-result-alert`, `sudden-sensorineural-loss`,
`asymmetric-loss-retrocochlear`, `discrepancy-with-request`,
`abnormal-requiring-action`, `urgent-referral`, `unreliable-test`,
`unexpected-finding`, `missing-impression`, `missing-measurement`, and `other`.

## Output

- **HTML report preview** and downloadable **PDF** audiology report.
- **FHIR R5 Bundle** (DiagnosticReport + Observation) exportable for integration
  with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
hearing-test-result/
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

- British Society of Audiology — Recommended Procedure: Pure-tone air-conduction
  and bone-conduction threshold audiometry (audiometric descriptors).
  <https://www.thebsa.org.uk/wp-content/uploads/2024/01/Recommended-Procedure-Pure-Tone-Audiometry-2018.pdf>
- NICE NG98 *Hearing loss in adults: assessment and management* (2018, updated
  2023). <https://www.nice.org.uk/guidance/ng98>
- NICE Quality Standard QS185 *Hearing loss in adults*, quality statement 2
  (sudden onset of hearing loss).
  <https://www.nice.org.uk/guidance/qs185/chapter/quality-statement-2-sudden-onset-of-hearing-loss>
- ENT-UK / BAO-HNS guidance on sudden sensorineural hearing loss (otological
  emergency; MRI of the internal auditory meatus to exclude retrocochlear
  pathology). <https://www.entuk.org/>
- *Sudden sensorineural hearing loss and bedside phone testing: a guide for
  primary care*, British Journal of General Practice 2020.
  <https://bjgp.org/content/70/692/144>
- AAO-HNS *Clinical Practice Guideline: Sudden Hearing Loss (Update)* (2019).
  <https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/10.1177/0194599819859885>

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
bin/test-form hearing-test-result
```
