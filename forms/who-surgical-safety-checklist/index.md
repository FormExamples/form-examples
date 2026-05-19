# WHO Surgical Safety Checklist

A digital implementation of the **World Health Organization Surgical Safety
Checklist** (WHO/IER/PSP/2008.05, *Safe Surgery Saves Lives*). The checklist is
a tool for the operating-room team to confirm that a small set of safety steps
have been performed before induction of anaesthesia, before skin incision, and
before the patient leaves the operating room.

This form is completed by the operating team — typically the circulating
nurse, anaesthetist, and surgeon — for every surgical case. The output is a
signed timestamped record of the three phases, the operating-team roster, and
any escalations noted during the case.

## Scope and intended users

- **Setting:** any operating theatre, day-surgery unit, or surgical procedure
  room (in-patient or out-patient), in any country or resource setting.
- **Users:** circulating nurse (typical checklist coordinator), anaesthetist
  / anaesthesia professional, lead surgeon, scrub nurse, surgical assistant.
- **Cases:** every surgical procedure regardless of urgency, including
  elective, urgent, and emergency operations under general, regional, or
  monitored anaesthesia.

## Reference document

- World Health Organization. *Safe Surgery Saves Lives — Starter Kit for
  Surgical Checklist Implementation*, Version 1.0.
  <https://cdn.who.int/media/docs/default-source/patient-safety/safe-surgery/starter_kit-sssl.pdf>

## Three-phase wizard

Completed as a single-page wizard. Each phase has a designated checklist
coordinator (usually the circulating nurse) and the team members required to
be physically present.

### Phase 1 — Sign In (before induction of anaesthesia)

Required participants: at least the **nurse** and **anaesthetist**.

| # | Item | Type |
| --- | --- | --- |
| 1 | Has the patient confirmed his/her identity, site, procedure, and consent? | yes |
| 2 | Is the site marked? | yes / not-applicable |
| 3 | Is the anaesthesia machine and medication check complete? | yes |
| 4 | Is the pulse oximeter on the patient and functioning? | yes |
| 5 | Does the patient have a known allergy? | no / yes (with detail) |
| 6 | Difficult airway or aspiration risk? | no / yes-and-equipment-available |
| 7 | Risk of > 500 ml blood loss (7 ml/kg in children)? | no / yes-two-ivs-and-fluids-planned |

### Phase 2 — Time Out (before skin incision)

Required participants: **nurse**, **anaesthetist**, **surgeon**.

| # | Item | Type |
| --- | --- | --- |
| 1 | Confirm all team members have introduced themselves by name and role | check |
| 2 | Confirm the patient's name, procedure, and where the incision will be made | check |
| 3 | Has antibiotic prophylaxis been given within the last 60 minutes? | yes / not-applicable |
| 4 | Anticipated Critical Events — Surgeon: critical or non-routine steps | free text |
| 5 | Anticipated Critical Events — Surgeon: how long will the case take? | minutes |
| 6 | Anticipated Critical Events — Surgeon: anticipated blood loss? | millilitres |
| 7 | Anticipated Critical Events — Anaesthetist: patient-specific concerns | free text |
| 8 | Nursing Team: sterility (including indicator results) confirmed | yes |
| 9 | Nursing Team: any equipment issues or concerns | free text |
| 10 | Is essential imaging displayed? | yes / not-applicable |

### Phase 3 — Sign Out (before patient leaves operating room)

Required participants: **nurse**, **anaesthetist**, **surgeon**.

| # | Item | Type |
| --- | --- | --- |
| 1 | Nurse verbally confirms: name of the procedure recorded | check |
| 2 | Nurse verbally confirms: instrument, sponge, and needle counts | check |
| 3 | Nurse verbally confirms: specimen labelling (read aloud, including patient name) | check |
| 4 | Nurse verbally confirms: any equipment problems to be addressed | free text |
| 5 | To surgeon, anaesthetist, and nurse: key concerns for recovery and management of this patient | free text |

