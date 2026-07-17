# Podiatric Surgery Waiting List Card — Agent Instructions

A practitioner-completed administrative card that places a patient on a
podiatric surgery waiting list and gives the patient a transparent view of their
referral, expected wait, and upcoming appointment.

See [`index.md`](./index.md) for the full design and the 7-step wizard table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec.md` — living domain spec for spec-driven development
- `./seed.md` — original seed brief
- `./doc/` — RTT / clinical-prioritisation reference notes
- `./sql/` — Liquibase-formatted Postgres schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers per SQL entity
- `./openapi/` — generated OpenAPI 3.1 per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard (SVAR DataGrid)
- `./back-end-with-loco/` — Rust axum + Loco JSON API back-end

## Scoring engine

- **Input shape:** `WaitingListCard` TypeScript type containing practitioner,
  patient, referral, waiting-list-entry, appointment, communication, and
  sign-off fields.
- **Output shape:**

  ```ts
  calculateWaitingTimeStatus(card: WaitingListCard): {
    waitingTimeStatus: 'within-target' | 'approaching-breach' | 'breached' | 'long-wait';
    clinicalPriority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
    daysWaited: number;
    weeksWaited: number;
    daysToTarget: number | null;
    daysToBreach: number | null;
    daysToAppointment: number | null;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```

- **Algorithm:** the worst-band finding sets the Waiting Time Status; the
  clinical priority drives the target wait used in the days-to-target /
  days-to-breach calculation.
- **Engine files:** `types.ts`, `utils.ts`, `priority-targets.ts`,
  `waiting-time-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `waiting-time-rules.test.ts`.

## Priority targets

The clinical priority determines the maximum permitted wait. These targets
mirror the NHS England Clinical Prioritisation framework (P1–P6) and the
overarching 18-week RTT standard.

| Priority | Maximum wait | Use |
| --- | --- | --- |
| P1a | 24 hours | Emergency surgery |
| P1b | 72 hours | Urgent surgery |
| P2 | 4 weeks | Cancer / time-critical |
| P3 | 12 weeks | Substantial harm risk if delayed > 3 months |
| P4 | 18 weeks | Routine — covered by the RTT standard |
| P5 | 6 months | Deferred — patient choice or capacity |
| P6 | N/A | Removed from list (treated, declined, deceased, moved) |

A patient still on the list at 52 weeks is flagged as a **long waiter**
regardless of priority.

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed; no spaces).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`, `$effect`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for server-side PDF
- Vitest for engine unit tests
- Dynamic step route `/card/[step=step]/+page.svelte` with the `step`
  param matcher validating 1–7.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns; dropdown filters on specialty, clinical priority, and
  Waiting Time Status.
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Verify

```sh
bin/test-form podiatric-surgery-waiting-list-card
```
