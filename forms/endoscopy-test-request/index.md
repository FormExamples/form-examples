# Endoscopy Test Request

A UK NHS–aligned **GI endoscopy procedure request (referral)** that a clinician
completes to request a gastrointestinal endoscopy for a patient. It records the
requested procedure, the clinical indication and specific question, ALARM
red-flag symptoms, FIT and haematinic results, anticoagulant / antiplatelet
medication, comorbidities, infection-control flags, the bowel-preparation and
sedation plan, and the requested urgency — then computes a **four-axis grading**
(appropriateness, cancer-pathway urgency, request completeness, and
pre-procedure risk) plus a set of safety-critical flags. The output is a vetting
report that supports the endoscopy unit's triage and booking decision.

This form is the GI-endoscopy counterpart to the repository's other
clinician-driven request forms. It is completed by a gastroenterologist,
endoscopist, GP, surgeon, or nurse-endoscopist rather than by the patient, and
is aligned with NICE NG12 suspected-cancer referral, NICE DG56 FIT triage, BSG /
ESGE anticoagulation guidance, the Glasgow-Blatchford and Rockall bleeding
scores, ASA physical-status grading, and the ACR / ASGE Appropriate Use Criteria.

## Scope and intended users

- **Setting:** NHS endoscopy unit, gastroenterology clinic, surgical outpatient
  clinic, general practice (direct-access endoscopy), or endoscopy-department
  triage / vetting desk.
- **Users:** gastroenterologists, endoscopists, GPs, surgeons,
  nurse-endoscopists, and vetting clinicians who triage incoming requests.
- **Patients:** adults requiring a diagnostic, therapeutic, or surveillance GI
  endoscopy.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, urgent, or high-risk.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACR Appropriateness Criteria / ASGE Appropriate Use Criteria / EPAGE (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Cancer-pathway urgency** | NICE NG12 / DG56 suspected-cancer rules | routine / urgent / two-week-wait / emergency (+ target timeframe, 2WW eligibility + rationale) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Pre-procedure risk** | Glasgow-Blatchford (0–23) + Rockall (0–11) + BSG/ESGE anticoagulant stratification | low / moderate / high (+ anticoagulant action) |

An acute red-flag (active GI bleeding, haemodynamic instability) **auto-escalates**
the triage tier to emergency regardless of the other axes. NICE NG12 / DG56
two-week-wait criteria escalate the tier to two-week-wait.

### Procedure / indication windows

| Procedure | Typical indications | Pathway notes |
| --- | --- | --- |
| OGD / gastroscopy | dyspepsia, GORD, dysphagia, upper-GI bleeding, iron-deficiency anaemia, Barrett's surveillance, H. pylori | Dysphagia or age ≥55 + weight loss → 2WW (NICE NG12) |
| Colonoscopy | rectal bleeding, change in bowel habit, positive FIT, IBD / polyp surveillance, anaemia | FIT ≥10 µg/g → suspected-cancer pathway (NICE DG56) |
| Flexible sigmoidoscopy | left-sided symptoms, rectal bleeding, distal surveillance | Limited to recto-sigmoid |
| ERCP | biliary obstruction, stones, strictures | Therapeutic; high bleeding risk if sphincterotomy |
| EUS | staging, pancreatic / subepithelial lesions | Often high-risk if sampling |
| Capsule | obscure GI bleeding, small-bowel survey | Patency capsule if stricture risk |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI, interpreter needs |
| 3 | Requested procedure | procedure, primary indication, specific clinical question, relevant history |
| 4 | Red flags & triage labs | ALARM flags (dysphagia, weight loss, anaemia, GI bleeding, abdominal mass, age ≥55), FIT, haemoglobin, ferritin |
| 5 | Medication | anticoagulant + agent, antiplatelet + agent, diabetes medication, allergies + latex |
| 6 | Comorbidities & fitness | NYHA class, pacemaker/ICD, CKD + eGFR, sleep apnoea, neutropenia, ASA grade |
| 7 | Infection & preparation | vCJD / CPE / MRSA / BBV flags, fit for bowel prep + agent, sedation, escort |
| 8 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
are acute-gi-bleed, suspected-cancer-2ww, high-bleeding-risk-anticoag, asa-iv,
unfit-for-prep, infection-precaution, missing-indication,
missing-clinical-question, missing-fit, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / endoscopy
  reporting system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
endoscopy-test-request/
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

- NICE NG12 *Suspected cancer: recognition and referral* (upper-GI: dysphagia,
  or age ≥55 with weight loss; two-week-wait endoscopy).
  <https://www.nice.org.uk/guidance/ng12>
- NICE DG56 *Quantitative faecal immunochemical testing (FIT) to guide
  colorectal cancer pathway referral in primary care* (FIT ≥10 µg Hb/g).
  <https://www.nice.org.uk/guidance/dg56>
- NICE QS96 *Dyspepsia and gastro-oesophageal reflux disease in adults* —
  urgent direct-access endoscopy.
  <https://www.nice.org.uk/guidance/qs96>
- BSG / ESGE *Endoscopy in patients on antiplatelet or anticoagulant therapy,
  including direct oral anticoagulants* (2021 update; low- vs high-risk
  procedures, DOAC / clopidogrel management).
  <https://www.bsg.org.uk/clinical-resource/updatet-endoscopy-in-patients>
- Glasgow-Blatchford bleeding score (0–23) and pre-endoscopy Rockall score
  (0–11) for upper-GI-bleed risk stratification.
- ASA physical-status classification (I–V).
- ACR Appropriateness Criteria / ASGE Appropriate Use Criteria (1–9 rating).
  <https://acsearch.acr.org/list>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / procedure selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form endoscopy-test-request
```
