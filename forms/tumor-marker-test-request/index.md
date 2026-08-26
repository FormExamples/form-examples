# Tumor Marker Test Request

A UK NHS–aligned **serum tumour-marker blood-test request (referral)** that a
clinician completes to request one or more serum tumour markers for a patient.
It records the requested markers, the clinical indication, relevant history, any
known cancer site and prior marker value, and the requested urgency — then
computes a **four-axis grading** (appropriateness, interpretation safety, request
completeness, and urgency / triage priority) plus a set of safety-critical flags.
The output is a vetting report that supports the laboratory's and requesting
team's decision to accept, query, redirect, or reject the request.

Tumour markers are **poor screening tests** in unselected populations: most have
low specificity and are raised in benign conditions, so this form is built to
discourage non-evidence-based screening and to check that each requested marker
matches its indication.

This form is the laboratory-medicine / oncology counterpart to the repository's
other clinician-driven request forms. It is completed by an oncologist, GP,
hospital doctor, urologist, gynaecologist, or other clinician rather than by the
patient, and is aligned with NICE CG122 / NG12, NICE prostate-cancer (PSA)
guidance, and ACB / RCPath tumour-marker recommendations.

## Scope and intended users

- **Setting:** NHS oncology clinic, general practice, hospital outpatient or
  inpatient ward, urology / gynaecology clinic, or laboratory-medicine vetting
  desk.
- **Users:** oncologists, GPs, hospital doctors, urologists, gynaecologists, and
  laboratory clinical scientists who vet incoming requests.
- **Patients:** adults with suspected or known malignancy requiring serum
  tumour-marker measurement.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognized body or principle. Axes are orthogonal: a highly appropriate request
can still be incomplete or carry interpretation risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Marker-to-indication fit (1–9 ordinal; NICE / ACB / RCPath) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Interpretation safety** | Timing, treatment effects, screening-misuse checks | ok / caution / misuse-risk |
| **C. Request completeness** | Mandatory-field checklist; indication + clinical details weighted highest | 0–100 % complete (+ missing fields) |
| **D. Urgency / triage** | Suspected-cancer escalation rules | routine / urgent / two-week-wait (+ target timeframe) |

> **Note on the 1–9 scale.** There is no single published 1–9 tumour-marker
> appropriateness score. The scale here is anchored on **marker-to-indication
> appropriateness** — for example CA125 for suspected ovarian cancer scores
> high, whereas a broad multi-marker panel ordered for vague non-specific
> symptoms scores low. Treat it as clinical decision support, not a validated
> diagnostic instrument.

### Marker-to-indication reference

| Marker | Established appropriate use |
| --- | --- |
| PSA | Prostate cancer (symptomatic / informed-choice testing; not population screening) |
| CA125 | Suspected ovarian cancer (NICE CG122 / NG12: measure if ovarian-cancer symptoms; US if ≥35 IU/ml) |
| CA19-9 | Pancreatic / hepatobiliary cancer; not for screening |
| CEA | Colorectal cancer monitoring / recurrence surveillance |
| AFP | Hepatocellular carcinoma; germ-cell tumours |
| beta-hCG | Germ-cell / trophoblastic tumours |
| CA15-3 | Breast cancer monitoring |
| LDH | Germ-cell tumour staging; lymphoma prognosis |
| Calcitonin | Medullary thyroid carcinoma |
| Chromogranin A | Neuroendocrine tumours |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested markers | PSA, CA125, CA19-9, CEA, AFP, beta-hCG, CA15-3, LDH, calcitonin, chromogranin A |
| 4 | Clinical context | primary indication, clinical details, known cancer site, on-treatment, previous marker value + date |
| 5 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, inappropriate-screening-use, marker-indication-mismatch,
missing-clinical-details, missing-indication, no-marker-selected, other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
tumor-marker-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
  xml/              # XML + DTD per SQL table (generated)
  fhir/r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-with-html/         # single-page HTML wizard
  front-end-with-svelte/       # SvelteKit single-page wizard
  front-end-with-html/    # vetting dashboard (HTML table)
  front-end-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NICE CG122 *Ovarian cancer: recognition and initial management* (measure serum
  CA125 in primary care; ultrasound if ≥35 IU/ml).
  <https://www.nice.org.uk/guidance/cg122>
- NICE NG12 *Suspected cancer: recognition and referral* (CA125 testing;
  two-week-wait referral thresholds).
  <https://www.nice.org.uk/guidance/ng12>
- NICE NG131 *Prostate cancer: diagnosis and management* and the NHS PSA-testing
  / Prostate Cancer Risk Management Programme (informed-choice PSA, not
  population screening). <https://www.nice.org.uk/guidance/ng131>
- ACB / ACBI *Guidelines for the use of tumour markers* (appropriate marker
  selection; markers are for monitoring / detecting relapse, not screening).
  <https://acbi.ie/wp-content/uploads/2022/12/1644913336-1602832758-Tumour-markers-5th.pdf>
- RCPath *National Minimum Retesting Intervals in Pathology* (avoid over-testing;
  minimum intervals for tumour-marker monitoring).
  <https://www.rcpath.org/>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / request acceptance.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form tumor-marker-test-request
```
