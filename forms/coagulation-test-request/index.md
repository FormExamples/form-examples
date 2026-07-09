# Coagulation Test Request

A UK NHS–aligned **coagulation / haemostasis blood-test request (referral)** that
a clinician completes to order one or more coagulation tests for a patient. It
records the requested tests, the clinical indication and details, the patient's
anticoagulant and bleeding / thrombosis history, pre-analytical specimen
handling, and the requested urgency — then computes a **four-axis grading**
(appropriateness, pre-analytical specimen safety, request completeness, and
triage priority) plus a set of safety-critical flags. The output is a vetting
report that supports the laboratory's and haematology team's triage and
processing decision.

This form is the coagulation-laboratory counterpart to the repository's other
clinician-driven request forms. It is completed by a GP, hospital doctor,
haematologist, or nurse rather than by the patient, and is aligned with British
Society for Haematology (BSH) coagulation and thrombophilia-testing guidance and
NICE NG158 venous-thromboembolism diagnosis.

## Scope and intended users

- **Setting:** NHS general practice, hospital ward, emergency department,
  anticoagulation clinic, haematology day unit, or coagulation-laboratory
  triage / vetting desk.
- **Users:** GPs, hospital doctors, haematologists, and nurses who raise or vet
  coagulation requests.
- **Patients:** any patient requiring a coagulation / haemostasis test.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete, at pre-analytical risk, or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | BSH indication & retest-interval match, anchored 1–9 | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Pre-analytical specimen safety** | Citrate tube fill / 9:1 ratio / analysis timing | ok / caution / reject-risk |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical details weighted highest | 0–100 % complete (+ missing fields) |
| **D. Triage priority** | Acuity escalation rules | routine / urgent / stat (+ target timeframe) |

> **Note on the 1–9 scale.** There is **no single published 1–9
> coagulation-ordering score**. Axis A anchors the 1–9 ordinal on indication
> appropriateness and BSH retest-interval guidance, mirroring the ACR-style
> three-band convention. Active bleeding or suspected DIC **auto-escalate** the
> triage tier to *stat* regardless of the other axes.

### Requested tests and typical indications

| Test | Typical indication |
| --- | --- |
| Prothrombin time / INR | Warfarin monitoring; liver disease; DIC; pre-operative screen |
| Activated partial thromboplastin time (APTT) | Heparin monitoring; unexplained bleeding; lupus anticoagulant screen |
| Fibrinogen (Clauss) | DIC; major haemorrhage; liver disease |
| D-dimer | Suspected DVT / PE with unlikely Wells pre-test probability; DIC |
| Thrombophilia screen | Selected unprovoked VTE where the result changes management |
| Factor assays | Investigation of a confirmed bleeding disorder |
| Anti-Xa assay | LMWH / DOAC level (renal impairment, extremes of weight, pregnancy) |
| Mixing studies | Work-up of an unexplained prolonged PT / APTT |
| Von Willebrand screen | Suspected von Willebrand disease; mucocutaneous bleeding |

### Primary indications

`anticoagulation-monitoring`, `bleeding-disorder`, `suspected-dvt-pe`,
`pre-operative`, `thrombophilia-investigation`, `liver-disease`,
`disseminated-intravascular-coagulation`, `abnormal-bleeding`, `other`.

## Wizard steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested tests | the nine coagulation-test booleans |
| 4 | Clinical context | primary indication, clinical details, on anticoagulant + agent, bleeding / thrombosis history |
| 5 | Specimen / pre-analytical | specimen collected, collection date-time (citrate fill / ratio / timing) |
| 6 | Triage | urgency, requested-by date, site, setting, notes |
| 7 | Review & submit | computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- `active-bleeding-stat` — active major bleeding; process as stat.
- `suspected-dic` — disseminated intravascular coagulation suspected.
- `d-dimer-low-pretest-caution` — D-dimer ordered without an appropriate
  unlikely-Wells pre-test probability (NICE NG158).
- `specimen-underfilled-risk` — citrate tube under-filled / wrong ratio.
- `missing-clinical-details` — indication or clinical details absent.
- `no-test-selected` — no coagulation test selected.
- `other`.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / LIMS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
coagulation-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
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

- Arachchillage DJ, et al. *Thrombophilia testing: A British Society for
  Haematology guideline.* Br J Haematol. 2022.
  <https://onlinelibrary.wiley.com/doi/10.1111/bjh.18239>
- BSH *Guidelines for thrombophilia testing*.
  <https://b-s-h.org.uk/guidelines/guidelines/guidelines-for-thrombophilia-testing>
- NICE NG158 *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing* (2-level Wells score; D-dimer for unlikely VTE;
  age-adjusted threshold over 50). <https://www.nice.org.uk/guidance/ng158>
- BSH / CLSI pre-analytical guidance on sodium-citrate tube fill, 9:1
  blood-to-anticoagulant ratio, and analysis timing.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form coagulation-test-request
```
