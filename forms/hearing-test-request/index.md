# Hearing Test Request

A UK NHS–aligned **audiology / hearing-assessment request (referral)** that a
clinician completes to request a hearing test for a patient. It records the
requested test, the affected side, the clinical indication and specific
question, relevant history, symptoms and red flags, and the requested urgency —
then computes a **four-axis grading** (appropriateness, urgency, request
completeness, and clinical priority) plus a set of safety-critical flags. The
output is a vetting report that supports the audiology department's triage and
booking decision.

This form is the audiology counterpart to the repository's other
clinician-driven request forms. It is completed by an audiologist, ENT surgeon,
GP, hearing therapist, or nurse rather than by the patient, and is aligned with
the British Society of Audiology recommended procedures, NICE NG98 (hearing loss
in adults), NICE Quality Standard QS185, and ENT-UK / BAO-HNS sudden
sensorineural hearing loss guidance.

## Scope and intended users

- **Setting:** NHS audiology clinic, ENT outpatient department, community
  hearing service, primary care, or audiology triage / vetting desk.
- **Users:** audiologists, ENT surgeons, GPs, hearing therapists, and nurses
  who raise or vet incoming requests.
- **Patients:** adults and (for newborn hearing screening) infants requiring an
  audiological examination.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | British Society of Audiology / NICE NG98 indication match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency** | ENT-UK / BAO-HNS + NICE QS185 red-flag escalation | triage tier routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Composite of acuity and appropriateness | low / moderate / high |

> **Note on the 1–9 scale.** There is no single published 1–9 audiology
> appropriateness score (unlike the ACR Appropriateness Criteria in radiology).
> This form **anchors the 1–9 axis on indication appropriateness** derived from
> the British Society of Audiology recommended procedures and NICE NG98, and
> says so explicitly. The three bands follow the usual ordinal-rating
> convention.

A red flag (sudden sensorineural hearing loss, unilateral / asymmetric
symptoms, ear discharge) **auto-escalates** the triage tier regardless of the
other axes. Per NICE QS185 and ENT-UK guidance, sudden sensorineural hearing
loss developing over ≤ 3 days within the past 30 days is an **otological
emergency** — refer to be seen within 24 hours; if more than 30 days ago, refer
urgently to be seen within 2 weeks.

### Test types and typical indications

| Test type | Typical indication |
| --- | --- |
| Pure-tone audiometry | Hearing loss, occupational noise, baseline assessment |
| Tympanometry | Middle-ear function, ear discharge, suspected effusion |
| Speech audiometry | Hearing-aid candidacy, functional hearing assessment |
| Otoacoustic emissions | Cochlear (outer hair cell) function, ototoxic monitoring |
| Auditory brainstem response | Retrocochlear / neural pathway, asymmetric loss, infants |
| Newborn hearing screen | Universal newborn hearing screening programme |
| Hearing-aid assessment | Hearing-aid review / fitting |
| Other | Indication recorded in the clinical question |

## Wizard steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB |
| 3 | Requested examination | test type, laterality, primary indication, specific clinical question |
| 4 | History | relevant medical / otological / noise-exposure history |
| 5 | Symptoms & red flags | hearing loss, tinnitus, vertigo, otalgia, sudden onset, ear discharge, ototoxic medication |
| 6 | Triage & submit | requested urgency, requested-by date, setting, site, notes |
| 7 | Result | computed four-axis grade, fired rules, safety flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories:

- `sudden-sensorineural-hearing-loss-urgent` — sudden onset; otological emergency.
- `unilateral-symptoms-red-flag` — unilateral / asymmetric hearing loss,
  tinnitus, or vertigo warranting ENT / audiovestibular diagnostic referral.
- `ear-discharge` — otorrhoea requiring ENT review before / alongside testing.
- `missing-indication` — no primary indication supplied.
- `missing-clinical-question` — no specific clinical question supplied.
- `other` — any other safety concern.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / RIS.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
hearing-test-request/
  index.md                          # this file
  AGENTS.md                         # agent instructions
  plan.md                           # implementation roadmap
  tasks.md                          # task tracking
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
```

## Clinical references

- British Society of Audiology — Recommended Procedures (pure-tone
  audiometry, tympanometry, ABR, OAE). <https://www.thebsa.org.uk/>
- NICE NG98 *Hearing loss in adults: assessment and management* (2018, updated
  2023). <https://www.nice.org.uk/guidance/ng98>
- NICE Quality Standard QS185 *Hearing loss in adults*, quality statement 2
  (sudden onset of hearing loss).
  <https://www.nice.org.uk/guidance/qs185/chapter/quality-statement-2-sudden-onset-of-hearing-loss>
- ENT-UK / BAO-HNS guidance on sudden sensorineural hearing loss (otological
  emergency; steroid treatment time-critical). <https://www.entuk.org/>
- *Sudden sensorineural hearing loss and bedside phone testing: a guide for
  primary care*, British Journal of General Practice 2020.
  <https://bjgp.org/content/70/692/144>
- AAO-HNS *Clinical Practice Guideline: Sudden Hearing Loss (Update)* (2019).
  <https://aao-hnsfjournals.onlinelibrary.wiley.com/doi/10.1177/0194599819859885>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / test selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form hearing-test-request
```
