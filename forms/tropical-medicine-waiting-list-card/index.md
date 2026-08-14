# Tropical Medicine Waiting List Card

A practitioner-completed administrative card that places a patient on a
tropical medicine waiting list and gives the patient a transparent, easy-to-use view of
their referral, expected wait, and upcoming appointment(s).

The card is aligned with NHS England's *Referral to Treatment (RTT)*
patient-pathway rules and the *Elective recovery* / *Clinical Prioritisation*
framework (P1–P5 / P6). It serves as the single record that records:

- what the patient is waiting to do (procedure, specialty referral, or
  upcoming appointment),
- when the patient joined the list (the RTT clock-start),
- the clinical priority assigned at referral,
- the current target wait and any breaches against the 18-week (and 52-week)
  standards,
- the patient's next appointment, and
- the patient's preferred communication channel and any access needs.

## Scope and intended users

- **Setting:** primary care referral hubs, hospital outpatient booking offices,
  community waiting-list co-ordinators, and patient-facing self-service
  portals.
- **Practitioner users:** GPs, hospital consultants, referral co-ordinators,
  outpatient booking clerks, RTT validators.
- **Patient users:** any patient placed on an NHS or independent-sector
  waiting list who wants to track their position and next appointment.

## Scoring system

- **Primary instrument:** Waiting Time Status (WTS), a four-band category
  computed from the RTT clock-start date, the clinical priority, and the
  scheduled appointment date.
- **Secondary instrument:** Clinical Priority per NHS England clinical
  prioritization (P1 / P2 / P3 / P4 / P5 / P6).
- **Algorithm:** the worst-band finding sets the overall Waiting Time Status.

| Category | Drivers |
| --- | --- |
| Within Target | Days waited ≤ priority target and ≤ 18 weeks; routine tracking only |
| Approaching Breach | Within 4 weeks of priority target or the 18-week RTT standard; booking team review |
| Breached | Past priority target or > 18 weeks since clock-start; RTT validation and patient contact required |
| Long Wait | > 52 weeks since clock-start; mandatory long-waiter review, harm-review trigger |

## 7-step practitioner wizard

Completed in order on a single-page wizard. The practitioner enters
information on behalf of the patient; the resulting card is rendered for the
patient with their position, expected wait, and next appointment.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Practitioner identification | name, role, registration body, registration number, organization, site, date and time of entry |
| 2 | Patient identification | NHS number, name, date of birth, sex, contact details, preferred language, accessibility needs |
| 3 | Referral details | referring source (GP / consultant / A&E / self), referral date, referral letter reference, reason for referral, presenting condition, ICD-10 / SNOMED code |
| 4 | Waiting list entry | list name, specialty, sub-specialty, procedure description (free-text + OPCS-4 code if available), clinical priority (P1–P6), RTT clock-start date, expected procedure or appointment type, expected wait in weeks |
| 5 | Upcoming appointment | next appointment date, time, location (site, clinic, room), clinician or team, appointment type (first / follow-up / pre-assessment / treatment), travel and access notes |
| 6 | Patient communication | preferred contact channel (SMS / email / phone / letter / NHS App), language and interpreter needs, accessibility (BSL, large print, easy read), consent to reminders |
| 7 | Sign-off | computed Waiting Time Status, clinical priority confirmation, additional notes, practitioner signature, date and time of sign-off |

## Safety and operational flags

Computed independently of the Waiting Time Status. Priority: high / medium /
low. Categories include:

- **Breach risk** — within 4 weeks of priority target (medium) or past target
  (high).
- **52-week long waiter** — > 52 weeks since clock-start (high).
- **Priority-1 escalation** — P1 entry whose appointment is more than 7 days
  away (high).
- **Cancer two-week wait** — suspected-cancer referral whose appointment is
  more than 14 days away (high).
- **Missing appointment** — waiting list entry with no scheduled appointment
  more than 14 days after clock-start (medium).
- **Accessibility unmet** — accessibility need recorded but appointment
  location not confirmed as compliant (medium).
- **Interpreter required** — interpreter need recorded but not yet booked
  (medium).
- **Contact details missing** — no email, phone, or postal address (low).

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`, suitable to
  hand to the patient or attach to the patient record.
- **FHIR R5 Bundle** with `Appointment`, `ServiceRequest`, and `Patient`
  resources for integration with hospital electronic referral and PAS
  systems.
- **XML** representation for archival or import into legacy waiting-list
  systems.
- **Patient-facing card view** showing the procedure, joined-on date,
  position on the list, expected wait, next appointment, and contact details
  for queries.

## Directory structure

```
tropical-medicine-waiting-list-card/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  spec.md                                           # living domain spec
  seed.md                                           # original seed brief
  doc/                                              # documentation
  sql/                                   # Liquibase Postgres migrations
  xml/                              # XML + DTD per SQL table
  fhir/r5/                                          # FHIR HL7 R5 JSON resources
  protobuf/                                         # Protocol Buffers per SQL table
  openapi/                                          # OpenAPI 3.1 per SQL table
  front-end-with-html/                         # static single-page practitioner wizard
  front-end-with-svelte/                       # SvelteKit single-page wizard
  front-end-with-html/                    # static dashboard
  front-end-with-svelte/                  # SvelteKit + SVAR DataGrid
  back-end-with-loco/            # Rust axum + Loco JSON API back-end
  back-end-with-loco-setup       # generated scaffold script
```

## Clinical and policy references

- NHS England. *Referral to Treatment (RTT) consultant-led waiting times —
  Rules Suite* (current version).
- NHS England. *Clinical validation of waiting lists* operational guidance.
- NHS England. *Clinical prioritisation* (P1–P5 / P6) framework, originally
  published during COVID-19 elective recovery.
- NHS Constitution for England — operational standards (18-week RTT).
- NHS England. *Elective recovery plan*.
- Royal College of Surgeons of England. *Clinical guide to surgical
  prioritisation during the coronavirus pandemic* (P1–P4 origin).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — administrative
  patient-pathway record; Class I in its current form.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 (Design and development of information for users).
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.
- UK GDPR and the Data Protection Act 2018 — lawful basis for processing
  recorded on the card and surfaced to the patient.

## Verify

```sh
bin/test-form tropical-medicine-waiting-list-card
```
