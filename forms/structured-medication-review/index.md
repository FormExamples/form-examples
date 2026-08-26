# Structured Medication Review (SMR)

A comprehensive, patient-centred medication review for people with problematic
polypharmacy, frailty, one or more long-term conditions, or high-risk medicines.
It records the patient's **problems and priorities**, **every medicine with its
indication and adherence**, opportunities to **deprescribe**, the patient's
**anticholinergic burden**, **high-risk-medicine** checks, **monitoring** that is
due, and the **shared decisions and agreed actions** reached with the patient. It
then reports a **review status** (Complete / Incomplete), a **polypharmacy and
anticholinergic burden indicator**, and a set of **flags** that prompt action.

The Structured Medication Review is an NHS England service delivered in Primary
Care Networks (PCNs), most often by a clinical pharmacist working with the GP. It
is not a scoring test that yields a diagnosis; it is a documentation instrument
with partial scoring — the numeric outputs (medicine count, anticholinergic
burden sum) and the flags support, but do not replace, the reviewer's clinical
judgement and the shared decision reached with the patient.

## Scope and intended users

- **Setting:** GP practices and PCNs, care homes, community pharmacy, and
  patients' homes — anywhere a scheduled, whole-patient medicines review takes
  place.
- **Users:** clinical pharmacists, GPs, PCN pharmacy technicians (supporting the
  review), and other prescribers or clinicians conducting a medication review.
- **Patients:** adults identified for review — typically those with problematic
  polypharmacy (many regular medicines), moderate-to-severe frailty, multiple
  long-term conditions, care-home residents, or people prescribed high-risk
  medicines (for example anticoagulants, insulin, opioids, lithium, methotrexate).
- **Not for:** a substitute for a full clinical consultation, an acute
  prescribing decision, or a validated diagnostic score. The tool documents the
  review and surfaces prompts; the prescriber decides.

## Sections and data captured

Recorded on a single continuous single-page wizard:

- **Review context** — reviewing clinician name and role, review date and time,
  care setting, consultation mode (face-to-face, telephone, video, home visit).
- **Patient identification** — patient identifier, age band, sex, frailty status,
  care-home residency, list of long-term conditions.
- **Problems and patient concerns** — presenting problems, patient-reported side
  effects and difficulties, and *what matters to the patient*.
- **Medicines** — a repeating list; for each medicine: name, form and strength,
  dose and regimen, **indication** and whether the indication is recorded, whether
  it is a regular medicine, whether it is high-risk (and its class), **adherence**,
  **anticholinergic burden points (0–3)**, whether monitoring is required and up to
  date, whether it is a deprescribing candidate, and any STOPP / START criterion.
- **STOPP / START review** — potentially inappropriate prescribing to stop
  (STOPP) and potential prescribing omissions to start (START).
- **Monitoring** — blood tests and other monitoring due or overdue.
- **Patient goals and shared decisions** — patient priorities and the decisions
  agreed together.
- **Agreed actions and plan** — the action for each medicine (stop, start, reduce,
  switch, continue, monitor, refer), the follow-up plan and date, and whether the
  review is complete.

## Review and scoring model

This is a documentation form with **partial scoring**. The engine derives:

- **Review status** — `Complete` when every required section is filled (problems
  reviewed; each medicine has an indication and adherence recorded; monitoring
  reviewed; patient goals recorded; actions agreed and the review marked
  finished), otherwise `Incomplete`.
- **Polypharmacy count** — the number of regular medicines, banded as
  `none` (< 5), `polypharmacy` (5–9), or `hyperpolypharmacy` (≥ 10).
- **Anticholinergic Burden (ACB) score** — the **sum** of each medicine's ACB
  points (0–3 per medicine); an ACB total of **≥ 3** is clinically significant.
- **STOPP / START flags** — one flag per fired STOPP or START criterion.
- **Composite burden band** — `low` / `moderate` / `high`, driven by the worse of
  the polypharmacy band and the anticholinergic band (max-band algorithm):

| Band | Drivers |
| --- | --- |
| Low | < 5 regular medicines **and** ACB 0–2 |
| Moderate | 5–9 regular medicines **and** ACB 0–2 |
| High | ≥ 10 regular medicines **or** ACB ≥ 3 |

**Flagged issues** are emitted independently of the bands: high anticholinergic
burden (ACB ≥ 3), one or more STOPP triggers, one or more START omissions, missing
or overdue monitoring, an adherence concern, a high-risk medicine without a
recorded indication, and an incomplete review.

## Assessment steps

Completed in order on one continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Review context | clinician name and role, review date and time, care setting, consultation mode |
| 2 | Patient identification | patient identifier, age band, sex, frailty status, care-home residency, long-term conditions |
| 3 | Problems and patient concerns | presenting problems, patient-reported side effects and difficulties, what matters to the patient |
| 4 | Medicines | repeating list: name, dose, indication + indication recorded, regular?, high-risk class, adherence, ACB points, monitoring required / up to date, deprescribing candidate |
| 5 | STOPP / START review | potentially inappropriate prescribing (STOPP) and prescribing omissions (START) |
| 6 | Monitoring | tests due, overdue monitoring |
| 7 | Patient goals and shared decisions | patient priorities, agreed shared decisions |
| 8 | Agreed actions and plan | action per medicine, follow-up plan and date, review complete |
| 9 | Summary and outputs | computed review status, burden band, ACB sum, polypharmacy count, flags, free-text note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — medicines-review
  documentation with decision-support prompts; the output supports rather than
  determines prescribing decisions.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NHS England. *Structured Medication Reviews and Medicines Optimization:
  guidance* (Network Contract DES).
- O'Mahony D. *et al.* STOPP/START criteria for potentially inappropriate
  prescribing in older people, version 3. *Age and Ageing* 2023.
- Boustani M. *et al.* Anticholinergic Cognitive Burden (ACB) scale.
- NICE NG5. *Medicines optimization: the safe and effective use of medicines.*
- NICE NG197. *Shared decision making.*
- PrescQIPP / NHS *Polypharmacy: Getting our medicines right.*

## Verify

```sh
bin/test-form structured-medication-review
```
