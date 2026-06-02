# Meeting

A general-purpose **meeting record** form that captures the invitation, agenda,
participants, resources, and recurrence schedule *before* the meeting, and the
summary, action items, outputs, and outcomes *after* the meeting. Each meeting
is captured through a single-page, step-by-step wizard and produces a signed
report suitable for sharing with attendees, attaching to a project tracker, or
archiving as the team's record of the event.

This form is the **non-clinical** counterpart in the monorepo: it reuses the
same scaffold (single-page wizard, SQL → XML → FHIR → protobuf representation,
four front-ends, full-stack Rust backend) but treats the *meeting itself* as
the subject of the assessment.

## Scope and intended users

- **Setting:** any organisation that runs scheduled meetings — engineering
  stand-ups, project reviews, board meetings, customer calls, medical
  multidisciplinary team (MDT) meetings, training sessions, retrospectives.
- **Users:** organisers, secretaries, project managers, team leads,
  facilitators, scrum masters, executive assistants.
- **Subjects:** any meeting that warrants a written record — a single ad-hoc
  call, a recurring weekly stand-up, a quarterly business review, an annual
  general meeting, or a clinical MDT.

## Two-phase structure

A meeting record has two halves: the **plan** (what we intend to do) and the
**results** (what we did).

### Plan — captured before the meeting

| # | Section | Purpose |
| --- | --- | --- |
| 1 | Invitation | Date, time, time zone, duration, location, phone number, video link, dial-in code, joining instructions |
| 2 | Agenda | Ordered list of agenda items with title, duration, presenter, and notes |
| 3 | Participants | Named attendees with role (organiser / required / optional / observer) and response (accepted / declined / tentative / no-response) |
| 4 | Resources | Rooms, equipment, documents, links, budget — anything required for the meeting to succeed |
| 5 | Recurring | Optional recurrence rule — every weekday, every Monday, every month on the *n*th day, every quarter, every year |

### Results — captured during or after the meeting

| # | Section | Purpose |
| --- | --- | --- |
| 6 | Summary | A single paragraph (max 250 characters) describing what happened |
| 7 | Action items | Tasks assigned to a named owner with a due date and status |
| 8 | Outputs | Tangible deliverables produced — documents, decisions, data, recordings |
| 9 | Outcomes | The impact or change resulting from the meeting — goals reached, risks identified, alignment achieved |

## 10-step single-page wizard

Completed in order on one continuous page (no multi-page forms — monorepo rule).

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Organiser & metadata | organiser name, email, role, organisation, time zone, draft / scheduled / completed / cancelled |
| 2 | Title & purpose | meeting title, one-sentence purpose, long description, category (stand-up / review / planning / training / one-to-one / interview / governance / social / other) |
| 3 | Invitation | scheduled start, scheduled end, time zone, location, video link, phone number, dial-in code, joining instructions, calendar UID |
| 4 | Agenda | ordered list — title, duration minutes, presenter, notes |
| 5 | Participants | name, email, role, response status, attendance status |
| 6 | Resources | type (room / equipment / document / link / budget / catering / other), name, quantity, notes |
| 7 | Recurrence | frequency (none / daily / weekday / weekly / monthly / quarterly / yearly), interval, day-of-week, day-of-month, month-of-year, count, until |
| 8 | Summary | one paragraph, hard-capped at 250 characters |
| 9 | Action items, outputs, outcomes | three ordered lists: action items (title, owner, due date, status), outputs (title, kind, URL or notes), outcomes (title, notes) |
| 10 | Sign-off | overall result (productive / partial / unproductive / cancelled), additional notes, electronic signature, signed-at |

## Recurrence model

The recurrence rule mirrors **RFC 5545 (iCalendar) RRULE**, restricted to the
shapes a non-technical user is likely to need:

| Frequency | Example |
| --- | --- |
| `none` | One-off — no recurrence |
| `daily` | Every day, every *n* days |
| `weekday` | Every Monday–Friday |
| `weekly` | Every Monday, every alternate Wednesday |
| `monthly` | The 1st of every month, the *n*th day of every month, the first Monday of every month |
| `quarterly` | The 1st of every quarter, the first weekday of each quarter |
| `yearly` | Every 1 January, every fiscal year start |

The series may end after a fixed count or on a given date (`until`).

## Output

- **HTML report preview** and downloadable **PDF** via `pdfmake`.
- **ICS / iCalendar** export for round-tripping with Google Calendar, Outlook,
  and Apple Calendar.
- **FHIR R5 Appointment + Encounter Bundle** when the meeting is a clinical
  encounter (MDT, ward round, case conference).
- **XML + DTD** archival representation.
- **Protocol Buffers** for service-to-service integration.

## Directory structure

```
meeting/
  index.md                                          # this file
  README.md -> index.md
  AGENTS.md                                         # agent instructions
  CLAUDE.md                                         # claude code instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # original design seed
  doc/                                              # documentation
  sql-migrations/                                   # Liquibase Postgres migrations
  xml-representations/                              # XML + DTD per SQL table
  fhir-r5/                                          # FHIR HL7 R5 JSON per SQL entity
  protobuf/                                         # Protocol Buffers .proto schemas
  typespec/                                         # TypeSpec API definitions
  front-end-form-with-html/                         # static single-page wizard
  front-end-form-with-svelte/                       # SvelteKit single-page wizard
  front-end-dashboard-with-html/                    # review dashboard (HTML)
  front-end-dashboard-with-svelte/                  # review dashboard (SVAR Grid)
  back-end-with-loco/            # Rust backend + server-rendered UI
```

## References

- RFC 5545 — *Internet Calendaring and Scheduling Core Object Specification
  (iCalendar)*. <https://datatracker.ietf.org/doc/html/rfc5545>
- ISO 8601 — *Date and time format*.
- FHIR R5 *Appointment*, *Schedule*, *Encounter* resources.
  <https://hl7.org/fhir/R5/appointment.html>
- Robert's *Rules of Order Newly Revised* (12th ed.) — meeting conduct and
  minute-taking conventions.
- Atlassian *Run effective meetings* playbook.
  <https://www.atlassian.com/team-playbook/plays/run-effective-meetings>

## Compliance

- ISO/IEC/IEEE 26514:2022 — *Design and development of information for users.*
- UK GDPR — when participant lists contain personal data.
- ISO 27001 §A.7.2 / §A.8 — information classification of meeting outputs.

## Verify

```sh
bin/test-form meeting
```
