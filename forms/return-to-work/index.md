# Return to Work

A clinician-issued medical certificate authorising an employee's return to
work after illness, injury, or extended absence. The form captures the
clinician's assessment, the period of validity, the patient's fitness
status, any workplace adjustments or restrictions, and a phased-return
plan where applicable. The output is a signed *Statement of Fitness for
Work* (aligned with the UK NHS **Med 3 "Fit Note"**), suitable to give to
the employee and to share with the employer's occupational-health team.

This is the clinical counterpart to the employee's own
self-certification: a clinician (GP, occupational-health physician,
hospital consultant, or registered nurse / pharmacist / physiotherapist
where the local Med 3 scheme permits) examines the patient and signs the
record. Short absences (≤ 7 calendar days in the UK) may be covered by
employee self-certification (SC2) and do not require this form.

## Scope and intended users

- **Setting:** GP practice, occupational health clinic, hospital
  outpatient clinic, A&E follow-up, community pharmacy where authorised
  to issue fit notes.
- **Clinician users:** GPs, occupational-health physicians, hospital
  doctors, nurses, pharmacists, physiotherapists, occupational
  therapists (per the *Fit Note: guidance for healthcare professionals*).
- **Patient users (read-only):** employees receiving the certificate to
  pass to their employer or to their statutory sick pay (SSP) flow.

## Fitness determination

The form computes a fitness status from clinician input:

| Status | When | Employer action |
| --- | --- | --- |
| **Fit for work** | Clinician confirms full recovery, no restrictions | Employee resumes full duties |
| **May be fit for work — with adjustments** | Clinician confirms partial recovery; adjustments listed | Employer arranges adjustments (phased return, amended duties, workplace adaptation, altered hours); if not possible, treat as not fit |
| **Not fit for work** | Clinician confirms unfit; period of incapacity stated | Employee remains absent for the period; SSP / occupational sick pay continues |

A secondary **restriction-priority grade** (`routine` / `standard` /
`restricted` / `high-risk`) summarises the cumulative effect of all
adjustments and is used by the employer's occupational-health team to
plan risk assessments. The grade is computed by the *max-grade* rule:
the most severe adjustment sets the overall grade.

| Priority | Drivers |
| --- | --- |
| Routine | No restrictions; full duties; full hours |
| Standard | Phased return only, or single low-risk adjustment (e.g. reduced screen time) |
| Restricted | Two or more adjustments, or a moderate-risk adjustment (no heavy lifting, no driving, no shift work, sedentary-only) |
| High-risk | Adjustment requiring formal risk assessment (no working at height, no operating machinery, no patient contact, no lone working, no exposure to chemicals / allergens, safety-critical-role restriction) |

## 12-step single-page wizard

Completed in order on a single continuous page. Each step collects
**clinician-observed or clinician-confirmed data** — not patient
self-report alone.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician identification | name, role (GP / OH-physician / hospital-consultant / nurse / pharmacist / physio / OT), GMC/NMC/HCPC/GPhC registration number, site, signature, date |
| 2 | Patient identification | NHS number, name, DOB, sex, contact details, employer name, employer occupational-health contact |
| 3 | Job context | job title, role description, contracted hours per week, shift pattern, safety-critical role (yes/no), DVLA notifiable role (yes/no), employer industry sector |
| 4 | Absence history | first day of absence, total calendar days absent, prior Med 3 reference (if continuation), previous self-certification on record |
| 5 | Reason for absence | primary diagnosis (free text + SNOMED CT / ICD-10), comorbid conditions, mechanism (illness / injury / surgery / mental-health / pregnancy-related / other), workplace cause (yes/no — triggers RIDDOR check) |
| 6 | Current treatment | current medications, ongoing therapy (physiotherapy / counselling / specialist follow-up), date of last consultation, anticipated recovery trajectory |
| 7 | Functional assessment | mobility, manual handling capacity, cognition, mood, sleep, pain (0-10), driving capacity, tolerance for standing / sitting / screen-time, current ADL independence |
| 8 | Fitness statement | overall outcome (fit / may be fit / not fit), clinician confidence (high / medium / low), period of validity (start date, end date *or* number of weeks), whether reassessment is required at expiry |
| 9 | Phased return plan | applicable (yes/no), week-by-week hours-per-week ramp, target full-hours date, days-per-week schedule, support contact at workplace |
| 10 | Workplace adjustments and restrictions | enumerated checkboxes: altered hours, amended duties, workplace adaptations, no heavy lifting (with kg limit), no driving, no operating machinery, no working at height, no lone working, no night shifts, no patient contact, sedentary only, no exposure to (allergen / chemical / temperature extreme), screen-break frequency, workstation review required, free-text additional adjustments |
| 11 | Follow-up plan | review at GP / OH / specialist clinic, review date, occupational-health referral made (yes/no), DVLA notification required (yes/no), employer occupational-health team notified (yes/no) |
| 12 | Sign-off | computed restriction-priority grade, fired rules, additional flags, clinician override + reason (optional), free-text final notes, electronic signature, statement-of-fitness output preview |

