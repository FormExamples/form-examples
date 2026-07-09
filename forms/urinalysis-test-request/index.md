# Urinalysis Test Request

A UK NHS–aligned **urine pathology test request (order)** that a clinician
completes to order one or more urine investigations for a patient. It records
the requested test panel (dipstick, MC&S, ACR, PCR, pregnancy test, drug screen,
cytology, 24-hour collection), the clinical indication and details, symptoms and
red flags, the specimen type and collection timing, and the requested urgency —
then computes a **four-axis grading** (appropriateness, preanalytical specimen
suitability, request completeness, and triage priority) plus a set of
safety-critical flags. The output is a vetting report that supports the
pathology / laboratory triage and acceptance decision.

This form is the urine-pathology counterpart to the repository's other
clinician-driven test-request forms (notably the blood test request, which it
mirrors by ordering multiple tests as a selectable panel). It is completed by a
GP, hospital doctor, nurse, or urologist rather than by the patient, and is
aligned with NICE NG109 (lower UTI), NICE NG12 (suspected cancer / haematuria),
and UK Standards for Microbiology Investigations (UK SMI) B41 urine
investigation guidance.

## Scope and intended users

- **Setting:** GP surgery, NHS outpatient clinic, inpatient ward, community
  service, emergency department, or pathology / laboratory triage / vetting desk.
- **Users:** GPs, hospital doctors, nurses, urologists, and laboratory staff who
  vet incoming requests.
- **Patients:** any patient requiring a urine pathology investigation.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still
have an unsuitable specimen, be incomplete, or be urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | Indication-to-test match + guideline appropriateness (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Preanalytical** | Specimen suitability — type / collected / timing / contamination risk (UK SMI B41) | ok / caution / reject-risk (+ specimen advisory note) |
| **C. Request completeness** | Mandatory-field checklist, clinical details + indication weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Red-flag escalation rules | routine / urgent / stat (+ target timeframe) |

> **Note on the 1–9 appropriateness scale.** There is no single published 1–9
> appropriateness score for urinalysis. This engine anchors the 1–9 on
> **indication-to-test match** and **guideline appropriateness** (NICE NG109,
> NICE NG12, UK SMI B41) and labels it as such, by analogy to the ACR
> Appropriateness Criteria ordinal scale used elsewhere in this repository.

A red flag (visible haematuria, or fever + loin pain suggesting pyelonephritis /
urosepsis) **auto-escalates** the triage tier regardless of the other axes.

## Test panel and indications

| Requested test | Typical indication | Notes |
| --- | --- | --- |
| Dipstick | Suspected uncomplicated UTI, screening | Reagent strip; leucocytes / nitrites / blood / protein / glucose |
| Microscopy, culture & sensitivity (MC&S) | Complicated / recurrent UTI, pregnancy, men, treatment failure | NICE NG109: MSU to culture for pregnant women and men |
| Albumin-creatinine ratio (ACR) | Diabetes / CKD monitoring, albuminuria | Early-morning sample preferred |
| Protein-creatinine ratio (PCR) | Proteinuria quantification | |
| Pregnancy test (hCG) | Pregnancy screen, pre-procedure | |
| Drug screen | Drug monitoring / toxicology | |
| Cytology | Suspected urothelial malignancy | Adjunct, not a substitute for cystoscopy |
| 24-hour collection | Quantitative protein / creatinine clearance / metanephrines | Preanalytical handling critical |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested tests | the eight-test panel (dipstick … 24-hour collection); at least one required |
| 4 | Clinical context | primary indication, clinical details, pregnant / catheterised / current antibiotics |
| 5 | Symptoms & red flags | dysuria, frequency, visible haematuria, loin pain, fever |
| 6 | Specimen | specimen type, collected (yes/no), collection date-time |
| 7 | Triage & submit | requested urgency, setting, site, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- **visible-haematuria-2ww** — visible haematuria; consider NICE NG12 suspected
  cancer (2-week-wait) referral pathway (age ≥45 unexplained visible haematuria).
- **suspected-pyelonephritis** — fever with loin pain; possible upper-tract
  infection / urosepsis requiring expedited assessment.
- **specimen-not-collected** — specimen not yet collected; request cannot proceed.
- **missing-clinical-details** — clinical details omitted (highest-value field).
- **missing-indication** — no primary indication selected.
- **no-test-selected** — no test selected on the panel; nothing to order.
- **other** — any other safety-relevant condition.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
urinalysis-test-request/
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

- NICE NG109 *Urinary tract infection (lower): antimicrobial prescribing* —
  obtain a midstream urine sample from pregnant women and men and send for
  culture and sensitivity; dipstick vs culture by age and risk.
  <https://www.nice.org.uk/guidance/ng109/chapter/recommendations>
- NICE NG12 *Suspected cancer: recognition and referral* — refer people aged 45
  and over with unexplained visible haematuria (2-week-wait bladder-cancer
  pathway). <https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer>
- UK Standards for Microbiology Investigations (UK SMI) B41 *Investigation of
  urine* (UKHSA) — MSU collection, transport within 4 hours, refrigeration or
  boric acid up to 48 hours, contamination.
  <https://www.gov.uk/government/collections/standards-for-microbiology-investigations-smi>
- NICE NG203 *Chronic kidney disease* — albumin-creatinine ratio (ACR) for
  albuminuria and CKD monitoring. <https://www.nice.org.uk/guidance/ng203>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test acceptance.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form urinalysis-test-request
```
