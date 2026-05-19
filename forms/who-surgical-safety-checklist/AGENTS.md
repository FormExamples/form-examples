# WHO Surgical Safety Checklist — Agent Instructions

Digital WHO Surgical Safety Checklist. A three-phase operating-room safety
checklist completed by the operating team: Sign In (before induction of
anaesthesia), Time Out (before skin incision), and Sign Out (before the patient
leaves the operating room).

See [`index.md`](./index.md) for the full design including all checklist items
per phase, safety flag definitions, and completion semantics.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — reference documentation (WHO starter kit, implementation manual)
- `./sql-migrations/` — Postgres schema migrations
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — Protocol Buffers schemas
- `./typespec/` — TypeSpec definitions
- `./front-end-form-with-html/` — static single-page wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid review dashboard
- `./full-stack-with-loco-tera-htmx-alpine/` — Rust backend with HTMX UI
- `./full-stack-with-loco-tera-htmx-alpine-setup` — scaffold generator script

## Data model

The form has four core tables:

- `patient` — basic patient demographics (name, NHS number, DOB).
- `clinician` — operating-team members who can act as checklist coordinator
  (anaesthetist, surgeon, nurse).
- `who_surgical_safety_checklist` — the case record. All three phases are
  columns on this single table to keep one row per surgical case.
- `team_member` — operating-team roster captured during the Time Out
  introductions, child of `who_surgical_safety_checklist`.

## Phase semantics

- Each phase has its own coordinator (`sign_in_coordinator_id`, etc.) and
  sign-off timestamp (`sign_in_completed_at`, etc.).
- An empty string `''` indicates an unanswered enum / text field; `null`
  indicates an unanswered numeric field.
- A phase is **complete** when every required item is answered (not `''`) and
  the coordinator timestamp is set.
- The case is **completed** when all three phases are complete.

## Phase 1 — Sign In fields

- `sign_in_identity_site_procedure_consent` — `yes` / `''`
- `sign_in_site_marked` — `yes` / `not-applicable` / `''`
- `sign_in_anaesthesia_check_complete` — `yes` / `''`
- `sign_in_pulse_oximeter_on_patient` — `yes` / `''`
- `sign_in_known_allergy` — `no` / `yes` / `''`
- `sign_in_known_allergy_detail` — free text
- `sign_in_difficult_airway_aspiration_risk` — `no` / `yes-equipment-available` / `''`
- `sign_in_blood_loss_risk` — `no` / `yes-two-ivs-and-fluids-planned` / `''`
- `sign_in_coordinator_id` — FK to clinician
- `sign_in_completed_at` — timestamp

## Phase 2 — Time Out fields

- `time_out_team_introductions_confirmed` — `yes` / `''`
- `time_out_patient_procedure_incision_confirmed` — `yes` / `''`
- `time_out_antibiotic_prophylaxis_within_60min` — `yes` / `not-applicable` / `''`
- `time_out_surgeon_critical_steps` — free text
- `time_out_surgeon_case_duration_minutes` — integer
- `time_out_surgeon_anticipated_blood_loss_ml` — integer
- `time_out_anaesthetist_patient_concerns` — free text
- `time_out_nursing_sterility_confirmed` — `yes` / `''`
- `time_out_nursing_equipment_concerns` — free text
- `time_out_essential_imaging_displayed` — `yes` / `not-applicable` / `''`
- `time_out_coordinator_id` — FK to clinician
- `time_out_completed_at` — timestamp

## Phase 3 — Sign Out fields

- `sign_out_procedure_name_confirmed` — `yes` / `''`
- `sign_out_counts_confirmed` — `yes` / `no` / `''`
- `sign_out_specimens_labelled` — `yes` / `no` / `not-applicable` / `''`
- `sign_out_equipment_problems` — free text
- `sign_out_recovery_concerns` — free text
- `sign_out_coordinator_id` — FK to clinician
- `sign_out_completed_at` — timestamp

## Case identification fields

- `patient_id` — FK to patient
- `surgeon_id`, `anaesthetist_id`, `lead_nurse_id` — FKs to clinician
- `site_name` — facility / theatre name
- `operating_room` — OR number or name
- `case_date` — date of procedure
- `case_start_at` — wheels-in / induction time (timestamp)
- `case_end_at` — wheels-out time (timestamp)
- `planned_procedure` — text
- `surgical_specialty` — text
- `urgency` — `elective` / `urgent` / `emergency` / `immediate` / `''`
- `laterality` — `left` / `right` / `bilateral` / `midline` / `na` / `''`
- `status` — `not-started` / `sign-in-complete` / `time-out-complete` /
  `sign-out-complete` / `completed` / `abandoned`
- `abandoned_reason` — free text

## Team member roster

- `team_member.checklist_id` — FK to `who_surgical_safety_checklist`
- `team_member.name` — text
- `team_member.role` — `surgeon` / `assistant-surgeon` / `anaesthetist` /
  `circulating-nurse` / `scrub-nurse` / `anaesthetic-assistant` /
  `perfusionist` / `technician` / `observer` / `other` / `''`
- `team_member.introduced_during_time_out` — `yes` / `no` / `''`

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `Step1SignIn.svelte`, `Step2TimeOut.svelte`,
  `Step3SignOut.svelte`, plus `Step0CaseDetails.svelte` and
  `Step4Summary.svelte`.
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` + `deleted_at` timestamps on
  every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for PDF export
- Vitest for engine unit tests
- Dynamic step route `/checklist/[step=step]/+page.svelte` with the `step`
  param matcher validating 0–4.

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (status, urgency, surgical specialty,
  safety flag presence).
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Clinical grounding

- World Health Organization *Safe Surgery Saves Lives Starter Kit*, v1.0.
- WHO *Implementation Manual: Surgical Safety Checklist (First Edition)*.
- Haynes A.B. *et al.* NEJM 2009; 360(5): 491–9.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class I.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA Software and AI as a Medical Device.

## Verify

```sh
bin/test-form who-surgical-safety-checklist
```
