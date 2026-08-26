# Meeting — Documentation Agent Instructions

This directory holds reference documentation for the meeting form. It is
human-authored prose; no generator writes here.

## Contents

- `./index.md` — overview of the documentation set
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)

## Topics covered

- The 10-step single-page wizard and the plan / results split.
- RFC 5545 RRULE — the seven recurrence frequencies supported (`none`,
  `daily`, `weekday`, `weekly`, `monthly`, `quarterly`, `yearly`) and
  the subset of RRULE parts the form emits.
- FHIR R5 *Appointment*, *Schedule*, and *Encounter* mapping for the
  clinical MDT use case.
- iCalendar (`.ics`) round-trip behaviour with Google Calendar,
  Microsoft Outlook, and Apple Calendar.
- Validation engine rules — the named rules that `validateMeeting()`
  can fire and the flags it surfaces on the dashboard.

## Conventions

- British English spelling (organizer, behaviour, optimize).
- Markdown, no HTML.
- Reference URLs are bare angle-bracket links: `<https://...>`.
- Tables use GitHub-flavoured pipe syntax with a separator row.

## Verify

```sh
bin/test-form meeting
```
