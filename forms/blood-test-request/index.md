# Blood Test Request

A UK NHS–aligned **pathology / phlebotomy blood-test order (request)** that a
clinician completes to order one or more blood-test **panels** for a patient. It
records the requested panels, the clinical indication and details, pre-analytical
and specimen-handling information (fasting, collection, tubes), patient-safety
factors, and the requested urgency — then computes a **four-axis grading**
(appropriateness, pre-analytical / specimen safety, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the laboratory's triage and accept / query / reject decision.

This form is the pathology counterpart to the repository's other clinician-driven
request forms. Unlike a single-procedure request it **orders panels**: the
requested tests are modelled as a set of BOOLEAN columns on the main record. It
is completed by a GP, hospital doctor, nurse, phlebotomist, or consultant, and is
aligned with the RCPath *National Minimum Retesting Intervals in Pathology*
(report G147) and general laboratory-ordering and pre-analytical guidance.

## Scope and intended users

- **Setting:** GP surgery, hospital ward, outpatient clinic, community
  phlebotomy, emergency department, or laboratory request-vetting desk.
- **Users:** GPs, hospital doctors, nurses, phlebotomists, and consultants who
  raise or vet blood-test requests.
- **Patients:** any patient requiring a venous blood sample for laboratory
  analysis.

## Scoring system

The engine grades each request on **four independent axes**. Axes are orthogonal:
a highly appropriate request can still have a pre-analytical problem, be
incomplete, or be urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | RCPath National Minimum Retesting Intervals + indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical / specimen safety** | Fasting met? specimen labelled / collected? right tubes? | ok / caution / reject-risk (+ fasting-violation flag) |
| **C. Request completeness** | Mandatory-field checklist, clinical details + indication weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Urgency + critical-test escalation rules | routine / urgent / stat (+ target timeframe) |

> **Note on the 1–9 scale.** There is no single published 1–9 appropriateness
> score for blood tests. This form **anchors** the 1–9 mapping on RCPath retesting-
> interval appropriateness (was the same test ordered inside its minimum retesting
> interval?) combined with indication match, and says so explicitly. It is decision
> support, not a validated instrument.

### Requested panels

Panels are BOOLEAN columns on the main record; at least one should be selected.

| Panel | Notes |
| --- | --- |
| Full blood count (FBC) | EDTA (purple) tube |
| Urea & electrolytes (U&E) | Renal function, electrolytes |
| Liver function (LFT) | |
| Thyroid function (TFT) | |
| HbA1c | Diabetes diagnosis; non-fasting; EDTA tube |
| Lipid profile | NICE: fasting not required; CVD risk |
| C-reactive protein (CRP) | Inflammation / infection |
| Coagulation screen (PT / APTT) | Citrate tube |
| Bone profile | Calcium, phosphate, ALP, albumin |
| Ferritin / iron studies | Anaemia work-up |
| Vitamin B12 & folate | |
| Vitamin D (25-OH) | |
| HbA1c monitoring | Diabetes monitoring; RCPath MRI applies |
| Glucose | Fasting or random |
| INR | Anticoagulation monitoring |
| Blood culture | Sepsis / infection; sterile technique |
| Group & save | Blood group + antibody screen |
| Crossmatch | For transfusion |
| Troponin | Cardiac marker |
| D-dimer | VTE exclusion |
| Amylase / lipase | Pancreatitis |

### Primary indications

routine-monitoring · anaemia · fatigue · infection · diabetes-monitoring ·
thyroid-symptoms · cardiovascular-risk · liver-disease · renal-monitoring ·
anticoagulation-monitoring · pre-operative · suspected-malignancy · other

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested panels | tick the test panels to order (FBC, U&E, LFT, …, amylase / lipase) |
| 4 | Clinical context | primary indication, clinical details, relevant medications |
| 5 | Pre-analytical & specimen | fasting required, fasting status, specimen collected + collection date/time |
| 6 | Patient safety | known blood-borne virus, difficult venous access |
| 7 | Triage & submit | urgency, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- `duplicate-recent-test`
- `retest-interval-breach`
- `fasting-required-not-met`
- `missing-clinical-details`
- `missing-indication`
- `blood-borne-virus-precaution`
- `stat-critical`
- `no-test-selected`
- `other`

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
blood-test-request/
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

- RCPath / ACB / IBMS *National Minimum Retesting Intervals in Pathology*
  (report G147, March 2021) — minimum retesting intervals for biochemistry,
  haematology, and coagulation tests; the anchor for the appropriateness axis.
  <https://www.rcpath.org/static/253e8950-3721-4aa2-8ddd4bd94f73040e/g147_national-minimum_retesting_intervals_in_pathology.pdf>
- ACB *Minimum Retesting Intervals for Clinical Biochemistry* recommendations.
  <https://www.rcpath.org/resourceLibrary/acb-minimum-retesting-intervals-for-clinical-biochemistry.html>
- NICE guidance: lipid profile — a fasting sample is not required; report
  non-HDL cholesterol. <https://www.nice.org.uk/>
- WHO *Use of glycated haemoglobin (HbA1c) in the diagnosis of diabetes mellitus*
  (HbA1c is non-fasting). <https://www.who.int/>
- WHO *Guidelines on drawing blood: best practices in phlebotomy* —
  pre-analytical and specimen-handling, blood-borne-virus precautions.
  <https://www.who.int/publications/i/item/9789241599221>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / accept-reject decisions.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form blood-test-request
```
