# Inpatient Clinical Note

A structured clinical note written about an **admitted patient during a
hospital episode**. Unlike a single bedside ward-round entry, one inpatient
clinical note can be any of the note types a ward team produces across an
admission — admission clerking, daily progress note, specialty consult note,
acute event / deterioration note, bedside procedure note, shift handover note,
inter-ward transfer note, or discharge-planning note — all keyed to the same
admission episode and sharing one data shape.

The note records **who wrote it and when**, the interval history since the last
entry, the current observations and **NEWS2** aggregate, examination findings by
system, investigations reviewed and whether abnormal results were actioned, the
running problem list, medication and prescribing changes, the mandatory
inpatient risk assessments (VTE, falls, pressure ulcer, delirium, nutrition,
infection control), the clinical impression, the plan and outstanding jobs, the
escalation and ceiling-of-care status, and the sign-off.

Two engines run over each entry:

- a **documentation completeness** engine that grades the note **Complete /
  Partial / Incomplete** against the components required *for its note type*,
  and reports a completeness percentage; and
- a **clinical acuity** engine that assigns an escalation band
  **Stable / Watch / Escalate / Critical** from the observations, NEWS2, and
  deterioration markers.

A set of safety flags fires independently of both grades. A **Complete** grade
means the record is well documented, **not** that the clinical care was correct;
neither grade ever overrides clinical judgement.

## Scope and intended users

- **Setting:** acute and general inpatient wards, medical and surgical
  admissions units, enhanced care and high-dependency areas, specialty wards,
  and any inpatient area where a clinical note is filed against an admission
  episode.
- **Users:** ward doctors (foundation, core, and specialty trainees),
  consultants, advanced clinical practitioners and physician associates,
  specialty registrars writing consult notes, ward nurses and nurse
  practitioners writing nursing entries, and clinical auditors reviewing record
  quality.
- **Patients:** admitted adult inpatients under an active admission episode.
- **Not for:** the ward-round-specific bedside entry (see
  [`ward-round-note`](../ward-round-note)), the generic SOAP-structured
  encounter note (see [`soap-note`](../soap-note)), operation notes (see
  [`medical-operation-note`](../medical-operation-note)), or the discharge
  summary itself (see [`hospital-discharge`](../hospital-discharge)). This form
  produces neither a diagnosis nor a triage decision.

## Note types

A single enum drives which components the completeness engine requires. Every
note type shares the same schema; the required-component set differs.

| Note type | Purpose | Additional required components |
| --- | --- | --- |
| `admission-clerking` | First full assessment on admission | `examination`, `investigations`, `risk-assessments` |
| `progress` | Routine interval progress entry | none beyond the base set |
| `consult` | Specialty opinion requested by the parent team | `examination`, `communication` |
| `event` | Acute deterioration or clinical incident | `observations`, `escalation` |
| `procedure` | Bedside procedure performed on the ward | `examination`, `communication` |
| `handover` | End-of-shift handover entry | `escalation` |
| `transfer` | Inter-ward or inter-hospital transfer | `escalation`, `communication` |
| `discharge-planning` | Discharge readiness and arrangements | `communication` |

## Completeness model

The note is organised into twelve components. Each is either **documented** (a
meaningful entry is present) or **absent**. An explicit negative — "no overnight
events", "no medication changes", "nil outstanding" — counts as documented,
because a deliberate negative is a valid clinical record.

Components split into **required** (must be present for a Complete grade) and
**recommended** (enrich the record but do not by themselves downgrade it). The
required set is the base set below plus the note-type additions in the table
above.

| Component | Base requirement | Documented when |
| --- | --- | --- |
| `header` | required | Note type, date/time, author name and grade all present |
| `interval-history` | required | Interval history or an explicit negative present |
| `observations` | required | A full observation set or a NEWS2 total present |
| `examination` | recommended | At least one system examined |
| `investigations` | recommended | At least one investigation reviewed, or explicit "none" |
| `problems` | required | At least one problem on the list |
| `medications` | required | At least one medication change, or explicit "no changes" |
| `risk-assessments` | required | VTE status recorded (falls, pressure, delirium, nutrition recommended) |
| `impression` | required | Clinical impression present |
| `plan` | required | Plan or at least one job present |
| `escalation` | required | Escalation status and ceiling of care recorded |
| `communication` | recommended | Family / next-of-kin or team communication recorded |

Classification:

- **Complete** — every required component for the note type is documented.
- **Partial** — `header`, `impression`, and `plan` documented, and at least half
  the required components documented.
- **Incomplete** — `header`, `impression`, or `plan` missing, or fewer than half
  the required components documented.

Completeness percentage is `documented required components / required components
× 100`, rounded to the nearest integer.

## Acuity model

The acuity engine is **max-band**: the worst finding sets the band, and `stable`
is the default when no rule fires. It runs on the observation set and the
deterioration markers, independently of completeness.

| Band | Drivers |
| --- | --- |
| Stable | NEWS2 0–4 with no single parameter scoring 3, no deterioration markers |
| Watch | NEWS2 5–6, or any single parameter scoring 3, or a worsening NEWS2 trend |
| Escalate | NEWS2 ≥ 7, new oxygen requirement, new confusion / ACVPU below Alert, sepsis screen positive, unresolved abnormal result |
| Critical | Cardiac or respiratory arrest, peri-arrest call, critical-care outreach or ICU referral made, NEWS2 ≥ 9, new organ support started |

The NEWS2 aggregate is either entered directly or derived from the seven
parameters (respiratory rate, oxygen saturation, oxygen supplementation,
systolic blood pressure, pulse, consciousness on ACVPU, temperature) following
RCP 2017 scoring.

## Safety flags

