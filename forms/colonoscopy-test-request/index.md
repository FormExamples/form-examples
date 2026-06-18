# Colonoscopy Test Request

A UK NHS–aligned **lower-GI endoscopy procedure request (referral)** that a
clinician completes to request a colonoscopy (or flexible sigmoidoscopy / CT
colonography) for a patient. It records the requested procedure, the clinical
indication and specific question, lower-GI red-flag symptoms, the FIT and
haemoglobin results, anticoagulant / antiplatelet medication, bowel-preparation
fitness and renal function, ASA physical status, and the requested urgency —
then computes a **four-axis grading** (appropriateness, cancer-pathway urgency,
request completeness, and pre-procedure risk) plus a set of safety-critical
flags. The output is a vetting report that supports the endoscopy unit's triage
and booking decision.

This form is the lower-GI-endoscopy counterpart to the repository's other
clinician-driven request forms. It is completed by a gastroenterologist,
colorectal surgeon, GP, or nurse-endoscopist rather than by the patient, and is
aligned with NICE NG12 suspected-cancer referral, NICE DG56 FIT triage, BSG /
ESGE bowel-preparation and periprocedural anticoagulation guidance, ASA
physical-status grading, and the ASGE / EPAGE Appropriate Use Criteria.

## Scope and intended users

- **Setting:** NHS endoscopy unit, gastroenterology clinic, colorectal surgical
  outpatient clinic, general practice (direct-access endoscopy), or
  endoscopy-department triage / vetting desk.
- **Users:** gastroenterologists, colorectal surgeons, GPs, nurse-endoscopists,
  and vetting clinicians who triage incoming requests.
- **Patients:** adults requiring a diagnostic, surveillance, or screening
  lower-GI endoscopy.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, urgent, or high-risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ASGE Appropriate Use Criteria / EPAGE / NICE (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Cancer-pathway urgency** | NICE NG12 / DG56 suspected-cancer rules | routine / urgent / two-week-wait / emergency (+ target timeframe, 2WW eligibility + rationale) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Pre-procedure risk** | BSG / ESGE periprocedural anticoagulant stratification + bowel-prep fitness + ASA grade | low / moderate / high (+ anticoagulant action) |

A positive FIT (≥10 µg Hb/g, NICE DG56) or a NICE NG12 lower-GI red-flag
combination **escalates** the triage tier to two-week-wait. An acute presentation
(emergency setting with active bleeding) **auto-escalates** to emergency
regardless of the other axes.

### Procedure / indication notes

| Procedure | Typical indications | Pathway notes |
| --- | --- | --- |
| Colonoscopy | rectal bleeding, change in bowel habit, iron-deficiency anaemia, positive FIT, IBD diagnosis / surveillance, polyp surveillance, CRC screening | Full lower-GI survey; FIT ≥10 µg/g → suspected-cancer pathway (NICE DG56) |
| Flexible sigmoidoscopy | left-sided / distal symptoms, rectal bleeding, distal surveillance | Limited to recto-sigmoid |
| CT colonography | frail / unfit-for-colonoscopy patients, incomplete colonoscopy, abnormal imaging | Radiological alternative; still needs bowel prep |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI, setting, site |
| 3 | Requested procedure | procedure, primary indication, specific clinical question, relevant history |
| 4 | Red flags & triage labs | weight loss, anaemia, abdominal mass, rectal bleeding, FIT result, haemoglobin |
| 5 | Medication | anticoagulant + agent, antiplatelet + agent, diabetes medication |
| 6 | Bowel prep & fitness | fit for bowel prep + agent, CKD + eGFR, ASA grade |
| 7 | Triage & submit | requested urgency, requested-by date, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
are suspected-cancer-2ww, high-bleeding-risk-anticoag, unfit-for-prep, asa-iv,
missing-fit, missing-indication, missing-clinical-question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / endoscopy
  reporting system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
colonoscopy-test-request/
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

- NICE NG12 *Suspected cancer: recognition and referral* (lower-GI: 2WW
  colorectal referral; abdominal mass, change in bowel habit, iron-deficiency
  anaemia, rectal bleeding by age).
  <https://www.nice.org.uk/guidance/ng12>
- NICE DG56 *Quantitative faecal immunochemical testing (FIT) to guide
  colorectal cancer pathway referral in primary care* — refer on the suspected
  cancer pathway if FIT ≥10 µg Hb/g.
  <https://www.nice.org.uk/guidance/dg56>
- BSG / ESGE *Endoscopy in patients on antiplatelet or anticoagulant therapy,
  including direct oral anticoagulants* (low- vs high-risk procedures; DOAC /
  warfarin / clopidogrel management).
  <https://www.bsg.org.uk/clinical-resource/updated-guidance-endoscopy-in-patients-on-antiplatelet-or-anticoagulant-therapy/>
- BSG / ESGE bowel-preparation guidance (split-dose regimens; caution with
  reduced eGFR and electrolyte disturbance).
  <https://www.esge.com/>
- ASA physical-status classification (I–V).
- ASGE Appropriate Use Criteria / EPAGE colonoscopy appropriateness (1–9 rating).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / procedure selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form colonoscopy-test-request
```