## Safety flags

Computed independently of the fitness statement. Priority: high /
medium / low.

- **Safety-critical role with active restriction** — patient holds a
  safety-critical role and any restriction fires (high).
- **DVLA notifiable condition** — medical condition is in Group 1 or
  Group 2 notifiable list (high).
- **Workplace cause with no RIDDOR record** — mechanism is "workplace"
  and no RIDDOR reference recorded (high).
- **Phased return without target date** — phased return is selected but
  target full-hours date is missing (medium).
- **Adjustment without risk-assessment trigger** — high-risk adjustment
  (working at height, lone working, machinery, patient contact)
  selected but `workstation_review_required = no` (medium).
- **Period of incapacity > 28 days** — total absence has exceeded 28
  days and OH referral has not been made (medium).
- **Mental-health diagnosis with no follow-up** — primary diagnosis is
  in the mental-health SNOMED subset and no review date is set (high).
- **Pregnancy-related absence with no maternity flag** — mechanism is
  "pregnancy-related" and no MAT B1 reference is on file (medium).
- **Clinician confidence "low"** — clinician marked confidence as low
  without a follow-up review (low).

## Outputs

- **HTML report preview** of the signed *Statement of Fitness for Work*
  modelled on the NHS Med 3 layout.
- **Downloadable PDF** via `pdfmake`.
- **FHIR R5 Bundle** with `Patient`, `Practitioner`, `Encounter`,
  `Condition`, `CarePlan`, and `DocumentReference` resources.
- **XML** archival representation.
- **Statement summary** suitable for inclusion in the employer's
  occupational-health record.

## Directory structure

```
return-to-work/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # original brief
  doc/                                              # documentation
  sql-migrations/                                   # Liquibase Postgres migrations
  xml-representations/                              # XML + DTD per SQL table
  fhir-r5/                                          # FHIR HL7 R5 JSON resources
  protobuf/                                         # Protocol Buffers schemas
  typespec/                                         # TypeSpec schemas
  front-end-form-with-html/                         # static single-page HTML wizard
  front-end-form-with-svelte/                       # SvelteKit single-page wizard
  front-end-dashboard-with-html/                    # review dashboard (HTML table)
  front-end-dashboard-with-svelte/                  # review dashboard (SVAR Grid)
  full-stack-with-loco-tera-htmx-alpine/            # Rust backend + server-rendered UI
  full-stack-with-loco-tera-htmx-alpine-new/        # scaffold generator
```

## Clinical and regulatory references

- UK Department for Work and Pensions. *Statement of Fitness for Work
  (Med 3): guidance for healthcare professionals.*
  <https://www.gov.uk/government/publications/fit-note-guidance-for-healthcare-professionals>
- UK gov.uk. *The fit note: guidance for patients and employees.*
  <https://www.gov.uk/government/publications/the-fit-note-a-guide-for-patients-and-employees/the-fit-note-guidance-for-patients-and-employees>
- UK gov.uk. *Fit Note collection.* <https://www.gov.uk/government/collections/fit-note>
- NHS Employers. *Fit Note FAQ for line managers.*
- Acas. *Return-to-work meeting template.*
  <https://www.acas.org.uk/return-to-work-meeting-template>
- HSE. *RIDDOR — Reporting of Injuries, Diseases and Dangerous
  Occurrences Regulations 2013.*
- DVLA. *Assessing fitness to drive — a guide for medical
  professionals.*
- Equality Act 2010 — reasonable-adjustment duty.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical
  decision support, generally Class I (information presentation) unless
  the output drives an automated employer action.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- UK GDPR + Data Protection Act 2018 (occupational-health data are
  special-category personal data).

## Verify

```sh
bin/test-form return-to-work
```
