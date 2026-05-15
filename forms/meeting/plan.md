# Plan: Meeting

## Current status

Scaffolded 2026-05-13. Design based on the seed in `seed.md` and the
non-clinical pattern established by `forms/issue-tracker/`.

## Why this form exists

Most teams run more meetings than they have records of. The artefact of a
meeting is rarely a structured document — it is a Slack thread, a calendar
invite, and someone's notes. This form treats the meeting itself as the
subject of the assessment and produces a single structured record covering
both the plan (invitation, agenda, participants, resources, recurrence)
and the results (250-character summary, action items, outputs, outcomes).

The form is the non-clinical counterpart in the medical-forms monorepo and
mirrors the structure of `issue-tracker/`. The plan / results split lines
up naturally with the form-and-dashboard pair the rest of the monorepo uses.

## Design principles

- **One continuous single-page wizard** — 10 steps on one page (no multi-page
  forms; monorepo rule).
- **Plan / results symmetry** — every meeting carries both halves; an empty
  results half marks a meeting as still in-progress.
- **250-character summary is a hard rule** — enforced at the database level
  (`CHECK (char_length(summary) <= 250)`).
- **Recurrence is RFC 5545-shaped** — restricted to the seven frequencies
  the seed listed (none / daily / weekday / weekly / monthly / quarterly /
  yearly), so a non-technical user can configure it without learning RRULE
  syntax.
- **Validation engine, not a clinical grader** — a pure function that
  produces fired rules and flags but never blocks save.
- **iCalendar-first interchange** — the canonical export is ICS so the
  record can be reflected back into Google Calendar / Outlook / Apple
  Calendar. FHIR Appointment is provided for clinical MDT use.

## Scoring / validation engine

`validateMeeting(data)` is a pure function with no side effects, exercised
by Vitest. It returns:

- `durationMinutes`, `participantCount`, `acceptedCount` — derived counts.
- `completionStatus` — `planned` / `in-progress` / `complete` / `incomplete`.
- `firedRules` — every rule that triggered, with priority.
- `flags` — non-blocking warnings to surface in the dashboard.

The engine is independent of the persistence layer and is shared between
the SvelteKit front-end and the Rust backend (the Rust copy is hand-ported
and kept in sync via `cargo test`).

## Build order

1. [x] Scaffold directory via `bin/create-form`.
2. [x] Write top-level documentation: `index.md`, `AGENTS.md`, `plan.md`,
       `tasks.md`.
3. [x] Author SQL Liquibase migrations for organizer, meeting,
       agenda_item, participant, resource, recurring_rule, action_item,
       meeting_output, meeting_outcome, meeting_grade, meeting_grade_rule,
       meeting_grade_flag.
4. [x] Generate XML + DTD representations with
       `bin/xml-representations/generate-xml-representations.py`.
5. [x] Generate FHIR HL7 R5 JSON with
       `bin/fhir-r5/generate-fhir-r5-representations.py`.
6. [x] Generate Protocol Buffers with
       `bin/protobuf/generate-protobuf-representations.py`.
7. [x] Build static HTML single-page wizard.
8. [x] Build static HTML dashboard.
9. [ ] Build SvelteKit single-page wizard (deferred — requires `pnpm install`).
10. [ ] Build SvelteKit dashboard with SVAR DataGrid (deferred).
11. [ ] Build Rust full-stack with axum/Loco/Tera/HTMX/Alpine (deferred —
        requires `cargo build`).
12. [ ] Unit-test validation engine (Vitest) (deferred with SvelteKit).
13. [ ] Run `bin/test-form meeting`.

## Future enhancements

- Two-way ICS round-trip with Google Calendar / Outlook / Apple Calendar.
- Live transcription import (Otter, Granola, Fireflies, Zoom).
- Speaker-time analytics from transcript metadata.
- Decision log indexed across meetings.
- Bilingual UI (English / Cymraeg).
- E-signature via SVG path plus SSO claim.
- Webhooks on meeting-completed for downstream automations.
- LocalStorage autosave with draft recovery.
- Axe-core accessibility audit.
- Playwright end-to-end tests.
