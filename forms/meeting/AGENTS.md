# Meeting — Agent Instructions

A general-purpose meeting record. Captures **plan** (invitation, agenda,
participants, resources, recurrence) and **results** (250-character summary,
action items, outputs, outcomes) via a 10-step single-page wizard. Produces
a signed report plus iCalendar, FHIR Appointment / Encounter, XML, and
protobuf representations.

See [`index.md`](./index.md) for the full design and the 10-step wizard table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — original design seed
- `./doc/` — reference documentation (recurrence rules, FHIR mapping, ICS notes)
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./typespec/` — TypeSpec API surface definitions
- `./front-end-form-with-html/` — static single-page wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid review
- `./back-end-with-loco/` — Rust backend with server-
  rendered HTMX UI

## Data model

The meeting form has one main entity, `meeting`, plus six child collections
plus a single recurrence row:

| Entity | Cardinality | Purpose |
| --- | --- | --- |
| `organizer` | many meetings : 1 organiser | Person who schedules and signs the record |
| `meeting` | top-level | Invitation metadata + 250-char summary + sign-off |
| `agenda_item` | 0..n per meeting | Ordered list of agenda topics |
| `participant` | 0..n per meeting | Named attendees with role + response + attendance |
| `resource` | 0..n per meeting | Rooms, equipment, documents, budget |
| `recurring_rule` | 0..1 per meeting | RFC 5545 RRULE-style recurrence |
| `action_item` | 0..n per meeting | Task assigned to an owner with due date and status |
| `meeting_output` | 0..n per meeting | Tangible deliverables — documents, decisions, data |
| `meeting_outcome` | 0..n per meeting | Impact, change, or alignment achieved |

All tables share the monorepo convention: UUIDv4 primary key,
`created_at`, `updated_at`, `deleted_at` timestamps, `set_updated_at`
trigger.

## Validation engine

Unlike the clinical assessment forms, the meeting form does not compute a
medical grade. Instead it runs a **validation engine** that checks the
record for structural problems and produces a list of *fired rules* and
*safety flags*:

```ts
validateMeeting(data: Meeting): {
  durationMinutes: number;
  participantCount: number;
  acceptedCount: number;
  completionStatus: 'planned' | 'in-progress' | 'complete' | 'incomplete';
  firedRules: FiredRule[];
  flags: ValidationFlag[];
}
```

Examples of fired rules:

- `summary-over-limit` — summary exceeds the 250-character ceiling.
- `no-organizer` — no organiser identified.
- `no-participants` — zero participants on a completed meeting.
- `no-agenda` — completed meeting with no agenda items.
- `no-outcomes` — completed meeting with no recorded outcomes.
- `start-after-end` — scheduled end precedes scheduled start.
- `recurring-without-until` — recurrence rule with neither `count` nor `until`.
- `action-item-overdue` — open action item past its due date.

Flags are non-blocking — the record is still saved, but the dashboard
surfaces the issues for the organiser to fix.

## Recurrence

The `recurring_rule` table maps directly to an iCalendar `RRULE` and is
emitted verbatim into the ICS export. Supported `frequency` values are
`none`, `daily`, `weekday`, `weekly`, `monthly`, `quarterly`, `yearly`.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields and timestamps.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` timestamps
  on every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests
- Dynamic step route `/meeting/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–10.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (status, category, result).
- Backend API client with sample-data fallback.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Compliance

- RFC 5545 — iCalendar recurrence syntax.
- ISO/IEC/IEEE 26514:2022 — Design and development of information for users.
- UK GDPR — participant personal data minimisation.

## Verify

```sh
bin/test-form meeting
```
