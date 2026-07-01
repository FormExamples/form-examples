# General Practitioner Referral Letter

A structured referral letter from primary care to a specialist or service. It
records **who is being referred**, **who is referring**, **where and why**, and
**how urgently**, then applies a documentation engine that grades the referral's
**completeness** (Complete / Incomplete), classifies its **urgency** (routine /
urgent / two-week-wait suspected cancer / emergency), and raises **flags** for
safety-critical conditions.

This is a **documentation and completeness form**, not a numeric-score
instrument. The engine does not diagnose or triage clinically; it checks that a
referral carries every piece of information the receiving service needs, assigns
the correct urgency pathway, and warns the referrer when a red flag (met
two-week-wait criteria, missing mandatory information, undocumented consent, or
emergency features) means the letter should not be sent as a routine referral.

The output is a clean, self-contained referral letter suitable for the receiving
service's triage, together with a completeness summary and a list of flagged
issues for the referrer to resolve before sending.

## Scope and intended users

- **Setting:** general practice and other primary-care services generating a
  referral into secondary or community care — routine outpatient referral,
  urgent referral, suspected-cancer (two-week-wait) referral, and the
  documentation of an emergency admission arranged separately.
- **Users:** general practitioners, GP registrars, advanced nurse
  practitioners, paramedics and pharmacists working in primary care, and
  administrative staff completing or checking a referral on a clinician's
  behalf.
- **Patients:** any patient being referred from primary care; no age
  restriction, though paediatric and safeguarding fields are captured where
  relevant.
- **Not for:** the clinical decision of *whether* to refer, replacing local
  Directory-of-Services or e-Referral pathway rules, or determining a diagnosis.
  The engine grades the *letter*, not the patient.

## Sections and completeness / urgency model

The engine returns a **status class**, an **urgency classification**, a
**completeness percentage**, the **rules that fired**, and a list of **flags**.

### Status classes

| Status | Meaning |
| --- | --- |
| **Complete** | Every mandatory field for the selected urgency is present; the referral can be sent. |
| **Incomplete** | One or more mandatory fields are missing; the letter should not be sent until resolved. |

`completenessPercent` is the proportion of mandatory fields that are present
(0–100), so the referrer sees how close the letter is to sendable.

### Urgency classification

| Urgency | When selected | Effect |
| --- | --- | --- |
| **routine** | standard outpatient referral | standard mandatory-field set |
| **urgent** | clinically urgent but not a cancer pathway | urgency reason becomes mandatory |
| **two-week-wait** | suspected-cancer referral meeting a national criterion | suspected-cancer criterion + pathway become mandatory; suspected-cancer flag raised |
| **emergency** | acute, potentially life-threatening features | emergency flag raised — arrange same-day assessment / 999, do not send as a routine letter |

### Mandatory-field rules

A referral is **Complete** only when, for the selected urgency, all mandatory
fields are present:

- **Always mandatory:** patient identifier, patient name, patient date of birth,
  referrer name, referrer role, referring practice, referral specialty / service,
  urgency, reason for referral, relevant clinical history.
- **Urgency-conditional:** `urgent` and `two-week-wait` require an urgency
  reason; `two-week-wait` additionally requires a named suspected-cancer
  criterion and the suspected-cancer pathway.
- **Consent:** consent to share information should be documented; when absent the
  referral remains sendable but a no-consent flag is raised.

### Flags

Raised independently of the status, each with a priority:

- **Suspected-cancer pathway** (high) — two-week-wait urgency with a met
  criterion: route on the suspected-cancer pathway, not a routine referral.
- **Emergency features** (high) — emergency urgency or a documented red-flag
  symptom: arrange same-day assessment or 999; a routine letter is not
  appropriate.
- **Mandatory information missing** (high) — one or more always-mandatory fields
  absent: the receiving service will reject or bounce the referral.
- **Urgency information missing** (medium) — urgent / two-week-wait selected but
  the urgency reason, suspected-cancer criterion, or pathway is absent.
- **Consent not documented** (medium) — no record that the patient consented to
  the referral and information-sharing.
- **No safety-netting recorded** (low) — no safety-netting advice or follow-up
  documented for the patient while awaiting the appointment.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Referrer details | referrer name, role, GMC/registration number, referring practice, practice address, contact details, date of referral |
| 2 | Patient identification | patient identifier (NHS number), name, date of birth, sex, address, contact details, interpreter / access needs |
| 3 | Referral destination | referral specialty / service, named clinician or team (optional), receiving organisation |
| 4 | Urgency | urgency (routine / urgent / two-week-wait / emergency), urgency reason, suspected-cancer criterion + pathway (if two-week-wait) |
| 5 | Reason and history | reason for referral, relevant clinical history, presenting problem, symptom duration, red-flag symptoms |
| 6 | Examination and investigations | examination findings, vital signs, investigation results already available (bloods, imaging), red-flag findings |
| 7 | Medications and allergies | current medications, known allergies and reactions, relevant risk factors |
| 8 | Expectations, consent and safety-netting | patient's expectations, question to the specialist, consent to share information, safety-netting advice, carer / next-of-kin details |
| 9 | Summary and review | computed status, urgency classification, completeness percentage, fired rules, flagged issues, generated referral letter, free-text note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The documentation engine is pure (no side effects, no I/O) and unit-tested.
- British English throughout.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — administrative
  documentation and completeness-checking tool; the output structures a referral
  and prompts the referrer rather than making a diagnosis or determining
  treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical and administrative references

- NICE NG12. *Suspected cancer: recognition and referral* (2015, updated 2023) —
  two-week-wait referral criteria.
- NHS e-Referral Service (e-RS) referral standards and the Directory of
  Services.
- Academy of Medical Royal Colleges. *Please, write to me: writing outpatient
  clinic letters to patients* (2018).
- Montgomery v Lanarkshire Health Board [2015] UKSC 11 — consent and shared
  decision-making.

## Verify

```sh
bin/test-form general-practitioner-referral-letter
```