## Operating-team roster

The Time Out introduction step ("introduce themselves by name and role") is
captured as a `team_member` collection linked to the checklist: each row
records a name, role (surgeon / anaesthetist / nurse / scrub / assistant /
technician / observer), and whether the person was introduced during the
Time Out.

## Completion status

The checklist is *completed* when all three phases have been signed off by the
designated coordinator. Each phase records the coordinator name, role, and
sign-off timestamp.

| Phase status | Driver |
| --- | --- |
| Not started | No items answered |
| Sign In complete | All Sign In items answered + coordinator sign-off |
| Time Out complete | All Time Out items answered + coordinator sign-off |
| Sign Out complete | All Sign Out items answered + coordinator sign-off |
| Completed | All three phases completed |
| Abandoned | Case cancelled before sign-out, with reason |

## Safety flags

Computed independently of phase completion. Priority: high / medium / low.

| Flag | Trigger |
| --- | --- |
| Identity not confirmed | Sign In item 1 unanswered or "no" |
| Site not marked | Sign In item 2 = "no" (and procedure is not bilateral / midline / NA) |
| Anaesthesia check incomplete | Sign In item 3 = "no" |
| Pulse oximeter not functioning | Sign In item 4 = "no" |
| Known allergy flagged | Sign In item 5 = "yes" |
| Difficult airway risk | Sign In item 6 = "yes" |
| High blood-loss risk | Sign In item 7 = "yes" |
| Antibiotic prophylaxis missed | Time Out item 3 = "no" and not-applicable not selected |
| Sterility not confirmed | Time Out item 8 = "no" |
| Imaging missing | Time Out item 10 = "no" and not-applicable not selected |
| Count discrepancy | Sign Out item 2 = "no" |
| Specimen labelling missed | Sign Out item 3 = "no" |
| Equipment problem | Sign Out item 4 has content |

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **FHIR R5 Bundle** exportable for integration with hospital EHR.
- **XML** representation for archival or import into legacy systems.
- **JSON / CSV / TSV** export of completed checklists for audit and analysis.

## Directory structure

```
who-surgical-safety-checklist/
  index.md                                         # this file
  AGENTS.md                                        # agent instructions
  plan.md                                          # implementation roadmap
  tasks.md                                         # task tracking
  doc/                                             # documentation
  sql-migrations/                                  # Liquibase Postgres migrations
  xml-representations/                             # XML + DTD per SQL table
  fhir-r5/                                         # FHIR HL7 R5 JSON resources
  protobuf/                                        # Protocol Buffers .proto schemas
  typespec/                                        # TypeSpec definitions
  front-end-form-with-html/                        # static single-page HTML wizard
  front-end-form-with-svelte/                      # SvelteKit single-page wizard
  front-end-dashboard-with-html/                   # review dashboard (HTML table)
  front-end-dashboard-with-svelte/                 # review dashboard (SVAR Grid)
  full-stack-with-loco-tera-htmx-alpine/           # Rust backend + server-rendered UI
  full-stack-with-loco-tera-htmx-alpine-setup      # scaffold generator script
```

## Clinical references

- World Health Organization. *Safe Surgery Saves Lives: Starter Kit for
  Surgical Checklist Implementation*, Version 1.0. WHO, Geneva, 2008.
- Haynes A.B. *et al.* A surgical safety checklist to reduce morbidity and
  mortality in a global population. *New England Journal of Medicine* 2009;
  360(5): 491–9.
- World Health Organization. *Implementation Manual: WHO Surgical Safety
  Checklist (First Edition)*. WHO, Geneva, 2008.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I where the
  output is a process-adherence record, not a clinical decision-support
  recommendation.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.
- NHS Data Security and Protection Toolkit.

## Verify

```sh
bin/test-form who-surgical-safety-checklist
```
