# Patient Room Readiness

A housekeeping / facilities **room-readiness checklist**, completed by an
inspector immediately before a patient room is handed over for
occupancy. It confirms **25 concrete room-fixture checkpoints** —
bedding and furniture, utilities, bathroom fittings, and the physical
fabric of the room (walls, window, ceiling, door) — are present and in
acceptable condition.

The form is a single-page, 3-step wizard. Each checkpoint is a simple
checked / not-checked confirmation (there is no clinical grading
engine — this is a facilities readiness sign-off, not a diagnostic
instrument).

## Scope and intended users

- **Setting:** any inpatient facility performing a pre-occupancy or
  housekeeping-turnover room check.
- **Respondents:** housekeeping supervisor, ward clerk, facilities
  inspector, or nursing staff performing the handover check.
- **Unit of assessment:** one room, at one point in time (e.g. after
  cleaning/turnover, before the next patient is admitted).

## Checklist structure

25 checkpoints, transcribed verbatim from the source form (see
[`spec/index.md`](./spec/index.md) for the full item list):

Patient Cot/Mattress/side railings, Attendant Cot / Mattress, Call
Bell, Cardiac Table / IV Stand, Hot Kettle / Glasses, Linen / Patient
Dress, Landline / Numbers, Refrigerator / Fan, Television / Remote,
Dustbin, Bath Towel / Handtowels, Wc / Dust bins, Washbasin &
Fittings, Bucket & Mug, Geyser, Soap Dispenser, Toilet Kit, Window
Glass/Groves, Sidewalls, Curtain/Blind, Chair/Sofa, Wall Seepage /
Water Leakage, Electricity Points / Lights, Ceiling/Tiles, Door /
Knobs / Stopper.

## Response model

- **Per-checkpoint:** boolean — checked (ready) or unchecked (not
  ready / needs attention). Named fields, not a generic item map —
  25 fixed checkpoints is small enough to stay maintainable as
  individual TypeScript fields.
- **Location:** building name/number, room name/number.
- **Inspector:** name, email.
- **Inspection:** date, time.

## Wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Location | building name/number, room name/number |
| 2 | Checklist | the 25 room-fixture checkpoints |
| 3 | Inspector & sign-off | inspector name, email, inspection date, inspection time |

## Output

- **HTML report preview** listing any checkpoint left unchecked.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** for monorepo consistency, mapped to a
  generic `QuestionnaireResponse` resource, even though the form is
  non-clinical.
- **XML representation** for archival / legacy import.

## Directory structure

```
patient-room-readiness/
  index.md                                # this file
  AGENTS.md                               # agent instructions
  plan.md                                 # implementation roadmap
  tasks.md                                # task tracking
  spec/                                    # living spec: the 25-item catalogue
  doc/                                     # background reference
  sql/                                     # Liquibase Postgres migrations
  xml/                                     # XML + DTD per SQL table
  fhir/r5/                                 # FHIR R5 JSON resources
  front-end-with-html/                     # static single-page wizard + dashboard
  front-end-with-svelte/                   # SvelteKit single-page wizard + dashboard
  back-end-with-loco/                      # Rust axum + Loco JSON API
```

## Compliance

This form is non-clinical (facilities/housekeeping sign-off, not a
patient record). The monorepo's clinical-software compliance notes
(MDCG 2019-11, UK MDR 2002, MHRA SaMD) do **not** apply. ISO/IEC/IEEE
26514:2022 (information for users) is followed for documentation
quality.

## Verify

```sh
bin/test-form patient-room-readiness
```