Flags fire independently of both grades, each with a priority and a suggested
action.

| Flag | Fires when | Priority |
| --- | --- | --- |
| `deteriorating-news2-no-escalation` | Acuity ≥ Escalate with no escalation action recorded | high |
| `sepsis-screen-positive-no-action` | Sepsis screen positive without an antimicrobial or escalation plan | high |
| `vte-not-assessed` | VTE status is `not-done` | high |
| `abnormal-result-not-actioned` | An investigation flagged abnormal with no action recorded | high |
| `no-plan-documented` | No plan and no jobs recorded | high |
| `allergy-not-checked` | Medication changes recorded without an allergy check | high |
| `no-senior-review` | Acuity ≥ Escalate, or a ceiling-of-care decision, with no senior named | medium |
| `ceiling-of-care-undocumented` | Escalation status recorded without a ceiling of care | medium |
| `antimicrobial-review-overdue` | An antimicrobial is in use past its review date | medium |
| `no-capacity-assessment` | A capacity-dependent decision recorded without a capacity assessment | medium |
| `long-stay-no-discharge-plan` | Length of stay over 7 days with no estimated discharge date | low |
| `incomplete-entry` | Any required component absent | low |

## 12-step ward-team wizard

Completed in order on a single continuous page.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Note identification | note type, hospital, ward, bed, note date/time, author name and GMC/NMC number, author grade, parent specialty, responsible consultant |
| 2 | Patient and admission | NHS number, MRN, name, date of birth, sex, admission date/time, admitting specialty, admission method, admission reason, length of stay (derived) |
| 3 | Interval history | events since the last entry, overnight events, patient-reported symptoms, nursing concerns, pain score, sleep, oral intake, bowels, mobility |
| 4 | Observations and NEWS2 | respiratory rate, oxygen saturation, oxygen delivery and flow, systolic and diastolic blood pressure, pulse, ACVPU, temperature, NEWS2 total, NEWS2 trend, observation time |
| 5 | Examination | general appearance, cardiovascular, respiratory, abdominal, neurological, musculoskeletal, skin and wounds, lines and drains, other findings |
| 6 | Investigations reviewed | child rows: test name, category, requested date, result date, result summary, abnormal (yes/no), actioned (yes/no), action taken |
| 7 | Problem list | child rows: problem, category, status (active / resolving / resolved / chronic), onset date, priority, progress commentary |
| 8 | Medications and prescribing | child rows: drug, action (started / stopped / dose-changed / held / continued), dose, route, frequency, indication, review date; plus allergy check, antimicrobial review status, medicines reconciliation status |
| 9 | Risk assessments | VTE status and prophylaxis, falls risk, pressure-ulcer risk and skin status, delirium screen (4AT), nutrition screen (MUST), infection control and isolation status, safeguarding concern |
| 10 | Assessment and impression | clinical impression, differential diagnosis, response to treatment, deterioration markers, sepsis screen, new organ support, critical-care referral |
| 11 | Plan, jobs and escalation | child rows: job, owner, due by, status; plus overall plan, escalation status, ceiling of care, ReSPECT / DNACPR status, senior review needed and by whom, estimated discharge date, discharge-planning notes |
| 12 | Communication and sign-off | family / next-of-kin communication, patient communication, capacity assessment, consent, team handover, computed completeness grade and acuity band with fired rules and flags, author override with reason, attestation, electronic signature |

## Data model

PostgreSQL is the source of truth in [`sql/`](sql). One parent record plus child
tables for the repeating sections and the grading results.

| Table | Purpose |
| --- | --- |
| `patient` | Patient demographics |
| `clinician` | Note author and named clinicians |
| `inpatient_clinical_note` | Parent note: identification, admission, interval history, observations, examination, risk assessments, impression, escalation, communication, sign-off |
| `inpatient_clinical_note_problem` | Problem-list rows |
| `inpatient_clinical_note_medication_change` | Prescribing-change rows |
| `inpatient_clinical_note_investigation` | Investigations-reviewed rows |
| `inpatient_clinical_note_job` | Plan / outstanding-job rows |
| `inpatient_clinical_note_grade` | Computed completeness grade, acuity band, per-component presence |
| `inpatient_clinical_note_grade_rule` | Audit trail of every rule that fired |
| `inpatient_clinical_note_grade_flag` | Safety flags with priority and suggested action |

Derived representations are generated from the SQL and never hand-edited:
[`xml/`](xml), [`fhir/r5/`](fhir/r5), [`protobuf/`](protobuf),
[`openapi/`](openapi).

## Outputs

- A printable clinical note for the paper or electronic record, showing the
  completeness grade, the acuity band, the fired rules, and the flags.
- A FHIR R5 Bundle centred on a `Composition` (the note) with `Encounter`,
  `Patient`, `Practitioner`, `Condition` (problems), `Observation`
  (observations and NEWS2), `MedicationRequest` (prescribing changes), and
  `Task` (jobs) resources.
- JSON, XML, CSV, and TSV import and export.

## Clinical grounding

- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- Academy of Medical Royal Colleges. *Standards for the Clinical Structure and
  Content of Patient Records* (2013).
- General Medical Council. *Good Medical Practice* — record-keeping (2024).
- NICE NG89. *Venous thromboembolism in over 16s: reducing the risk* (2018).
- NICE NG51. *Sepsis: recognition, diagnosis and early management* (2016,
  updated 2024).
- NICE CG103. *Delirium: prevention, diagnosis and management* (2010, updated
  2023).
- NICE CG161. *Falls in older people: assessing the risk and prevention* (2013,
  updated 2019).
- NICE CG179. *Pressure ulcers: prevention and management* (2014).
- NICE NG15. *Antimicrobial stewardship* (2015).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*
