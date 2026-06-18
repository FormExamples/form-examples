# Holter Monitor Test Request

A UK NHS–aligned **ambulatory ECG (Holter) monitoring request (referral)** that
a clinician completes to request ambulatory cardiac rhythm monitoring for a
patient. It records the requested monitor type, the clinical indication and
specific question, the patient's symptoms and symptom frequency, the relevant
cardiac context and red flags, and the requested urgency — then computes a
**four-axis grading** (appropriateness, urgency/triage, request completeness,
and clinical priority) plus a set of safety-critical flags. The output is a
vetting report that supports the cardiac physiology department's triage and
booking decision.

This form is the ambulatory-cardiology counterpart to the repository's other
clinician-driven request forms. It is completed by a cardiologist, GP,
hospital doctor, cardiac physiologist, or nurse rather than by the patient, and
is aligned with ACC/AHA ambulatory electrocardiography guidance, the ISHNE-HRS
expert consensus on ambulatory ECG, NICE NG196 atrial fibrillation guidance, and
ESC syncope guidance.

## Scope and intended users

- **Setting:** NHS cardiology outpatient clinic, GP surgery, acute medical unit,
  stroke unit, or cardiac physiology / vetting desk.
- **Users:** cardiologists, GPs, hospital doctors, cardiac physiologists, and
  nurses who request or vet ambulatory ECG monitoring.
- **Patients:** people with palpitations, suspected arrhythmia, syncope, or a
  need for atrial-fibrillation detection or rhythm surveillance.

## Scoring system

The engine grades each request on **four independent axes**, each citable to a
recognised body. Axes are orthogonal: a highly appropriate request can still be
incomplete or urgent.

| Axis | Instrument | Output |
| --- | --- | --- |
| **A. Appropriateness** | ACC/AHA ambulatory ECG guidance + indication/symptom-frequency match (1–9 ordinal) | usually-appropriate (7–9) / may-be-appropriate (4–6) / usually-not-appropriate (1–3) |
| **B. Urgency / triage** | Red-flag escalation rules | routine / urgent / emergency (+ target timeframe) |
| **C. Request completeness** | Mandatory-field checklist, indication + clinical question weighted highest | 0–100 % complete (+ missing fields) |
| **D. Clinical priority** | Acuity banding across symptoms and cardiac context | low / moderate / high |

A red-flag (syncope, suspected VT, post-stroke AF detection) **auto-escalates**
the triage tier regardless of the other axes.

### Monitor-type / symptom-frequency matching

The choice of monitor duration depends on how often symptoms occur — the
diagnostic yield of a 24-hour Holter is high only for daily or near-daily
symptoms; infrequent symptoms need longer or patient-activated recording.

| Symptom frequency | Recommended monitor |
| --- | --- |
| Daily / near-daily | 24-hour or 48-hour Holter |
| Weekly | 7-day monitor |
| Monthly | 14-day monitor or event recorder |
| Rare (< monthly) | event recorder or implantable loop recorder |

## Wizard steps

Completed in order on a single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Requesting clinician | name, role, registration body + number, contact, supervising consultant, referral date |
| 2 | Patient identification | NHS number, name, DOB, BMI |
| 3 | Requested examination | monitor type, primary indication, specific clinical question, relevant history |
| 4 | Symptoms | palpitations, syncope, presyncope, breathlessness, symptom frequency |
| 5 | Cardiac context & red flags | known arrhythmia, recent stroke / TIA, relevant medications |
| 6 | Triage & submit | requested urgency, requested-by date, setting, notes; computed four-axis grade, flags, recommendation |

## Safety flags

Computed independently of the axes. Priority: high / medium / low. Categories
are syncope red-flag, suspected VT, post-stroke AF detection,
symptom-frequency / monitor mismatch, missing indication, missing clinical
question, and other.

## Output

- **HTML report preview** and downloadable **PDF**.
- **FHIR R5 Bundle** exportable for integration with hospital EHR / cardiology
  information system.
- **XML** representation for archival or legacy import.
- Import and export via JSON, XML, CSV, and TSV.

## Directory structure

```
holter-monitor-test-request/
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

- ACC/AHA Guidelines for Ambulatory Electrocardiography (1–9 ordinal scale;
  Class I for unexplained syncope, near-syncope, dizziness, and palpitations).
  <https://www.ahajournals.org/doi/10.1161/01.cir.100.8.886>
- 2017 ISHNE-HRS expert consensus statement on ambulatory ECG and external
  cardiac monitoring / telemetry.
  <https://www.heartrhythmjournal.com/article/s1547-5271(17)30415-0/fulltext>
- NICE NG196 *Atrial fibrillation: diagnosis and management* (monitor duration
  by symptom frequency; 24-hour vs longer / event recorder).
  <https://www.nice.org.uk/guidance/ng196/chapter/Recommendations>
- ESC Guidelines for the diagnosis and management of syncope.
  <https://www.escardio.org/Guidelines>

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support, Class IIa where output drives triage / monitor-type selection.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form holter-monitor-test-request
```
