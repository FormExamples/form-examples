# Patient Room Readiness — Agent Instructions

Facilities/housekeeping room-readiness sign-off: 25 fixed checkpoints
confirming a patient room's bedding, furniture, utilities, bathroom
fittings, and physical fabric are ready for occupancy. No clinical
grading engine — a checked/unchecked confirmation, not a diagnostic
instrument.

See [`index.md`](./index.md) for the full design and the 3-step
wizard table. The 25 checkpoints are catalogued verbatim in
[`spec/index.md`](./spec/index.md).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./spec/index.md` — the 25-checkpoint catalogue (source text)
- `./doc/` — background reference notes
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-with-html/` — single-page HTML wizard (index.html) + dashboard (dashboard.html)
- `./front-end-with-svelte/` — SvelteKit single-page wizard + dashboard
- `./back-end-with-loco/` — Rust backend with a JSON API

## Data model

- **Input shape:** `PatientRoomReadinessChecklist` TypeScript type:
  ```ts
  export interface Location {
    buildingNameOrNumber: string;
    roomNameOrNumber: string;
  }
  export interface RoomChecklist {
    patientCotMattressSideRailings: boolean;
    attendantCotMattress: boolean;
    callBell: boolean;
    cardiacTableIvStand: boolean;
    hotKettleGlasses: boolean;
    linenPatientDress: boolean;
    landlineNumbers: boolean;
    refrigeratorFan: boolean;
    televisionRemote: boolean;
    dustbin: boolean;
    bathTowelHandtowels: boolean;
    wcDustbins: boolean;
    washbasinAndFittings: boolean;
    bucketAndMug: boolean;
    geyser: boolean;
    soapDispenser: boolean;
    toiletKit: boolean;
    windowGlassGrooves: boolean;
    sidewalls: boolean;
    curtainBlind: boolean;
    chairSofa: boolean;
    wallSeepageWaterLeakage: boolean;
    electricityPointsLights: boolean;
    ceilingTiles: boolean;
    doorKnobsStopper: boolean;
  }
  export interface Inspector {
    name: string;
    email: string;
  }
  export interface InspectionMeta {
    date: string; // '' if unanswered
    time: string; // '' if unanswered
  }
  export interface PatientRoomReadinessChecklist {
    location: Location;
    checklist: RoomChecklist;
    inspector: Inspector;
    inspection: InspectionMeta;
  }
  ```
- **Named fields, not a generic item map** — 25 fixed checkpoints
  stays maintainable as individual TypeScript fields (contrast with
  `hospital-daily-monitoring-checklist`'s 97-item generic map).
- **Output/summary:** a pure function `summariseReadiness(data)`
  returning `{ checkedCount: number; uncheckedFields: string[] }` (no
  scoring, just a tally for the report/dashboard).
- **Engine files:** `types.ts`, `factory.ts`, `summary.ts`.
- **Tests:** `summary.test.ts`.

## Conventions

- `''` for unanswered text fields (location, inspector, inspection
  date/time).
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components: `Step1Location.svelte`, `Step2Checklist.svelte`,
  `Step3InspectorSignOff.svelte`.
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.

## SQL shape

A single flat table `patient_room_readiness_checklist` (25 boolean
columns + location + inspector + inspection fields + timestamps) —
unlike `hospital-daily-monitoring-checklist`'s normalized child table,
25 fixed checkpoints is small enough for one wide row per submission,
matching the `agile-checklist` convention.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- a JSON API (no server-rendered templates)
- `serde(rename_all = "camelCase")` for front-end interop

## Verify

```sh
bin/test-form patient-room-readiness
```
