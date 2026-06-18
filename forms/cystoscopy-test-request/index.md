# Cystoscopy Test Request

A UK NHS–aligned **cystoscopy (bladder endoscopy) request (referral)** that a
clinician completes to request a cystoscopic examination of the lower urinary
tract. It records the requested procedure, the clinical indication and specific
question, relevant history, symptoms and red flags, bleeding-risk factors, and
the requested urgency — then computes a **four-axis grading** (appropriateness,
cancer-pathway urgency, request completeness, and pre-procedure risk) plus a set
of safety-critical flags. The output is a vetting report that supports the
urology department's triage and booking decision.

This form is the lower-urinary-tract endoscopy counterpart to the repository's
other clinician-driven request forms. It is completed by a urologist, GP,
hospital doctor, or nurse cystoscopist rather than by the patient, and is
aligned with NICE NG12 *Suspected cancer: recognition and referral* and BAUS
haematuria guidance.

## Scope and intended users

- **Setting:** NHS urology clinic, one-stop haematuria clinic, primary care
  referral, inpatient ward, or urology triage / vetting desk.
- **Users:** urologists, GPs, hospital doctors, and nurse cystoscopists who
  raise or vet incoming requests.
- **Patients:** adults requiring cystoscopic assessment of the bladder and
  urethra.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, urgent, or high-risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | NICE NG12 / BAUS haematuria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Cancer-pathway urgency** | NICE NG12 suspected-cancer thresholds | routine / urgent / two-week-wait / emergency (+ target timeframe, two-week-wait eligibility) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Pre-procedure risk** | Bleeding-risk + active-infection rules | low / moderate / high (+ anticoagulant / active-UTI action) |

A red flag (visible haematuria meeting the 2WW threshold, suspected bladder
tumour, active UTI, high bleeding risk on anticoagulation) **auto-escalates** or
**defers** the request regardless of the other axes.

## Cancer-pathway thresholds (NICE NG12)

| Pathway | Threshold |
| --- | --- |
| Two-week-wait (visible haematuria) | Aged ≥ 45 with unexplained visible haematuria without UTI, or that persists / recurs after UTI treatment |
| Two-week-wait (non-visible haematuria) | Aged ≥ 60 with non-visible haematuria and either dysuria or a raised white-cell count |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested examination | procedure, primary indication, specific clinical question, relevant history |
| 4 | Symptoms & red flags | haematuria, dysuria, frequency, retention, visible haematuria, current UTI |
| 5 | Bleeding risk | anticoagulant + agent, antiplatelet, previous bladder cancer |
| 6 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:
suspected-cancer-2ww, visible-haematuria, active-uti-defer,
high-bleeding-risk-anticoag, missing-indication, missing-clinical-question,
other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
cystoscopy-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql-migrations/                   # PostgreSQL migrations (source of truth)
  xml-representations/              # XML + DTD per SQL table (generated)
  fhir-r5/                          # FHIR HL7 R5 JSON per SQL entity (generated)
  protobuf/                         # Protocol Buffers schemas (generated)
  openapi/                          # OpenAPI 3.1 specs (generated)
  front-end-form-with-html/         # single-page HTML wizard
  front-end-form-with-svelte/       # SvelteKit single-page wizard
  front-end-dashboard-with-html/    # vetting dashboard (HTML table)
  front-end-dashboard-with-svelte/  # vetting dashboard (SVAR Grid)
  back-end-with-loco/               # Rust axum + Loco JSON API
  back-end-with-loco-setup          # scaffold generator (generated)
```

## Clinical references

- NICE NG12 *Suspected cancer: recognition and referral* (haematuria 2WW
  thresholds: visible haematuria age ≥ 45; non-visible age ≥ 60 with dysuria or
  raised WCC). <https://www.nice.org.uk/guidance/ng12>
- BAUS haematuria guidance — flexible cystoscopy as first-line investigation of
  haematuria; any single episode of visible haematuria warrants urological
  assessment including cystoscopy. <https://www.baus.org.uk/>
- NICE NG12 resource (suspected cancer recognition and referral, PDF).
  <https://www.nice.org.uk/guidance/ng12/resources/suspected-cancer-recognition-and-referral-pdf-1837268071621>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / pathway selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form cystoscopy-test-request
```
