# Ward Round Note

A daily inpatient review entry completed at the bedside during a ward round. It
captures a structured, contemporaneous record of a single review: **when** the
patient was seen and by **whom** (date, time, clinician name and grade),
overnight events, the current problem list and progress, examination findings
and the latest observations (**NEWS2**), investigation results reviewed, the
**VTE assessment** status, medication changes, the day's **plan and jobs**, the
**escalation / ceiling-of-care** status, and the **estimated discharge date**.

Unlike the scored assessments elsewhere in this monorepo, the ward round note is
a **documentation / completeness** form. There is no numeric clinical score.
Instead a completeness engine grades each entry against a set of required
components — classifying it **Complete**, **Partial**, or **Incomplete** — and
raises safety flags (deteriorating NEWS2 needing escalation, VTE assessment not
done, no plan or jobs documented, abnormal results not actioned, no senior
review when one is required). The aim is a legible, auditable daily entry that
satisfies good-medical-record-keeping standards and supports continuity of care
between shifts.

## Scope and intended users

- **Setting:** general and acute inpatient wards, medical and surgical
  admissions units, and any inpatient area where a daily consultant- or
  registrar-led ward round is documented.
- **Users:** ward doctors (foundation, core, and specialty trainees), advanced
  clinical practitioners (ACPs) and physician associates, and consultants
  reviewing or countersigning the entry.
- **Patients:** admitted adult inpatients under active review.
- **Not for:** the initial clerking / admission document, discharge summaries,
  operation notes, or any numeric risk score. A single note records one review
  on one day; a patient accrues one note per ward round.

## Sections and completeness model

The note is organized into ten components. Each component is either
**documented** (a meaningful entry is present) or **absent**. The engine
partitions components into **required** (must be present for a complete entry)
and **recommended** (contribute to a richer record but do not by themselves
downgrade the status).

| # | Component | Class | Documented when |
| --- | --- | --- | --- |
| 1 | Review header — date, time, clinician name and grade | required | date, time, clinician name, and grade all present |
| 2 | Overnight events | recommended | free-text entry, or an explicit "no events overnight" flag |
| 3 | Current issues / problem list and progress | required | at least one active problem with a progress note |
| 4 | Examination and latest observations (NEWS2) | required | examination summary present and a NEWS2 total recorded |
| 5 | Investigation results reviewed | required | results reviewed, or an explicit "none outstanding" flag |
| 6 | VTE assessment status | required | VTE status recorded (assessed / not required / not done) |
| 7 | Medication changes | required | changes documented, or an explicit "no changes" flag |
| 8 | Plan and jobs for the day | required | at least one plan item or job present |
| 9 | Escalation / ceiling-of-care status | required | escalation status recorded (e.g. for full escalation / ward-level ceiling / DNACPR) |
| 10 | Estimated discharge date | recommended | a date or "not yet estimable" flag present |

### Status classes

The engine computes a completeness percentage over the **required** components
and assigns one of three status classes:

| Status | Rule |
| --- | --- |
| **Complete** | every required component is documented (100 % of required components). |
| **Partial** | the review header and the plan are documented, but one or more other required components are missing (≥ 50 % of required components, header and plan present). |
| **Incomplete** | the review header or the plan is missing, or fewer than half the required components are documented. |

`completenessPercent` is `documentedRequired / totalRequired × 100`, rounded to
the nearest whole number.

### Flagged issues

Flags are computed independently of the completeness status. Each has a priority
(high / medium / low):

- **Deteriorating NEWS2 — escalation needed** (high) — NEWS2 total at or above
  the escalation threshold (≥ 5, or a single parameter scoring 3), or a rising
  trend recorded, with no escalation action documented.
- **VTE assessment not done** (high) — component 6 status is "not done".
- **No plan or jobs documented** (high) — component 8 absent.
- **Abnormal results not actioned** (medium) — an abnormal or critical
  investigation result is flagged but no corresponding action / job is recorded.
- **No senior review when required** (medium) — a deteriorating patient or a
  ceiling-of-care decision is recorded but no consultant / senior grade is named
  on the entry.
- **Incomplete entry** (low) — one or more required components absent.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one component of the daily review.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Review header | clinician name, grade (FY1 / FY2 / core trainee / specialty registrar / ACP / physician associate / consultant), date and time of review, ward / location |
| 2 | Patient identification | patient identifier, admission date, primary diagnosis / reason for admission |
| 3 | Overnight events | free-text overnight events, "no events overnight" flag |
| 4 | Current issues and progress | active problem list, progress note per problem |
| 5 | Examination and observations | examination summary, NEWS2 total, key observation values, trend (improving / stable / deteriorating) |
| 6 | Investigations reviewed | results reviewed, abnormal-result flags, "none outstanding" flag |
| 7 | VTE assessment | status (assessed / not required / not done), prophylaxis in place |
| 8 | Medication changes | changes documented, "no changes" flag |
| 9 | Plan and jobs | plan items / jobs for the day, owner per job |
| 10 | Escalation and discharge | escalation / ceiling-of-care status, senior review flag, estimated discharge date |
| 11 | Summary | computed completeness status, completeness percent, fired rules, flagged issues, free-text clinical note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  record-keeping and documentation-completeness support; the output prompts
  completeness and escalation rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- General Medical Council. *Good Medical Practice* — record-keeping standards
  (2024).
- Academy of Medical Royal Colleges. *Standards for the Clinical Structure and
  Content of Patient Records* (2013).
- NICE NG89. *Venous thromboembolism in over 16s: reducing the risk of
  hospital-acquired deep vein thrombosis or pulmonary embolism* (2018).

## Verify

```sh
bin/test-form ward-round-note
```
