# Pregnancy Ultrasound Test Request

A UK NHS–aligned **obstetric ultrasound scan request (referral)** that a
clinician completes to request an ultrasound examination for a pregnant patient.
It records the pregnancy dating, obstetric history, the requested examination,
the clinical indication and specific question, symptoms and red flags, and the
requested urgency — then computes a **four-axis grading** (appropriateness,
gestational-age window fit, request completeness, and triage priority) plus a
set of safety-critical flags. The output is a vetting report that supports the
imaging department's triage and booking decision.

This form is the obstetric-imaging counterpart to the repository's other
clinician-driven request forms. It is completed by an obstetrician, midwife, GP,
or fetal-medicine specialist rather than by the patient, and is aligned with
ISUOG practice guidelines, RCOG green-top guidance, NICE NG201 antenatal care,
the NHS Fetal Anomaly Screening Programme (FASP), and the ACR Appropriateness
Criteria.

## Scope and intended users

- **Setting:** NHS antenatal clinic, early-pregnancy assessment unit, community
  midwifery, fetal-medicine unit, or imaging-department triage / vetting desk.
- **Users:** obstetricians, midwives, GPs, fetal-medicine specialists,
  gynaecologists, and sonographers who vet incoming requests.
- **Patients:** pregnant people at any gestation requiring an obstetric
  ultrasound examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Gestational-age window fit** | ISUOG / NICE NG201 / NHS FASP scan windows | appropriate / borderline / outside-window (+ recommended scan type) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / soon / urgent / emergency (+ target timeframe) |

A red-flag (heavy bleeding, severe pain, suspected ectopic, haemodynamic
instability, reduced fetal movements) **auto-escalates** the triage tier
regardless of the other axes.

### Scan-type gestational-age windows

| Scan type | Window | Purpose |
| --- | --- | --- |
| Viability | ~6–10 weeks | Intrauterine location, cardiac activity, plurality |
| Dating | 11+2 – 14+1 (CRL to 13+6) | Establish gestational age, detect multiples |
| Nuchal translucency / combined | 11+0 – 14+0 (CRL 45–84 mm) | Aneuploidy screening |
| Anomaly (anatomy) | 18+0 – 20+6 | Systematic fetal anatomy survey, placental location |
| Growth / wellbeing | ~26 weeks onward (serial) | Biometry, interval growth, liquor, presentation |
| Doppler surveillance | ≥ ~20 weeks | Umbilical / MCA / uterine artery Doppler |
| Cervical length | ~16–24 weeks | Preterm-birth risk |
| Placental location | repeat ~32 / 36 weeks | Confirm / exclude placenta praevia |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI, interpreter needs |
| 3 | Pregnancy dating | LMP + reliability, EDD + derivation method, gestational age (weeks + days) |
| 4 | Obstetric history | gravida, para, plurality, chorionicity, conception method, rhesus status |
| 5 | Requested examination | scan type, primary indication, specific clinical question, previous scan finding + date |
| 6 | Symptoms & red flags | vaginal bleeding, abdominal pain, reduced fetal movements, suspected ectopic, instability |
| 7 | Risk factors | hypertension, diabetes, previous FGR/preterm/caesarean, smoking |
| 8 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
include suspected ectopic, heavy bleeding, severe pain, haemodynamic
instability, reduced fetal movements, suspected placenta praevia, suspected
severe FGR, pre-eclampsia, missing indication, missing clinical question,
gestational-age window mismatch, and incomplete dating.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
pregnancy-ultrasound-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
  spec.md                           # living spec (generated from index.md)
  CHANGELOG.md                      # per-form changelog
  doc/                              # clinical reference documentation
  examples/                         # filled-form JSON fixture + FHIR R5 Bundle
  sql/                   # PostgreSQL migrations (source of truth)
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

- ISUOG Practice Guidelines: first-trimester / 11–14-week scan (2023);
  routine mid-trimester scan (2022); fetal biometry and growth.
  <https://www.isuog.org/>
- RCOG Green-top Guideline No. 31 (SGA / fetal growth restriction); Placenta
  praevia, accreta and vasa praevia. <https://www.rcog.org.uk/>
- NICE NG201 *Antenatal care* (dating 11+2–14+1; anomaly 18+0–20+6).
  <https://www.nice.org.uk/guidance/ng201>
- NHS Fetal Anomaly Screening Programme (FASP).
  <https://www.gov.uk/guidance/fetal-anomaly-screening-programme-overview>
- ACR Appropriateness Criteria (1–9 rating scale; obstetric variants).
  <https://acsearch.acr.org/list>
- AIUM *Standard diagnostic obstetric ultrasound examination*.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / scan-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form pregnancy-ultrasound-test-request
```
