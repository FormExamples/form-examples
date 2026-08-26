# SOAP Note

A structured clinical progress note that records a single patient encounter in
the four canonical **SOAP** sections — **Subjective**, **Objective**,
**Assessment**, and **Plan** — and grades the note for **documentation
completeness** rather than computing a clinical risk score. The engine checks the
note against a set of required SOAP components, classifies it as **Complete**,
**Partial**, or **Incomplete**, reports a completeness percentage, and raises
safety flags (for example: an assessment or plan is missing, red-flag symptoms
are documented without a corresponding plan, no safety-netting advice is
recorded, or abnormal vitals are not addressed).

The SOAP format was introduced as part of Lawrence Weed's problem-oriented
medical record and is the most widely taught structure for clinical progress
notes across primary care, hospital, and allied-health settings. This form does
not judge clinical decisions; it supports the *quality and completeness of the
written record*, so that another clinician reading the note can safely continue
care.

## Scope and intended users

- **Setting:** any clinical encounter that produces a progress note — general
  practice, outpatient clinics, hospital wards, emergency departments, community
  and allied-health services, and telehealth consultations.
- **Users:** all clinicians who author progress notes — doctors, nurses, nurse
  practitioners, physician associates, paramedics, pharmacists, physiotherapists,
  and other allied-health professionals; and reviewers, educators, and auditors
  who assess note quality.
- **Encounters:** a single patient contact documented as one note. Longitudinal
  care is captured as a series of separate SOAP notes.
- **Not for:** clinical diagnosis, risk stratification, or triage. A **Complete**
  grade means the note is well documented, **not** that the clinical care was
  correct. The completeness grade never overrides clinical judgement.

## The SOAP sections and completeness model

The note is organized into the four SOAP sections. Each section contributes one
or more **required components**; the engine records which components are present
and derives an overall status.

**Sections and their required components.**

| Section | Records | Required components |
| --- | --- | --- |
| **Subjective** | History and patient-reported information: presenting complaint, history of the presenting complaint, relevant past history, medication, allergies, and any red-flag symptoms | presenting complaint; history of presenting complaint |
| **Objective** | Examination findings, vital signs, and investigation results | at least one of: examination findings, vital signs, investigation results |
| **Assessment** | The clinician's interpretation: primary diagnosis or problem, problem list, differential diagnoses, clinical impression | at least one recorded problem, diagnosis, or differential |
| **Plan** | What happens next: investigations ordered, treatment, referrals, follow-up, and safety-netting | at least one plan item (investigation, treatment, referral, or follow-up) |

**Conditionally required (safety) components.**

- **Safety-netting** advice is required when red-flag symptoms are recorded or the
  patient is being managed at home / discharged.
- **Follow-up or review** arrangement is required whenever a plan is recorded.

**Completeness percentage.** The engine counts the required components that are
present (including any that are conditionally required for this encounter) and
divides by the total required, giving `completenessPercent` (0–100).

**Status classes.**

| Status | Rule | Meaning |
| --- | --- | --- |
| **Complete** | every required component (core + any conditionally required) is present; no high-priority flag | The note stands alone; another clinician can safely continue care. |
| **Partial** | both **Assessment** and **Plan** are present, but one or more other required components are missing | The note is usable but has documentation gaps. |
| **Incomplete** | the **Assessment** or the **Plan** section is missing (or empty) | The note cannot safely stand alone; a critical section is absent. |

**Flags (raised independently of the status).**

- **Missing assessment** (high) — no diagnosis, problem, or differential recorded.
- **Missing plan** (high) — no plan item recorded.
- **Red-flag symptoms without a plan** (high) — red-flag symptoms are documented
  but the Plan section is empty.
- **No safety-netting** (medium) — safety-netting advice is required for this
  encounter (red flags present or patient managed at home) but is absent.
- **Abnormal vitals not addressed** (medium) — a vital sign is flagged abnormal
  but is not referenced in the Assessment or Plan.
- **Incomplete documentation** (low) — `completenessPercent < 100`.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Encounter context | authoring clinician name and role, date and time of encounter, care setting, encounter type |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Subjective | presenting complaint, history of presenting complaint, patient-reported symptoms, relevant past history / medication / allergies, red-flag symptoms present? |
| 4 | Objective | examination findings, vital signs (with abnormal-vitals flag), investigation results |
| 5 | Assessment | primary diagnosis or problem, problem list, differential diagnoses, clinical impression |
| 6 | Plan | investigations planned, treatment, referrals, follow-up / review, safety-netting advice |
| 7 | Summary and completeness | computed status, completeness percentage, fired rules, flagged issues, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The completeness engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — a clinical
  documentation aid; the output grades the completeness of the written record and
  does not determine diagnosis or treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Weed L.L. *Medical Records That Guide and Teach.* *N Engl J Med* 1968;
  278(11):593–600 — the problem-oriented medical record and SOAP structure.
- Podder V., Lew V., Ghassemzadeh S. *SOAP Notes.* StatPearls, 2023.
- Royal College of Physicians. *Generic Medical Record Keeping Standards.*
- Academy of Medical Royal Colleges. *Standards for the clinical structure and
  content of patient records* (2013).

## Verify

```sh
bin/test-form soap-note
```
